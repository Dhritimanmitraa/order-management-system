import { api } from './config';

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  supplier: string;
  reorderPoint: number;
  createdAt: string;
  updatedAt: string;
}

export const inventoryApi = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },

  // Update product quantity
  updateStock: async (id: string, quantity: number) => {
    const response = await api.patch<Product>(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async () => {
    const response = await api.get<Product[]>('/products/low-stock');
    return response.data;
  }
};