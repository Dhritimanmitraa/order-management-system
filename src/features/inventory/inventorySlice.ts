import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    quantity: number;
    category: string;
    supplier: string;
    reorderPoint: number;
    stockLevel: number;
    lastRestocked: string;
}

const initialState: Product[] = [
    { id: "0", name: "Initial Product", description: "Initial product description", sku: "000", price: 0, quantity: 0, category: "initial", supplier: "initial", reorderPoint: 0, stockLevel: 0, lastRestocked: "" }
];

export const getProducts = createAsyncThunk('products/getProducts', async () => {
    try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
});

export const addProduct = createAsyncThunk('products/addProduct', async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await fetch('http://localhost:5000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
    try {
        const response = await fetch(`http://localhost:5000/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
    try {
        const response = await fetch(`http://localhost:5000/products/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return id;
        } else {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(addProduct.fulfilled, (state, action) => {
            const { name, description, sku, price, quantity, category, supplier, reorderPoint } = action.payload;
            let newProduct = { id: crypto.randomUUID(), name: name, description: description, sku: sku, price: price, quantity: quantity, category: category, supplier: supplier, reorderPoint: reorderPoint, stockLevel: 0, lastRestocked: "" };
            state.push(newProduct as Product);
            return state;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            let updatedProduct;
            const { id, name, description, sku, price, quantity, category, supplier, reorderPoint } = action.payload;
            state.map((product, i) => {
                if (product.id === id) {
                    updatedProduct = { name: name, description: description, sku: sku, price: price, quantity: quantity, category: category, supplier: supplier, reorderPoint: reorderPoint, stockLevel: 0, lastRestocked:"" };
                    state[i] = updatedProduct as Product;
                }
            })
            return state;
        });
        builder.addCase(deleteProduct.fulfilled, (action) => {
            return action.payload;
        });
    }
});

export default inventorySlice.reducer;
