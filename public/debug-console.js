// Простая проверка консоли для отладки
console.log('🔍 Начинаем проверку ошибок...');

// Проверяем доступность основных модулей
try {
  console.log('✅ React доступен:', typeof React !== 'undefined');
} catch (e) {
  console.error('❌ React недоступен:', e.message);
}

try {
  console.log('✅ ReactDOM доступен:', typeof ReactDOM !== 'undefined');
} catch (e) {
  console.error('❌ ReactDOM недоступен:', e.message);
}

// Проверяем API endpoints
const testEndpoints = async () => {
  const baseURL = 'https://med-backend-d61c905599c2.herokuapp.com/api';
  const endpoints = [
    '/hsm/info/',
    '/hsm/programs/',
    '/hsm/faculty/',
    '/hsm/accreditations/',
    '/hsm/learning-goals/'
  ];

  console.log('🌐 Проверка API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(baseURL + endpoint);
      if (response.ok) {
        console.log(`✅ ${endpoint} - OK`);
      } else {
        console.error(`❌ ${endpoint} - HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint} - ${error.message}`);
    }
  }
};

// Проверяем роутинг
const testRouting = () => {
  console.log('🛣️ Проверка роутинга...');
  
  const routes = [
    '/',
    '/hsm',
    '/hsm/info',
    '/hsm/programs',
    '/hsm/faculty',
    '/hsm/accreditation',
    '/hsm/learning-goals'
  ];

  routes.forEach(route => {
    try {
      window.history.pushState({}, '', route);
      console.log(`✅ Роут ${route} доступен`);
    } catch (error) {
      console.error(`❌ Роут ${route} - ${error.message}`);
    }
  });
};

// Проверяем локализацию
const testI18n = () => {
  console.log('🌍 Проверка локализации...');
  
  try {
    if (window.i18n) {
      console.log('✅ i18n инициализирован');
      console.log('✅ Текущий язык:', window.i18n.language);
    } else {
      console.warn('⚠️ i18n не найден в window объекте');
    }
  } catch (error) {
    console.error('❌ Ошибка проверки i18n:', error.message);
  }
};

// Запускаем проверки
testRouting();
testI18n();
testEndpoints();

console.log('🔍 Проверка завершена. Смотрите результаты выше.');

// Добавляем обработчик для отлова ошибок
window.addEventListener('error', (event) => {
  console.error('🚨 Обнаружена ошибка JavaScript:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Необработанный Promise rejection:', event.reason);
});
