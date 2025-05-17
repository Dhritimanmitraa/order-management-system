import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import customersReducer from './features/customers/customersSlice';
import ordersReducer from './features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    customers: customersReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;