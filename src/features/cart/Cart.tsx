import { useAppSelector } from "../../app/hooks";
import { CartItem } from "./CartItem";

// Format tiền USD
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function Cart() {
  const items = useAppSelector((state) => state.cart.items);

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <aside className="cart">
      <h2>
        Giỏ hàng <span>({totalQuantity} sản phẩm)</span>
      </h2>

      {items.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
              />
            ))}
          </ul>

          <div className="total">
            <span>Tổng cộng:</span>
            <strong>{money(totalPrice)}</strong>
          </div>
        </>
      )}
    </aside>
  );
}