import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SalesMetrics {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

interface InventoryMetrics {
  lowStockItems: Array<{
    productId: number;
    productName: string;
    currentStock: number;
    reorderPoint: number;
  }>;
  outOfStockItems: number;
  totalInventoryValue: number;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  averageCustomerSpend: number;
}

interface AnalyticsState {
  salesMetrics: SalesMetrics;
  inventoryMetrics: InventoryMetrics;
  customerMetrics: CustomerMetrics;
  timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastUpdated: string;
}

const initialState: AnalyticsState = {
  salesMetrics: {
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
    topSellingProducts: []
  },
  inventoryMetrics: {
    lowStockItems: [],
    outOfStockItems: 0,
    totalInventoryValue: 0
  },
  customerMetrics: {
    totalCustomers: 0,
    newCustomers: 0,
    repeatCustomers: 0,
    averageCustomerSpend: 0
  },
  timeRange: 'monthly',
  lastUpdated: new Date().toISOString()
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateSalesMetrics: (state, action: PayloadAction<Partial<SalesMetrics>>) => {
      state.salesMetrics = { ...state.salesMetrics, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateInventoryMetrics: (state, action: PayloadAction<Partial<InventoryMetrics>>) => {
      state.inventoryMetrics = { ...state.inventoryMetrics, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateCustomerMetrics: (state, action: PayloadAction<Partial<CustomerMetrics>>) => {
      state.customerMetrics = { ...state.customerMetrics, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    setTimeRange: (state, action: PayloadAction<AnalyticsState['timeRange']>) => {
      state.timeRange = action.payload;
    }
  }
});

export const {
  updateSalesMetrics,
  updateInventoryMetrics,
  updateCustomerMetrics,
  setTimeRange
} = analyticsSlice.actions;

export default analyticsSlice.reducer;