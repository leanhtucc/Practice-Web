import { useAppDispatch } from "../../app/hooks";

import {
    removeItem,
    updateQuantity,
} from "./cartSlice";

import type {
    CartItem as CartItemType,
} from "./cartTypes";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({
    item,
}: CartItemProps) {
    const dispatch = useAppDispatch();

    const {
        product,
        quantity,
    } = item;

    // Giảm số lượng
    const handleDecrease = () => {
        dispatch(
            updateQuantity({
                id: product.id,
                quantity: quantity - 1,
            })
        );
    };

    // Tăng số lượng
    const handleIncrease = () => {
        dispatch(
            updateQuantity({
                id: product.id,
                quantity: quantity + 1,
            })
        );
    };

    // Xóa sản phẩm
    const handleRemove = () => {
        dispatch(removeItem(product.id));
    };

    return (
        <li className="cart-item">
            <img
                src={product.image}
                alt=""
            />

            <div className="cart-item-info">
                <h3>{product.title}</h3>

                <p>
                    ${product.price.toFixed(2)} / sản phẩm
                </p>

                <div className="qty">
                    <button
                        aria-label={`Giảm số lượng ${product.title}`}
                        onClick={handleDecrease}
                    >
                        −
                    </button>

                    <span>{quantity}</span>

                    <button
                        aria-label={`Tăng số lượng ${product.title}`}
                        onClick={handleIncrease}
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                className="remove"
                onClick={handleRemove}
            >
                Xóa
            </button>
        </li>
    );
}