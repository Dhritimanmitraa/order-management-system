import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/orders';

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any) => {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }: { id: string; orderData: any }) => {
    const response = await axios.put(`${API_URL}/${id}`, orderData);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }
);

export const updateTrackingNumber = createAsyncThunk(
  'orders/updateTrackingNumber',
  async ({ id, trackingNumber }: { id: string; trackingNumber: string }) => {
    const response = await axios.patch(`${API_URL}/${id}/tracking`, { trackingNumber });
    return response.data;
  }
);

export const updateOrderNotes = createAsyncThunk(
  'orders/updateOrderNotes',
  async ({ id, notes }: { id: string; notes: string }) => {
    const response = await axios.patch(`${API_URL}/${id}/notes`, { notes });
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateTrackingNumber.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderNotes.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  }
});

export default ordersSlice.reducer;