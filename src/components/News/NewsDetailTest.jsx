import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api';

const NewsDetailTest = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}/`);
        
        if (!response.ok) {
          throw new Error('Новость не найдена');
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!article) {
    return <div>Новость не найдена</div>;
  }

  return (
    <div>
      <h1>{article.title || 'Без заголовка'}</h1>
      <p>Автор: {article.author || 'Неизвестно'}</p>
      <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Контент отсутствует</p>' }} />
      <Link to="/news">← Назад к новостям</Link>
    </div>
  );
};

export default NewsDetailTest;
