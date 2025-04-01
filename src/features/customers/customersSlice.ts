import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

interface CustomersState {
  customers: Customer[];
}

const initialState: CustomersState = {
  customers: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      totalOrders: 5,
      totalSpent: 750.00,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      totalOrders: 3,
      totalSpent: 450.00,
    },
  ],
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id'>>) => {
      const newCustomer = {
        ...action.payload,
        id: state.customers.length + 1,
      };
      state.customers.push(newCustomer);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<number>) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;
export default customersSlice.reducer;