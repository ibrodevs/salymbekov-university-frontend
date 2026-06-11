import Parser from 'rss-parser';

export default async function handler(req, res) {
  const parser = new Parser({
    customFields: {
      item: [
        ['content:encoded', 'contentEncoded'],
        ['media:content', 'mediaContent'],
        // The feed uses a non-standard lowercase <pubdate> tag, which
        // rss-parser does not map to item.pubDate. Capture it explicitly.
        ['pubdate', 'pubDateRaw'],
      ],
    }
  });

  // Pick the first real image from post content. WordPress lazy-loading puts a
  // blank.gif placeholder in src and the actual image in data-src, so prefer
  // data-src and skip placeholders / data-URIs.
  const extractImage = (content) => {
    const isReal = (u) => u && /^https?:\/\//i.test(u) && !/blank\.gif|data:image/i.test(u);
    const tags = content.match(/<img[^>]+>/gi) || [];
    for (const tag of tags) {
      for (const attr of ['data-src', 'data-lazy-src', 'src']) {
        const m = tag.match(new RegExp(`${attr}="([^"]+)"`, 'i'));
        if (m && isReal(m[1])) return m[1];
      }
    }
    return null;
  };

  try {
    const feed = await parser.parseURL('https://salymbekov.com/ru/feed/');

    const items = feed.items.map(item => {
      const content = item.contentEncoded || item.content || '';
      let imageUrl = extractImage(content);

      if (!imageUrl && item.mediaContent) {
        if (Array.isArray(item.mediaContent)) {
          imageUrl = item.mediaContent[0]?.$.url;
        } else if (item.mediaContent.$) {
          imageUrl = item.mediaContent.$.url;
        }
      } 
      
      if (!imageUrl && item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      } 

      let summary = item.contentSnippet || item.description || '';
      const footerRegex = /Сообщение.*появились сначала на/g;
      summary = summary.split(footerRegex)[0].trim();

      const slug = item.link.split('/').filter(Boolean).pop();

      return {
        id: `ext-${slug}`,
        title: item.title,
        title_ru: item.title,
        summary: summary,
        summary_ru: summary,
        content: item.contentEncoded || item.content,
        content_ru: item.contentEncoded || item.content,
        image_url: imageUrl,
        published_at: item.isoDate || item.pubDate || item.pubDateRaw || null,
        date: item.isoDate || item.pubDate || item.pubDateRaw || null,
        category: { name: 'Salymbekov News' },
        is_external: true,
        original_link: item.link
      };
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
}
