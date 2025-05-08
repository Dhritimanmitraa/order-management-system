export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stockLevel: number;
  reorderPoint: number;
  category: string;
  supplier: string;
  lastRestocked?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  total: number;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
} 