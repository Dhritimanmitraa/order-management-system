import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './features/customers/customersSlice';
import ordersReducer from './features/orders/ordersSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import analyticsReducer from './features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    orders: ordersReducer,
    inventory: inventoryReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch