import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { setupStore } from "../../app/store";
import { makeProduct } from "../../test-utils/factories";
import { ProductCard } from "./ProductCard";

afterEach(() => {
  jest.clearAllMocks();
});

const setup = () => {
  const user = userEvent.setup();
  const store = setupStore();
  const product = makeProduct({
    id: 12,
    title: "Áo khoác",
    category: "Thời trang",
    price: 42.5,
  });

  render(
    <Provider store={store}>
      <ProductCard product={product} />
    </Provider>
  );

  return { user, store, product };
};

it("hiển thị tên, danh mục, giá và ảnh sản phẩm", () => {
  // Arrange
  const { product } = setup();

  // Assert
  expect(screen.getByRole("heading", { name: product.title })).toBeInTheDocument();
  expect(screen.getByText(product.category)).toBeInTheDocument();
  expect(screen.getByText("$42.50")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: product.title })).toHaveAttribute("src", product.image);
});

it("thêm một dòng sản phẩm vào giỏ khi người dùng bấm nút", async () => {
  // Arrange
  const { user, store, product } = setup();

  // Act
  await user.click(screen.getByRole("button", { name: "+ Thêm vào giỏ" }));

  // Assert
  expect(store.getState().cart.items).toEqual([
    { product, quantity: 1 },
  ]);
});

it("tăng số lượng lên hai khi người dùng bấm nút hai lần", async () => {
  // Arrange
  const { user, store, product } = setup();
  const addButton = screen.getByRole("button", { name: "+ Thêm vào giỏ" });

  // Act
  await user.click(addButton);
  await user.click(addButton);

  // Assert
  expect(store.getState().cart.items).toEqual([
    { product, quantity: 2 },
  ]);
});
