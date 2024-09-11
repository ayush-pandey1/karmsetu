import Cookies from 'js-cookie';

// Set locale cookie for client-side
export const setLocaleCookie = (locale) => {
  Cookies.set('locale', locale, { expires: 365 }); // Set cookie for 1 year
};

// Get locale cookie for client-side
export const getLocaleCookie = () => {
  return Cookies.get('locale') || 'en'; // Default to 'en'
};
