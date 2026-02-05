import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Regulations = () => {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

      // Убеждаемся, что данные являются массивами
      const documentsArray = Array.isArray(documentsData) ? documentsData : 
                            (documentsData.results && Array.isArray(documentsData.results)) ? documentsData.results : [];
      
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];

      setDocuments(documentsArray);
      setCategories(categoriesArray);
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
    const timeoutId = setTimeout(() => {
      fetchData();
    }, searchTerm ? 500 : 0); // Дебонсинг для поиска

    return () => clearTimeout(timeoutId);
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
    if (!obj || !field) return '';
    const langField = `${field}_${currentLanguage}`;
    return obj[langField] || obj[`${field}_ru`] || obj[field] || '';
  };

  const categoryIcons = {
    foundational: ArchiveBoxIcon,
    academic: DocumentTextIcon,
    administrative: ClockIcon,
    research: DocumentIcon
  };

  const categoryColors = {
    foundational: 'bg-purple-100 text-purple-800',
    academic: 'bg-blue-100 text-blue-800',
    administrative: 'bg-green-100 text-green-800',
    research: 'bg-amber-100 text-amber-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const getCategoryColor = (categoryName) => {
    return categoryColors[categoryName] || categoryColors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <DocumentIcon className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-6 text-lg font-medium text-gray-700 animate-pulse">...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-3">Ошибка загрузки</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 transform transition-all duration-500 hover:rotate-12">
            <DocumentTextIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t('regulations.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('regulations.subtitle')}
          </p>
        </div>

        {/* Documents Grid */}
        {Array.isArray(documents) && documents.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {documents.map(doc => {
              const CategoryIcon = categoryIcons[doc.category_name] || DocumentIcon;
              return (
                <div 
                  key={doc.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group"
                >
                  <div className="p-8">
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${getCategoryColor(doc.category_name)} transition-colors duration-300 group-hover:scale-110`}>
                          <CategoryIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {getLocalizedValue(doc, 'title')}
                          </h3>
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category_name)}`}>
                            {getLocalizedValue(doc, 'category_display')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {getLocalizedValue(doc, 'description')}
                    </p>

                    {/* Document Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {t('regulations.lastUpdated')}: {new Date(doc.updated_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      {doc.file_size && (
                        <div className="flex items-center space-x-2">
                          <ArchiveBoxIcon className="h-4 w-4" />
                          <span>{t('regulations.fileSize')}: {doc.file_size}</span>
                        </div>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg group/button"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-y-1" />
                      <span>{t('regulations.downloadPdf')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
              <DocumentIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              {t('regulations.noDocuments')}
            </h3>
          </div>
        )}

        {/* Internal Documents Note */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              {t('regulations.internalDocuments')}
            </h3>
            <p className="text-blue-100 leading-relaxed max-w-3xl">
              {t('regulations.documentsAbout')}
             
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regulations; 