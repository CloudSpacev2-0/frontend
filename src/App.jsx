import React, { useEffect, useState } from 'react';

const { PRODUCT_API_URL, ORDER_API_URL } = window.APP_CONFIG || {};

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <main>
      <h1>Beyond Localhost Shop</h1>
      <p className="muted">
        Frontend → Product API ({PRODUCT_API_URL}) and Order API ({ORDER_API_URL})
      </p>
      {error && <p className="error" role="alert">{error}</p>}

      <h2>Products <small>(Product service)</small></h2>
      <ul className="grid">
        {products.map((p) => (
          <li key={p.id} className="card">
            <strong>{p.name}</strong>
            <span>${p.price.toFixed(2)}</span>
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
