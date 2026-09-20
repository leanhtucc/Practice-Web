import { Product } from "../products/productTypes";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface UpdateQuantityPayload {
  id: number;
  quantity: number;
}

export type UpdateQuatityPayload = UpdateQuantityPayload;