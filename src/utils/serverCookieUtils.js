import cookie from 'cookie';

// Get locale cookie for server-side
export const getLocaleCookie = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.locale || 'en'; // Default to 'en'
};
