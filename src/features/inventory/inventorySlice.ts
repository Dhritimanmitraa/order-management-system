import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    stockLevel: number;
    quantity: number;
    category: string;
    supplier: string;
    reorderPoint: number;
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
    error: null,
};

export const getProducts = createAsyncThunk(
    'inventory/getProducts',
    async () => {
        const response = await api.get('/products');
        return response.data;
    }
);

export const addProduct = createAsyncThunk(
    'inventory/addProduct',
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await api.post('/products', productData);
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'inventory/updateProduct',
    async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    'inventory/deleteProduct',
    async (id: string) => {
        await api.delete(`/products/${id}`);
        return id;
    }
);

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Products
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            // Add Product
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            // Update Product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            // Delete Product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
            });
    },
});

export default inventorySlice.reducer;
