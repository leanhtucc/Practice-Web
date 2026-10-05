import { setupStore } from "../../app/store";
import { makeProduct } from "../../test-utils/factories";
import { fetchProducts } from "./productsSlice";

const originalFetch = globalThis.fetch;

const apiResponse = (body: unknown, status = 200): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async (): Promise<unknown> => body,
  }) as Response;

const mockFetch = (): jest.MockedFunction<typeof fetch> => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
  globalThis.fetch = fetchMock;
  return fetchMock;
};

afterEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = originalFetch;
});

it("đặt trạng thái loading và xóa lỗi khi bắt đầu tải", async () => {
  // Arrange
  const fetchMock = mockFetch();
  fetchMock.mockResolvedValue(apiResponse([]));
  const store = setupStore({
    products: { items: [], status: "failed", error: "Lỗi cũ" },
  });

  // Act
  const request = store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("loading");
  expect(store.getState().products.error).toBeNull();
  await request;
});

it("lưu sản phẩm và trạng thái succeeded khi API thành công", async () => {
  // Arrange
  const products = [makeProduct({ id: 7, title: "Áo khoác" })];
  mockFetch().mockResolvedValue(apiResponse(products));
  const store = setupStore();

  // Act
  await store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("succeeded");
  expect(store.getState().products.items).toEqual(products);
});

it("lưu lỗi HTTP khi máy chủ trả mã 500", async () => {
  // Arrange
  mockFetch().mockResolvedValue(apiResponse(null, 500));
  const store = setupStore();

  // Act
  await store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("failed");
  expect(store.getState().products.error).toBe("HTTP 500");
});

const invalidResponses: Array<{ label: string; data: unknown }> = [
  { label: "giá trị không phải mảng", data: { id: 1 } },
  { label: "phần tử sản phẩm là null", data: [null] },
  {
    label: "sản phẩm thiếu title",
    data: [{ id: 1, price: 10, description: "Mô tả", category: "Khác", image: "image.jpg" }],
  },
  {
    label: "sản phẩm có price âm",
    data: [{ ...makeProduct(), price: -1 }],
  },
  {
    label: "sản phẩm có price NaN",
    data: [{ ...makeProduct(), price: Number.NaN }],
  },
  {
    label: "sản phẩm có id là chuỗi",
    data: [{ ...makeProduct(), id: "1" }],
  },
  {
    label: "sản phẩm thiếu image",
    data: [{ id: 1, title: "Áo", price: 10, description: "Mô tả", category: "Khác" }],
  },
];

it.each(invalidResponses)("từ chối dữ liệu API không hợp lệ: $label", async ({ data }) => {
  // Arrange
  mockFetch().mockResolvedValue(apiResponse(data));
  const store = setupStore();

  // Act
  await store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("failed");
  expect(store.getState().products.items).toEqual([]);
  expect(store.getState().products.error).toBe("Dữ liệu API không hợp lệ");
});

it("hiển thị thông báo từ Error khi fetch gặp lỗi mạng", async () => {
  // Arrange
  mockFetch().mockRejectedValue(new Error("Network down"));
  const store = setupStore();

  // Act
  await store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("failed");
  expect(store.getState().products.error).toBe("Network down");
});

it("dùng thông báo mặc định khi fetch ném giá trị không phải Error", async () => {
  // Arrange
  mockFetch().mockRejectedValue("lỗi dạng chuỗi");
  const store = setupStore();

  // Act
  await store.dispatch(fetchProducts());

  // Assert
  expect(store.getState().products.status).toBe("failed");
  expect(store.getState().products.error).toBe("Không thể tải sản phẩm");
});
