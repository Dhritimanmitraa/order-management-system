
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { inventoryApi, Product as ApiProduct } from '../../api/inventory';

export interface Product extends ApiProduct {
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
  products: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async () => {
    const response = await inventoryApi.getAllProducts();
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await inventoryApi.createProduct(productData);
    return response;
  }
);

export const updateProductThunk = createAsyncThunk(
  'inventory/updateProduct',
  async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
    const response = await inventoryApi.updateProduct(id, productData);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id: string) => {
    await inventoryApi.deleteProduct(id);
    return id;
  }
);

export const updateProductStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, quantity }: { id: string; quantity: number }) => {
    const response = await inventoryApi.updateStock(id, quantity);
    return response;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update product
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== Number(action.payload));
      })
      // Update stock
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  }
});

export const {} = inventorySlice.actions;

export default inventorySlice.reducer;