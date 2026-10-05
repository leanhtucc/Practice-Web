import type { Product } from "../features/products/productTypes";
import type { CartState } from "../features/cart/cartTypes";

export const makeProduct = (override: Partial<Product> = {}): Product => ({
  id: 1,
  title: "Áo thun test",
  price: 100,
  description: "Mô tả sản phẩm",
  category: "clothing",
  image: "https://example.com/image.jpg",
  rating: { rate: 4.5, count: 10 },
  ...override,
});

export const makeCartState = (
  entries: Array<{ product?: Partial<Product>; quantity?: number }> = []
): CartState => ({
  items: entries.map((e, index) => ({
    product: makeProduct({ id: index + 1, ...e.product }),
    quantity: e.quantity ?? 1,
  })),
});