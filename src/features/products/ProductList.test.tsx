import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { setupStore } from "../../app/store";
import { makeProduct } from "../../test-utils/factories";
import { ProductList } from "./ProductList";

const originalFetch = globalThis.fetch;

const apiResponse = (body: unknown, status = 200): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async (): Promise<unknown> => body,
  }) as Response;

afterEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = originalFetch;
});

it("tải và hiển thị sản phẩm từ API bất đồng bộ", async () => {
  // Arrange
  const product = makeProduct({ id: 4, title: "Balo du lịch" });
  globalThis.fetch = jest.fn().mockResolvedValue(
    apiResponse([product])
  ) as jest.MockedFunction<typeof fetch>;
  const store = setupStore();

  // Act
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>
  );

  // Assert
  expect(await screen.findByRole("heading", { name: "Balo du lịch" })).toBeInTheDocument();
  expect(screen.getByText("1 sản phẩm")).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
});

it("hiển thị lỗi API và tải lại thành công khi người dùng thử lại", async () => {
  // Arrange
  const user = userEvent.setup();
  const product = makeProduct({ id: 5, title: "Mũ len" });
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
  fetchMock
    .mockResolvedValueOnce(apiResponse(null, 503))
    .mockResolvedValueOnce(apiResponse([product]));
  globalThis.fetch = fetchMock;
  const store = setupStore();

  // Act
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("HTTP 503");
  await user.click(screen.getByRole("button", { name: "Thử lại" }));

  // Assert
  expect(await screen.findByRole("heading", { name: "Mũ len" })).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("báo dữ liệu không hợp lệ khi API trả về sản phẩm thiếu trường bắt buộc", async () => {
  // Arrange
  globalThis.fetch = jest.fn().mockResolvedValue(
    apiResponse([{ id: 1, title: "Thiếu dữ liệu" }])
  ) as jest.MockedFunction<typeof fetch>;
  const store = setupStore();

  // Act
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>
  );

  // Assert
  expect(await screen.findByRole("alert")).toHaveTextContent("Dữ liệu API không hợp lệ");
});

it("hiển thị thông báo phù hợp khi tải thành công nhưng danh sách rỗng", () => {
  // Arrange
  const store = setupStore({
    products: { items: [], status: "succeeded", error: null },
  });

  // Act
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>
  );

  // Assert
  expect(screen.getByText("Chưa có sản phẩm.")).toBeInTheDocument();
});

it("hiển thị trạng thái đang tải trong khi yêu cầu chưa hoàn tất", () => {
  // Arrange
  const pendingFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  pendingFetch.mockImplementation(() => new Promise<Response>(() => undefined));
  globalThis.fetch = pendingFetch;
  const store = setupStore();

  // Act
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>
  );

  // Assert
  expect(screen.getByRole("status")).toHaveTextContent("Đang tải sản phẩm...");
});
