import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Regulations = () => {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentLanguage = i18n.language;

  // Функция для получения данных с бэкенда
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Получение документов
      const documentsParams = new URLSearchParams({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const [documentsResponse, categoriesResponse] = await Promise.all([
        fetch(`https://med-backend-d61c905599c2.herokuapp.com/api/documents/?${documentsParams}`),
        fetch('https://med-backend-d61c905599c2.herokuapp.com/api/documents/categories/')
      ]);

      if (!documentsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Ошибка при загрузке данных');
      }

      const documentsData = await documentsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setDocuments(documentsData.results || documentsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента и изменении фильтров
  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchTerm]);

  // Функция для скачивания документа
  const handleDownload = async (doc) => {
    try {
      const response = await fetch(doc.download_url);
      
      if (!response.ok) {
        throw new Error('Ошибка при скачивании файла');
      }

      // Получение blob данных
      const blob = await response.blob();
      
      // Создание ссылки для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.filename || `document_${doc.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Очистка
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`Ошибка при скачивании: ${error.message}`);
    }
  };

  // Получение локализованного значения
  const getLocalizedValue = (obj, field) => {
    const langField = `${field}_${currentLanguage}`;
    return obj[langField] || obj[`${field}_ru`] || obj[field] || '';
  };

  const categoryIcons = {
    foundational: ArchiveBoxIcon,
    academic: DocumentTextIcon,
    administrative: ClockIcon,
    research: DocumentIcon
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Загрузка документов...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Ошибка загрузки</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('regulations.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('regulations.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row ">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('regulations.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full  pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

          </div>
        </div>

        {/* Documents Grid */}
        {documents.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {documents.map(doc => {
              const CategoryIcon = categoryIcons[doc.category_name] || DocumentIcon;
              return (
                <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {getLocalizedValue(doc, 'title')}
                          </h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {getLocalizedValue(doc, 'category_display')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {getLocalizedValue(doc, 'description')}
                    </p>

                    {/* Document Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {t('regulations.lastUpdated')}: {new Date(doc.updated_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      {doc.file_size && (
                        <div className="flex items-center space-x-1">
                          <ArchiveBoxIcon className="h-4 w-4" />
                          <span>{t('regulations.fileSize')}: {doc.file_size}</span>
                        </div>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>{t('regulations.downloadPdf')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('regulations.noDocuments')}
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить критерии поиска
            </p>
          </div>
        )}

        {/* Internal Documents Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {t('regulations.internalDocuments')}
          </h3>
          <p className="text-blue-800 leading-relaxed">
            Все представленные документы являются официальными нормативно-правовыми актами университета. 
            Документы регулярно обновляются в соответствии с изменениями в законодательстве и внутренней политике университета.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Regulations;
