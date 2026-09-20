import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
  Product,
  LoadStatus,
} from "./productTypes";

// 1. Định nghĩa state
interface ProductsState {
  items: Product[];

  status: LoadStatus;

  error: string | null;
}

// 2. State ban đầu
const initialState: ProductsState = {
  items: [],

  status: "idle",

  error: null,
};

// 3. Async thunk lấy sản phẩm từ API
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "products/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products"
      );

      if (!response.ok) {
        return rejectWithValue(
          `HTTP ${response.status}`
        );
      }

      const data: unknown = await response.json();

      if (
        !Array.isArray(data) ||
        !data.every(isProduct)
      ) {
        return rejectWithValue(
          "Dữ liệu API không hợp lệ"
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Không thể tải sản phẩm"
      );
    }
  }
);

// 4. Kiểm tra dữ liệu API
function isProduct(
  value: unknown
): value is Product {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "number" &&
    typeof obj.title === "string" &&
    typeof obj.price === "number" &&
    Number.isFinite(obj.price) &&
    obj.price >= 0 &&
    typeof obj.image === "string" &&
    typeof obj.description === "string" &&
    typeof obj.category === "string"
  );
}

// 5. Tạo productsSlice
const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Đang gọi API
      .addCase(
        fetchProducts.pending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )

      // Gọi API thành công
      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.status = "succeeded";

          state.items = action.payload;
        }
      )

      // Gọi API thất bại
      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.status = "failed";

          state.error =
            action.payload ??
            action.error.message ??
            "Lỗi không xác định";
        }
      );
  },
});

export default productsSlice.reducer;