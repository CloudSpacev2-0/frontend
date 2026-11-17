#!/bin/sh
set -e

cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  PRODUCT_API_URL: "${PRODUCT_API_URL:-http://localhost:3001}",
  ORDER_API_URL: "${ORDER_API_URL:-http://localhost:3002}"
};
EOF
echo "config.js written (PRODUCT_API_URL=${PRODUCT_API_URL:-default})"
