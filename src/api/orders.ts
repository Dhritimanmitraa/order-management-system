import { api } from './config';
import { Order } from '../features/orders/ordersSlice';

export const ordersApi = {
  // Get all orders
  getAllOrders: async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: Omit<Order, 'id'>) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  // Update order
  updateOrder: async (id: string, orderData: Partial<Order>) => {
    const response = await api.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string) => {
    await api.delete(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id: string, status: Order['status']) => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }
};