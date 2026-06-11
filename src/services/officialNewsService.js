// Получение новостей напрямую с официального сайта salymbekov.com (WordPress REST API).
// Работает полностью на фронтенде, без обращения к нашему бэкенду.
// Клик по новости ведёт на оригинал (поле sourceUrl).

const WP_API = 'https://salymbekov.com/wp-json/wp/v2/posts';

// Убирает HTML-теги и декодирует HTML-сущности
const stripHtml = (value) => {
  if (!value) return '';
  const doc = new DOMParser().parseFromString(value, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
};

const getImage = (post) => {
  // 1) Open Graph изображение (Yoast SEO) — есть почти всегда
  const og = post?.yoast_head_json?.og_image;
  if (Array.isArray(og) && og[0]?.url) return og[0].url;
  // 2) Первая картинка из содержимого статьи
  const content = post?.content?.rendered || '';
  const match = content.match(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match) return match[1];
  return null;
};

const normalize = (post) => {
  const title = stripHtml(post?.title?.rendered).slice(0, 300);
  let summary = stripHtml(post?.excerpt?.rendered);
  // Убираем хвост "[…]" / "Read more"
  summary = summary.replace(/\[(?:…|\.\.\.|hellip)\]\s*$/i, '').trim();
  if (!summary) summary = stripHtml(post?.content?.rendered).slice(0, 200);
  return {
    id: post.id,
    title,
    summary,
    date: post.date_gmt ? `${post.date_gmt}Z` : post.date,
    imageUrl: getImage(post),
    sourceUrl: post.link,
    isFeatured: false,
  };
};

const PER_PAGE = 100;

const fetchPage = async (page, perPage = PER_PAGE) => {
  const url = `${WP_API}?per_page=${perPage}&page=${page}&orderby=date&order=desc`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const posts = await response.json();
  return { posts, totalPages };
};

// Быстрый запрос: только последние `count` новостей (одна лёгкая страница).
// Используется для мгновенного первого рендера, пока подгружается остальное.
export const getLatestNews = async (count = 3) => {
  const { posts } = await fetchPage(1, count);
  const news = posts.map(normalize).filter((item) => item.title);
  news.forEach((item, i) => { item.isFeatured = i < 2; });
  return news;
};

// Возвращает ВСЕ новости с официального сайта (постранично).
export const getOfficialNews = async () => {
  const first = await fetchPage(1);
  let allPosts = [...first.posts];

  if (first.totalPages > 1) {
    const pages = [];
    for (let p = 2; p <= first.totalPages; p++) pages.push(p);
    const results = await Promise.all(pages.map((p) => fetchPage(p).catch(() => ({ posts: [] }))));
    results.forEach((r) => { allPosts = allPosts.concat(r.posts); });
  }

  const news = allPosts.map(normalize).filter((item) => item.title);
  news.forEach((item, i) => { item.isFeatured = i < 2; });
  return news;
};

export default { getOfficialNews, getLatestNews };
