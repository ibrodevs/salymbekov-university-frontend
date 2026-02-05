import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Publications = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // 'ru', 'en', или 'kg'
  
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [filters, setFilters] = useState({
    yearRange: [2018, 2024],
    author: '',
    journal: '',
    minCitations: 0
  });

  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'desc' });
  const [selectedChart, setSelectedChart] = useState('bar');
  const [selectedPublications, setSelectedPublications] = useState(new Set());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedPublication, setExpandedPublication] = useState(null);

  // Handle window resize for responsive pie chart
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функции для получения данных на текущем языке
  const getPublicationTitle = (publication) => {
    return publication[`title_${currentLang}`] || publication.title_ru || publication.title || 'Название недоступно';
  };

  const getPublicationAuthors = (publication) => {
    return publication[`authors_${currentLang}`] || publication.authors_ru || publication.authors || 'Авторы не указаны';
  };

  const getPublicationJournal = (publication) => {
    return publication[`journal_${currentLang}`] || publication.journal_ru || publication.journal || 'Журнал не указан';
  };

  const getPublicationAbstract = (publication) => {
    return publication[`abstract_${currentLang}`] || publication.abstract_ru || publication.abstract || 'Аннотация недоступна';
  };

  // Функция для получения данных из API
  const fetchData = async () => {
    try {
      setLoading(true);
      const publicationsResponse = await fetch('https://med-backend-d61c905599c2.herokuapp.com/research/api/publications/');
      
      if (!publicationsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const publicationsData = await publicationsResponse.json();
      
      setPublicationsData(publicationsData.results || publicationsData);
      setError(null);
    } catch (err) {
      setError(t('research.publications.errorLoading') || 'Ошибка загрузки данных');
      console.error('Error fetching data:', err);
      setPublicationsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения отфильтрованных данных
  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        publication_date__year__gte: filters.yearRange[0],
        publication_date__year__lte: filters.yearRange[1],
        citations_count__gte: filters.minCitations,
        ordering: sortConfig.direction === 'asc' ? sortConfig.key : `-${sortConfig.key}`
      });

      if (filters.author) params.append('authors_ru__icontains', filters.author);
      if (filters.journal) params.append('journal_ru__icontains', filters.journal);

      const response = await fetch(`https://med-backend-d61c905599c2.herokuapp.com/research/api/publications/?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch filtered data');
      }
      
      const data = await response.json();
      setPublicationsData(data.results || data);
      setError(null);
    } catch (err) {
      setError(t('research.publications.errorLoading') || 'Ошибка загрузки данных');
      console.error('Error fetching filtered data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Загрузка данных с фильтрами
  useEffect(() => {
    if (publicationsData.length > 0) {
      fetchFilteredData();
    }
  }, [filters, sortConfig]);

  // Уникальные значения для фильтров
  const uniqueValues = useMemo(() => ({
    authors: [...new Set(publicationsData.flatMap(pub => {
      const authors = getPublicationAuthors(pub);
      return authors.split(',').map(author => author.trim()).filter(Boolean);
    }))],
    journals: [...new Set(publicationsData.map(pub => getPublicationJournal(pub)).filter(Boolean))],
    years: publicationsData.length > 0 
      ? [...new Set(publicationsData.map(pub => pub.publication_date ? new Date(pub.publication_date).getFullYear() : pub.publication_year || pub.year).filter(Boolean))].sort()
      : [2018, 2019, 2020, 2021, 2022, 2023, 2024]
  }), [publicationsData, currentLang]);

  // Статистика для графиков
  const chartData = useMemo(() => {
    if (publicationsData.length === 0) return [];
    
    const yearData = publicationsData.reduce((acc, pub) => {
      const year = pub.publication_date ? new Date(pub.publication_date).getFullYear() : pub.publication_year || pub.year;
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(yearData).map(([year, count]) => ({
      year: parseInt(year),
      publications: count
    })).sort((a, b) => a.year - b.year);
  }, [publicationsData]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFileDownload = async (publicationId, fileName) => {
    try {
      // Fetch the detailed publication data to get the file URL
      const response = await fetch(`http://127.0.0.1:8000/research/api/publications/${publicationId}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch publication details');
      }
      
      const publication = await response.json();
      
      if (publication.file) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = publication.file;
        link.download = fileName || `publication_${publicationId}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(t('research.publications.fileNotAvailable') || 'Файл недоступен для скачивания');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert(t('research.publications.downloadError') || 'Ошибка при скачивании файла');
    }
  };

  const togglePublicationSelection = (id) => {
    const newSelection = new Set(selectedPublications);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPublications(newSelection);
  };

  const togglePublicationExpand = (id) => {
    setExpandedPublication(expandedPublication === id ? null : id);
  };

  const renderMobilePublication = (pub) => (
    <div key={pub.id} className="bg-white rounded-lg shadow-sm p-4 mb-3 border">
      <div className="flex justify-between items-start mb-2">
        <input
          type="checkbox"
          checked={selectedPublications.has(pub.id)}
          onChange={() => togglePublicationSelection(pub.id)}
          className="h-4 w-4 text-blue-600 rounded mt-1"
        />
        <button
          onClick={() => togglePublicationExpand(pub.id)}
          className="text-blue-600 text-sm"
        >
          {expandedPublication === pub.id ? 
            (t('research.publications.collapse') || 'Свернуть') : 
            (t('research.publications.expand') || 'Подробнее')
          }
        </button>
      </div>

      <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
        {getPublicationTitle(pub)}
      </h3>

      <div className="text-xs text-gray-600 mb-2">
        <strong>{t('research.publications.authors') || 'Авторы'}:</strong> {getPublicationAuthors(pub)}
      </div>

      <div className="text-xs text-gray-600 mb-2">
        <strong>{t('research.publications.journal') || 'Журнал'}:</strong> {getPublicationJournal(pub)}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {pub.publication_date ? new Date(pub.publication_date).getFullYear() : pub.publication_year || pub.year}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {pub.citations_count || pub.citation_count || 0} {t('research.publications.citations') || 'цитат'}
        </span>
      </div>

      {expandedPublication === pub.id && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-600 mb-2">
            <strong>DOI:</strong> {pub.doi || t('research.publications.noDoi') || 'Не указано'}
          </div>
          <p className="text-xs text-gray-600 italic mb-3">
            {getPublicationAbstract(pub)}
          </p>
          
          {/* Download button for mobile */}
          <button
            onClick={() => handleFileDownload(pub.id, `${getPublicationTitle(pub)}.pdf`)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            {t('research.publications.downloadFile') || 'Скачать файл'}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            {t('research.publications.title') || 'Научные публикации'}
          </h1>
          <p className="text-sm md:text-xl text-gray-600">
            {t('research.publications.subtitle') || 'База публикаций исследователей Университета Салымбекова'}
          </p>
        </div>

        {/* Кнопка фильтров для мобильных */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full p-3 bg-white rounded-xl shadow-md flex items-center justify-between"
          >
            <span className="font-medium text-gray-700">{t('research.publications.filters.title') || 'Фильтры публикаций'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Фильтры */}
        <div className={`bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6">
            {t('research.publications.filters.title') || 'Фильтры публикаций'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Год публикации */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('research.publications.filters.year') || 'Год публикации'}: {filters.yearRange[0]} - {filters.yearRange[1]}
              </label>
              <input
                type="range"
                min={uniqueValues.years.length > 0 ? Math.min(...uniqueValues.years) : 2018}
                max={uniqueValues.years.length > 0 ? Math.max(...uniqueValues.years) : 2024}
                value={filters.yearRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearRange: [prev.yearRange[0], parseInt(e.target.value)]
                }))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{uniqueValues.years.length > 0 ? Math.min(...uniqueValues.years) : 2018}</span>
                <span>{uniqueValues.years.length > 0 ? Math.max(...uniqueValues.years) : 2024}</span>
              </div>
            </div>

            {/* Автор */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('research.publications.filters.author') || 'Автор'}
              </label>
              <select
                value={filters.author}
                onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('research.publications.filters.allAuthors') || 'Все авторы'}</option>
                {uniqueValues.authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Журнал */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('research.publications.filters.journal') || 'Журнал'}
              </label>
              <select
                value={filters.journal}
                onChange={(e) => setFilters(prev => ({ ...prev, journal: e.target.value }))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('research.publications.filters.allJournals') || 'Все журналы'}</option>
                {uniqueValues.journals.map(journal => (
                  <option key={journal} value={journal}>{journal}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Цитатный индекс */}
          <div className="mt-4 md:mt-6">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              {t('research.publications.minCitations') || 'Минимальный индекс цитирования'}: {filters.minCitations}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minCitations}
              onChange={(e) => setFilters(prev => ({ ...prev, minCitations: parseInt(e.target.value) }))}
              className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Кнопка применения фильтров для мобильных */}
          <div className="md:hidden mt-4">
            <button
              onClick={() => setIsFiltersOpen(false)}
              className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Применить фильтры
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-0">
              {t('research.publications.statisticsTitle') || 'Статистика публикаций'}
            </h2>
            <div className="flex space-x-1 md:space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedChart('bar')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap ${
                  selectedChart === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {t('research.publications.charts.bar') || 'Столбчатая'}
              </button>
              <button
                onClick={() => setSelectedChart('line')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap ${
                  selectedChart === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {t('research.publications.charts.line') || 'Линейная'}
              </button>
            </div>
          </div>

          <div className="h-60 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedChart === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="publications" fill="#3B82F6" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="publications" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Таблица публикаций */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
            <h2 className="text-lg md:text-2xl font-semibold">
              {t('research.publications.title') || 'Публикации'} ({publicationsData.length})
            </h2>
          </div>

          {/* Мобильная версия */}
          <div className="md:hidden">
            {publicationsData.map(renderMobilePublication)}
            
            {publicationsData.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                {t('research.publications.noResults') || 'Публикации не найдены по выбранным фильтрам'}
              </div>
            )}
          </div>

          {/* Десктопная версия */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('research.publications.table.select') || 'Выбор'}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    {t('research.publications.table.title') || 'Название'} {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('authors')}
                  >
                    {t('research.publications.table.authors') || 'Авторы'} {sortConfig.key === 'authors' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('journal')}
                  >
                    {t('research.publications.table.journal') || 'Журнал'} {sortConfig.key === 'journal' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('year')}
                  >
                    {t('research.publications.table.year') || 'Год'} {sortConfig.key === 'year' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('citation_index')}
                  >
                    {t('research.publications.table.citations') || 'Цитаты'} {sortConfig.key === 'citation_index' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('research.publications.table.actions') || 'Действия'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {publicationsData.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPublications.has(pub.id)}
                        onChange={() => togglePublicationSelection(pub.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{getPublicationTitle(pub)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {getPublicationAuthors(pub)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {getPublicationJournal(pub)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pub.publication_date ? new Date(pub.publication_date).getFullYear() : pub.publication_year || pub.year}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {pub.citations_count || pub.citation_count || pub.citation_index || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleFileDownload(pub.id, `${getPublicationTitle(pub)}.pdf`)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {t('research.publications.downloadFile') || 'Скачать'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {publicationsData.length === 0 && (
            <div className="hidden md:block text-center py-12 text-gray-500">
              {t('research.publications.noResults') || 'Публикации не найдены по выбранным фильтрам'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publications;