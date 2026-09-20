import { ProductList } from "./features/products/ProductList";

import { Cart } from "./features/cart/Cart";

export default function App() {
  return (
    <>
      <header>
        <div className="header-inner">
          <h1>Mini Shop</h1>

          <span>
            Redux Toolkit + TypeScript
          </span>
        </div>
      </header>

      <main className="layout">
        <ProductList />

        <Cart />
      </main>
    </>
  );
}