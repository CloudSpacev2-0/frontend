// Local development defaults. In Azure this file is regenerated at container start
// from the PRODUCT_API_URL / ORDER_API_URL / COUPON_API_URL environment variables.
// COUPON_API_URL is optional: leave it empty to hide the coupon feature,
// or set it (e.g. 'http://localhost:3003') to turn it on.
window.APP_CONFIG = {
  PRODUCT_API_URL: 'http://localhost:3001',
  ORDER_API_URL: 'http://localhost:3002',
  COUPON_API_URL: '',
};
