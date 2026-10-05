import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { setupStore } from "../../app/store";
import { makeCartState } from "../../test-utils/factories";
import { Cart } from "./Cart";

afterEach(() => {
  jest.clearAllMocks();
});

it("hiển thị giỏ hàng trống khi chưa có sản phẩm", () => {
  // Arrange
  const store = setupStore();

  // Act
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  // Assert
  expect(screen.getByText("Giỏ hàng đang trống.")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Giỏ hàng (0 sản phẩm)" })).toBeInTheDocument();
});

it("hiển thị mặt hàng và tổng tiền theo số lượng trong giỏ", () => {
  // Arrange
  const store = setupStore({
    cart: makeCartState([
      { product: { id: 1, title: "Bình nước", price: 12.5 }, quantity: 2 },
    ]),
  });

  // Act
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  // Assert
  expect(screen.getByRole("heading", { name: "Bình nước" })).toBeInTheDocument();
  expect(screen.getByText("$12.50 / sản phẩm")).toBeInTheDocument();
  expect(screen.getByText("$25.00")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Giỏ hàng (2 sản phẩm)" })).toBeInTheDocument();
});

it("tăng số lượng bằng nút có nhãn truy cập", async () => {
  // Arrange
  const user = userEvent.setup();
  const store = setupStore({
    cart: makeCartState([
      { product: { id: 1, title: "Bình nước", price: 12.5 }, quantity: 2 },
    ]),
  });
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  await user.click(screen.getByRole("button", { name: "Tăng số lượng Bình nước" }));

  // Assert
  expect(screen.getByRole("heading", { name: "Giỏ hàng (3 sản phẩm)" })).toBeInTheDocument();
  expect(screen.getByText("$37.50")).toBeInTheDocument();
});

it("giảm số lượng bằng nút có nhãn truy cập", async () => {
  // Arrange
  const user = userEvent.setup();
  const store = setupStore({
    cart: makeCartState([
      { product: { id: 1, title: "Bình nước", price: 12.5 }, quantity: 2 },
    ]),
  });
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  // Act
  await user.click(screen.getByRole("button", { name: "Giảm số lượng Bình nước" }));

  // Assert
  expect(screen.getByRole("heading", { name: "Giỏ hàng (1 sản phẩm)" })).toBeInTheDocument();
  expect(screen.getByText("Tổng cộng:").parentElement).toHaveTextContent("$12.50");
});

it("xóa mặt hàng khỏi giỏ khi người dùng chọn Xóa", async () => {
  // Arrange
  const user = userEvent.setup();
  const store = setupStore({
    cart: makeCartState([
      { product: { id: 1, title: "Bình nước", price: 12.5 } },
    ]),
  });
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  // Act
  await user.click(screen.getByRole("button", { name: "Xóa" }));

  // Assert
  expect(screen.getByText("Giỏ hàng đang trống.")).toBeInTheDocument();
  expect(store.getState().cart.items).toHaveLength(0);
});

it("xóa mặt hàng khi giảm số lượng từ một xuống không", async () => {
  // Arrange
  const user = userEvent.setup();
  const store = setupStore({
    cart: makeCartState([
      { product: { id: 1, title: "Bình nước" }, quantity: 1 },
    ]),
  });
  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  // Act
  await user.click(screen.getByRole("button", { name: "Giảm số lượng Bình nước" }));

  // Assert
  expect(screen.getByText("Giỏ hàng đang trống.")).toBeInTheDocument();
});
