import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customersApi, Customer as ApiCustomer } from '../../api/customers';

export interface Customer extends ApiCustomer {}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await customersApi.getAllCustomers();
    return response;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await customersApi.createCustomer(customerData);
    return response;
  }
);

export const updateCustomerThunk = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }: { id: string; customerData: Partial<Customer> }) => {
    const response = await customersApi.updateCustomer(id, customerData);
    return response;
  }
);

export const deleteCustomerThunk = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string) => {
    await customersApi.deleteCustomer(id);
    return id;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      // Create customer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      // Update customer
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      // Delete customer
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer.id !== Number(action.payload));
      });
  }
});

export const {} = customersSlice.actions;
export default customersSlice.reducer;