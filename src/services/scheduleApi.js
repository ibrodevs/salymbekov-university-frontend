// API для подразделов расписания
export const SCHEDULE_API_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/schedule/subsections/';

export async function getScheduleSubsections(language = 'ru') {
  const lang = language === 'kg' ? 'ky' : language;
  const url = `${SCHEDULE_API_URL}?lang=${lang}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.results) return data.results;
    return [];
  } catch {
    return [];
  }
}
