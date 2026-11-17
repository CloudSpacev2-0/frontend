#!/bin/sh
set -e

# COUPON_API_URL is optional: when empty, the UI hides the coupon feature.
cat > /usr/share/nginx/html/config.js <<EOF2
window.APP_CONFIG = {
  PRODUCT_API_URL: "${PRODUCT_API_URL:-http://localhost:3001}",
  ORDER_API_URL: "${ORDER_API_URL:-http://localhost:3002}",
  COUPON_API_URL: "${COUPON_API_URL:-}"
};
EOF2
echo "config.js written (PRODUCT_API_URL=${PRODUCT_API_URL:-default}, COUPON_API_URL=${COUPON_API_URL:-off})"
