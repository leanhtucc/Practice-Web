# TypeScript - Bai tap tuan 1

## 1. De bai

Thiết kế bộ type TypeScript đầy đủ cho module "Quản lý đơn hàng", gồm:

- Order
- OrderItem
- Product
- Customer

Bắt buộc sử dụng:

- Interface
- Enum
- Generic
- Utility Types như Partial, Pick, Omit

## 2. Cấu trúc project

```text
typescript-order-management/
├── src/
│   └── order-management.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 3. Giải thích thiết kế

### Interface

Sử dụng `interface` để mô tả cấu trúc của `Customer`, `Product`, `OrderItem` và `Order`.
Các đối tượng này có nhiều thuộc tính và có quan hệ với nhau. Ví dụ `Order` chứa một `Customer`
và danh sách `OrderItem`; mỗi `OrderItem` tham chiếu tới một `Product`.

### Enum

Sử dụng `enum` cho các giá trị có tập lựa chọn cố định:

- `OrderStatus`: trạng thái đơn hàng.
- `PaymentMethod`: phương thức thanh toán.
- `ProductCategory`: danh mục sản phẩm.

Cách này giúp hạn chế việc truyền các chuỗi không hợp lệ.

### Generic

Tạo `ApiResponse<T>` để mô tả response API có thể chứa nhiều loại dữ liệu khác nhau.
Ví dụ:

- `ApiResponse<Product>`
- `ApiResponse<Order>`

Ngoài ra có `PaginatedResponse<T>` để tái sử dụng cho danh sách có phân trang.

### Utility Types

- `Omit`: dùng để tạo type tạo mới, loại bỏ các trường như `id`.
- `Partial`: dùng cho dữ liệu cập nhật vì khi update thường chỉ thay đổi một vài trường.
- `Pick`: dùng để lấy một số trường cần thiết, ví dụ `ProductSummary`.

Nhờ Utility Types, không phải khai báo lại toàn bộ thuộc tính và giảm code trùng lặp.

## 4. Cách chạy

Cài dependency:

```bash
npm install
```

Build kiểm tra TypeScript:

```bash
npm run build
```

Chạy demo:

```bash
npm start
```

