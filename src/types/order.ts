export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type OrderPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  tax?: number;
}

export interface OrderNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface ShippingDetails {
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  method: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  shippingCost: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: OrderPriority;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: ShippingDetails;
  discount?: number;
  total: number;
  notes: OrderNote[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  expectedShipDate?: string;
  tags?: string[];
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentStatus: Record<PaymentStatus, number>;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  recentOrders: Order[];
}

export interface OrderAnalytics {
  timeline: {
    period: string;
    orders: number;
    revenue: number;
  }[];
  orderTrends: {
    status: OrderStatus;
    count: number;
    percentage: number;
  }[];
  revenueByProduct: {
    productId: string;
    productName: string;
    revenue: number;
    percentage: number;
  }[];
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    averageLifetimeValue: number;
  };
  fulfillmentMetrics: {
    averageProcessingTime: number;
    averageShippingTime: number;
    onTimeDeliveryRate: number;
    returnRate: number;
  };
} 