import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create mock instance
const mock = new MockAdapter(api, { delayResponse: 1000 });

// Mock endpoints
mock.onGet('/customers').reply(200, [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

mock.onGet('/orders').reply(200, [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderDate: new Date().toISOString(),
    status: 'Pending',
    items: [
      {
        productId: 1,
        productName: 'Product 1',
        quantity: 2,
        price: 99.99,
        subtotal: 199.98,
      },
    ],
    total: 199.98,
    lastUpdated: new Date().toISOString(),
  },
]);

mock.onGet('/products').reply(200, [
  {
    id: 1,
    name: 'Product 1',
    description: 'A high-quality product',
    sku: 'PRD-001',
    price: 99.99,
    quantity: 100,
    category: 'Electronics',
    supplier: 'Supplier A',
    reorderPoint: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export default api;