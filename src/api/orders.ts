import { api } from './config';
import { Order, OrderStatus, OrderSummary, OrderAnalytics } from '../types/order';

export const ordersApi = {
  // Get all orders with pagination and filtering
  getAllOrders: async (params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get<{
      orders: Order[];
      total: number;
      totalPages: number;
    }>('/orders', { params });
    return response.data;
  },

  // Get order by ID with detailed information
  getOrderById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Create new order with validation
  createOrder: async (orderData: Omit<Order, 'id'>) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  // Update order with partial data
  updateOrder: async (id: string, orderData: Partial<Order>) => {
    const response = await api.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  },

  // Delete order (soft delete)
  deleteOrder: async (id: string) => {
    await api.delete(`/orders/${id}`);
  },

  // Update order status with history tracking
  updateOrderStatus: async (id: string, status: OrderStatus, note?: string) => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { 
      status,
      note,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  },

  // Get order summary statistics
  getOrderSummary: async (params: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<OrderSummary>('/orders/summary', { params });
    return response.data;
  },

  // Get order analytics and trends
  getOrderAnalytics: async (params: {
    period: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<OrderAnalytics>('/orders/analytics', { params });
    return response.data;
  },

  // Bulk update orders
  bulkUpdateOrders: async (orderIds: string[], updates: Partial<Order>) => {
    const response = await api.patch<Order[]>('/orders/bulk', {
      orderIds,
      updates
    });
    return response.data;
  },

  // Export orders to CSV/Excel
  exportOrders: async (params: {
    format: 'csv' | 'excel';
    startDate?: string;
    endDate?: string;
    status?: OrderStatus;
  }) => {
    const response = await api.get('/orders/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get order history/audit trail
  getOrderHistory: async (id: string) => {
    const response = await api.get(`/orders/${id}/history`);
    return response.data;
  },

  // Add comment/note to order
  addOrderNote: async (id: string, note: string) => {
    const response = await api.post(`/orders/${id}/notes`, { note });
    return response.data;
  },

  // Generate order invoice
  generateInvoice: async (id: string) => {
    const response = await api.get(`/orders/${id}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  }
};