import { api } from './config';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export const customersApi = {
  // Get all customers
  getAllCustomers: async () => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Customer>('/customers', customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Partial<Customer>) => {
    const response = await api.put<Customer>(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string) => {
    await api.delete(`/customers/${id}`);
  }
};