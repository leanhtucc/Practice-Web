import Accordion from "./components/Accordion/Accordion";
import { products } from "./data/products";
import { usePagination } from "./hooks/usePagination";

import "./App.css";
import "./components/Accordion/Accordion.css";

function App() {
  const {
    currentPage,
    totalPages,
    currentItems,
    next,
    prev,
    goToPage,
  } = usePagination(products, 3);

  return (
    <div className="container">
      <h1>Bài tập Buổi 2</h1>

      <section>
        <h2>1. Compound Component Accordion</h2>

        <Accordion defaultValue="item1">
          <Accordion.Item value="item1">
            <Accordion.Trigger value="item1">
              React là gì?
            </Accordion.Trigger>

            <Accordion.Content value="item1">
              React là thư viện JavaScript dùng để xây dựng giao diện.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item2">
            <Accordion.Trigger value="item2">
              Context API là gì?
            </Accordion.Trigger>

            <Accordion.Content value="item2">
              Context API cho phép chia sẻ dữ liệu giữa các component
              mà không phải truyền props qua nhiều tầng.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item3">
            <Accordion.Trigger value="item3">
              Compound Component là gì?
            </Accordion.Trigger>

            <Accordion.Content value="item3">
              Compound Component là pattern gồm nhiều component nhỏ
              phối hợp với nhau tạo thành một UI hoàn chỉnh.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>

      <section>
        <h2>2. Product Pagination</h2>

        <div className="products">
          {currentItems.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >
              <h3>{product.name}</h3>

              <p>
                Giá:{" "}
                {product.price.toLocaleString("vi-VN")}đ
              </p>

              <p>Danh mục: {product.category}</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={prev}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={
                currentPage === page
                  ? "active-page"
                  : ""
              }
            >
              {page}
            </button>
          ))}

          <button
            onClick={next}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <p>
          Trang {currentPage} / {totalPages}
        </p>
      </section>
    </div>
  );
}

export default App;
