// BAI TAP TUAN 1 - LTWNC
// Module: Quan ly don hang

//1. ERUM
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  E_WALLET = "E_WALLET",
}

export enum ProductCategory {
  ELECTRONICS = "ELECTRONICS",
  FASHION = "FASHION",
  FOOD = "FOOD",
  OTHER = "OTHER",
}

// 2 INTERFACE

export interface Customer {
    id: string,
    name: string,
    email: string,
    phone: string,
    address: string;
}

export interface Product {
    id: string,
    name: string;
    price: number;
    category: ProductCategory;
    stock: number;
    description?: string;
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: string;
    customer: Customer;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    createdAt: Date;
}

// 3 GENERIC

// Generic dùng để tạo kiểu response có thể tái sử dụng
// cho Product, Customer, Order hoặc bất kỳ entity nào khác.
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Generic cho danh sách có phân trang.
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// 4. UTILITY TYPES

// Omit: Khi tạo Product mới, không cần truyền id vì id có thể
// được hệ thống sinh tự động.
export type CreateProduct = Omit<Product, "id">;

// Partial: Khi cập nhật Product, tất cả thuộc tính đều trở thành
// optional, nên chỉ cần truyền những trường muốn thay đổi.
export type UpdateProduct = Partial<Omit<Product, "id">>;

// Pick: Lấy một số thuộc tính cần thiết để hiển thị tóm tắt sản phẩm.
export type ProductSummary = Pick<Product, "id" | "name" | "price">;

// Omit: Khi tạo Customer mới, không cần id.
export type CreateCustomer = Omit<Customer, "id">;

// Partial + Omit: Khi cập nhật Customer, chỉ cần truyền những
// thông tin muốn thay đổi.
export type UpdateCustomer = Partial<Omit<Customer, "id">>;

// Pick: Thông tin cơ bản của Customer dùng trong danh sách.
export type CustomerSummary = Pick<Customer, "id" | "name" | "email">;

// Omit: Khi tạo OrderItem, subtotal có thể được hệ thống tính,
// nên không cần truyền từ phía người dùng.
export type CreateOrderItem = Omit<OrderItem, "id" | "subtotal">;

// Partial + Omit: Cập nhật Order chỉ cho phép thay đổi một số
// trường, không cho sửa id và thời gian tạo.
export type UpdateOrder = Partial<Omit<Order, "id" | "createdAt">>;

// 5. SAMPLE DATA - DEMO SỬ DỤNG CÁC TYPE

const customer: Customer = {
  id: "CUS001",
  name: "Nguyen Van An",
  email: "an@example.com",
  phone: "0901234567",
  address: "Ha Noi",
};

const product: Product = {
  id: "PRO001",
  name: "Ban phim co",
  price: 850000,
  category: ProductCategory.ELECTRONICS,
  stock: 50,
  description: "Ban phim co choi game",
};

const orderItem: OrderItem = {
  id: "ITEM001",
  product,
  quantity: 2,
  unitPrice: product.price,
  subtotal: product.price * 2,
};

const order: Order = {
  id: "ORD001",
  customer,
  items: [orderItem],
  total: orderItem.subtotal,
  status: OrderStatus.PENDING,
  paymentMethod: PaymentMethod.COD,
  createdAt: new Date(),
};

// 6. DEMO GENERIC

const productResponse: ApiResponse<Product> = {
  success: true,
  message: "Lay san pham thanh cong",
  data: product,
};

const orderResponse: ApiResponse<Order> = {
  success: true,
  message: "Lay don hang thanh cong",
  data: order,
};

const productListResponse: PaginatedResponse<Product> = {
  items: [product],
  total: 1,
  page: 1,
  limit: 10,
};

// 7. DEMO UTILITY TYPES

const newProduct: CreateProduct = {
  name: "Chuot khong day",
  price: 450000,
  category: ProductCategory.ELECTRONICS,
  stock: 100,
};

const productUpdate: UpdateProduct = {
  price: 400000,
  stock: 120,
};

const productSummary: ProductSummary = {
  id: product.id,
  name: product.name,
  price: product.price,
};

const newCustomer: CreateCustomer = {
  name: "Tran Thi Binh",
  email: "binh@example.com",
  phone: "0912345678",
  address: "Da Nang",
};

const customerUpdate: UpdateCustomer = {
  phone: "0987654321",
};

const orderUpdate: UpdateOrder = {
  status: OrderStatus.CONFIRMED,
};
