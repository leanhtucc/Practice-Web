import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
} from "./cartSlice";

import { setupStore } from "../../app/store";

import type { CartState } from "./cartTypes";

import { makeCartState, makeProduct } from "../../test-utils/factories";

afterEach(() => {
  jest.clearAllMocks();
});

const initialState: CartState = { items: [] };

describe("cartSlice - addItem", () => {
  it("thêm sản phẩm mới vào giỏ với số lượng ban đầu là 1", () => {
    // Arrange
    const product = makeProduct({ id: 7, title: "Áo thun test" });

    // Act
    const state = cartReducer(initialState, addItem(product));

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product).toEqual(product);
    expect(state.items[0].quantity).toBe(1);
  });

  it("tăng số lượng khi thêm lại sản phẩm đã có trong giỏ", () => {
    // Arrange
    const product = makeProduct({ id: 7 });
    const stateWithItem = cartReducer(initialState, addItem(product));

    // Act
    const state = cartReducer(stateWithItem, addItem(product));

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("giữ nguyên số lượng của các sản phẩm khác khi thêm sản phẩm mới", () => {
    // Arrange
    const first = makeProduct({ id: 1 });
    const second = makeProduct({ id: 2 });
    const stateWithFirst = cartReducer(initialState, addItem(first));

    // Act
    const state = cartReducer(stateWithFirst, addItem(second));

    // Assert
    expect(state.items).toHaveLength(2);
    expect(state.items[0].quantity).toBe(1);
    expect(state.items[1].quantity).toBe(1);
  });
});

describe("cartSlice - removeItem", () => {
  it("xóa đúng sản phẩm theo id và giữ lại các sản phẩm khác", () => {
    // Arrange
    const stateWithItems = makeCartState([
      { product: { id: 1 } },
      { product: { id: 2 } },
      { product: { id: 3 } },
    ]);

    // Act
    const state = cartReducer(stateWithItems, removeItem(2));

    // Assert
    expect(state.items).toHaveLength(2);
    expect(state.items.map((item) => item.product.id)).toEqual([1, 3]);
  });

  it("giữ nguyên giỏ hàng khi xóa id không tồn tại", () => {
    // Arrange
    const stateWithItems = makeCartState([{ product: { id: 1 } }]);

    // Act
    const state = cartReducer(stateWithItems, removeItem(999));

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(1);
  });
});

describe("cartSlice - updateQuantity", () => {
  it("cập nhật số lượng hợp lệ cho sản phẩm đã có trong giỏ", () => {
    // Arrange
    const stateWithItems = makeCartState([
      { product: { id: 1 }, quantity: 1 },
    ]);

    // Act
    const state = cartReducer(
      stateWithItems,
      updateQuantity({ id: 1, quantity: 5 })
    );

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it("xóa sản phẩm khi số lượng được cập nhật nhỏ hơn hoặc bằng 0", () => {
    // Arrange
    const stateWithItems = makeCartState([
      { product: { id: 1 }, quantity: 3 },
      { product: { id: 2 }, quantity: 2 },
    ]);

    // Act
    const state = cartReducer(
      stateWithItems,
      updateQuantity({ id: 1, quantity: 0 })
    );

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(2);
  });

  it("giữ nguyên giỏ hàng khi cập nhật id không tồn tại", () => {
    // Arrange
    const stateWithItems = makeCartState([
      { product: { id: 1 }, quantity: 2 },
    ]);

    // Act
    const state = cartReducer(
      stateWithItems,
      updateQuantity({ id: 999, quantity: 10 })
    );

    // Assert
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  const invalidQuantities: Array<{ quantity: number; label: string }> = [
    { quantity: 2.5, label: "số thập phân" },
    { quantity: Number.NaN, label: "NaN" },
    { quantity: Number.POSITIVE_INFINITY, label: "Infinity" },
  ];

  it.each(invalidQuantities)(
    "bỏ qua số lượng không nguyên ($label)",
    ({ quantity }) => {
      // Arrange
      const stateWithItems = makeCartState([
        { product: { id: 1 }, quantity: 4 },
      ]);

      // Act
      const state = cartReducer(
        stateWithItems,
        updateQuantity({ id: 1, quantity })
      );

      // Assert
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(4);
    }
  );
});

describe("cartSlice - tích hợp với store", () => {
  it("cập nhật giỏ hàng trong store khi dispatch thêm sản phẩm", () => {
    // Arrange
    const store = setupStore();
    const product = makeProduct({ id: 7, price: 250 });

    // Act
    store.dispatch(addItem(product));

    // Assert
    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(7);
    expect(items[0].quantity).toBe(1);
  });

  it("xóa sản phẩm khỏi store khi dispatch đổi số lượng thành số âm", () => {
    // Arrange
    const product = makeProduct({ id: 7 });
    const store = setupStore();
    store.dispatch(addItem(product));

    // Act
    store.dispatch(updateQuantity({ id: 7, quantity: -3 }));

    // Assert
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
