
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stockLevel: number;
  reorderPoint: number;
  category: string;
  supplier: string;
  lastRestocked: string;
}

interface InventoryState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  products: [
    {
      id: 1,
      name: 'Product 1',
      sku: 'SKU001',
      description: 'Sample product description',
      price: 75.00,
      stockLevel: 100,
      reorderPoint: 20,
      category: 'Electronics',
      supplier: 'Supplier A',
      lastRestocked: '2024-01-04T10:00:00Z'
    }
  ],
  loading: false,
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const newProduct = {
        ...action.payload,
        id: state.products.length + 1
      };
      state.products.push(newProduct);
    },
    updateStock: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product) {
        product.stockLevel += action.payload.quantity;
        product.lastRestocked = new Date().toISOString();
      }
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  addProduct,
  updateStock,
  updateProduct,
  removeProduct,
  setLoading,
  setError
} = inventorySlice.actions;

export default inventorySlice.reducer;