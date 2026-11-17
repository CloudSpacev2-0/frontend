import React, { useEffect, useState } from 'react';

const { PRODUCT_API_URL, ORDER_API_URL, COUPON_API_URL } = window.APP_CONFIG || {};
// The coupon feature is enabled only when COUPON_API_URL is configured.
const COUPONS_ENABLED = Boolean(COUPON_API_URL);

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, percentOff } once validated
  const [couponMessage, setCouponMessage] = useState('');

  const loadOrders = () =>
    request(`${ORDER_API_URL}/api/orders`).then(setOrders);

  useEffect(() => {
    Promise.all([
      request(`${PRODUCT_API_URL}/api/products`).then(setProducts),
      loadOrders(),
    ]).catch((e) => setError(`Could not reach the APIs: ${e.message}`));
  }, []);

  const order = async (product) => {
    try {
      setError('');
      await request(`${ORDER_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: product.name, quantity: 1 }),
      });
      await loadOrders();
    } catch (e) {
      setError(`Order failed: ${e.message}`);
    }
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    setCouponMessage('');
    try {
      const result = await request(`${COUPON_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      if (result.valid) {
        setCoupon({ code: result.code, percentOff: result.percentOff });
        setCouponMessage(`${result.code} applied: ${result.percentOff}% off`);
      } else {
        setCoupon(null);
        setCouponMessage(result.reason || 'Invalid coupon');
      }
    } catch (err) {
      setCoupon(null);
      setCouponMessage(`Coupon service unavailable: ${err.message}`);
    }
  };

  const priceOf = (p) => (coupon ? p.price * (1 - coupon.percentOff / 100) : p.price);

  return (
    <main>
      <h1>Beyond Localhost Shop</h1>
      <p className="muted">
        Frontend → Product API ({PRODUCT_API_URL}) and Order API ({ORDER_API_URL})
        {COUPONS_ENABLED && <> and Coupon API ({COUPON_API_URL})</>}
      </p>
      {error && <p className="error" role="alert">{error}</p>}

      {COUPONS_ENABLED && (
        <form className="coupon" onSubmit={applyCoupon}>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            aria-label="Coupon code"
          />
          <button type="submit" disabled={!couponCode.trim()}>Apply</button>
          {couponMessage && (
            <span className={coupon ? 'ok' : 'error-text'} role="status">{couponMessage}</span>
          )}
        </form>
      )}

      <h2>Products <small>(Product service)</small></h2>
      <ul className="grid">
        {products.map((p) => (
          <li key={p.id} className="card">
            <strong>{p.name}</strong>
            <span>
              {coupon && <s className="muted">${p.price.toFixed(2)}</s>} ${priceOf(p).toFixed(2)}
            </span>
            <button onClick={() => order(p)}>Order</button>
          </li>
        ))}
      </ul>

      <h2>Orders <small>(Order service)</small></h2>
      <table>
        <thead>
          <tr><th>#</th><th>Product</th><th>Qty</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.productName}</td><td>{o.quantity}</td><td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
