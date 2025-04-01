import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  lastUpdated: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      orderDate: '2024-01-04',
      status: 'Pending',
      items: [
        {
          productId: 1,
          productName: 'Product 1',
          quantity: 2,
          price: 75.00,
          subtotal: 150.00
        }
      ],
      total: 150.00,
      lastUpdated: '2024-01-04T10:00:00Z'
    }
  ],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Omit<Order, 'id'>>) => {
      const newOrder = {
        ...action.payload,
        id: state.orders.length + 1,
      };
      state.orders.push(newOrder);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.lastUpdated = new Date().toISOString();
      }
    },
    updateTrackingNumber: (state, action: PayloadAction<{ orderId: number; trackingNumber: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.trackingNumber = action.payload.trackingNumber;
        order.lastUpdated = new Date().toISOString();
      }
    },
    updateOrderNotes: (state, action: PayloadAction<{ orderId: number; notes: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.notes = action.payload.notes;
        order.lastUpdated = new Date().toISOString();
      }
    }
  }
});

export const { addOrder, updateOrderStatus, updateTrackingNumber, updateOrderNotes } = ordersSlice.actions;
export default ordersSlice.reducer;