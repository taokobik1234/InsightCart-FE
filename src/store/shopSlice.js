import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shop: null, // or provide a default value
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShop(state, action) {
      state.shop = action.payload;
    },
  },
});

export const { setShop } = shopSlice.actions;
export default shopSlice.reducer;
