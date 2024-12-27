import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const ITEMS_PER_PAGE = 10;

export const fetchAllProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://tancatest.me/api/v1/shops/products/all`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            return data.data.items;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchRecommendedProducts = createAsyncThunk(
    'products/fetchRecommended',
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://tancatest.me/api/v1/shops/products/all?page=${page}&limit=${ITEMS_PER_PAGE}`);
            if (!response.ok) throw new Error('Failed to fetch recommended products');
            const data = await response.json();
            return {
                items: data.data.items,
                meta: data.data.meta,
                page
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        recommendedProducts: [],
        loading: false,
        loadingMore: false,
        error: null,
        currentPage: 1,
        hasMore: true,
    },
    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        resetRecommendedProducts(state) {
            state.recommendedProducts = [];
            state.currentPage = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchRecommendedProducts.pending, (state, action) => {
                if (action.meta.arg.page === 1) {
                    state.loading = true;
                } else {
                    state.loadingMore = true;
                }
            })
            .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
                const { items, meta, page } = action.payload;
                if (page === 1) {
                    state.recommendedProducts = items;
                } else {
                    state.recommendedProducts = [...state.recommendedProducts, ...items];
                }
                state.hasMore = meta.total > page * ITEMS_PER_PAGE;
                state.loading = false;
                state.loadingMore = false;
            })
            .addCase(fetchRecommendedProducts.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                state.loadingMore = false;
                state.hasMore = false;
            });
    }
});

export const { setCurrentPage, resetRecommendedProducts } = productsSlice.actions;
export default productsSlice.reducer;
