import { useAppDispatch } from "../../app/hooks";

import { addItem } from "../cart/cartSlice";

import type { Product } from "./productTypes";

// Format tiền USD
const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

interface ProductCardProps {
    product: Product;
}

export function ProductCard({
    product,
}: ProductCardProps) {
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addItem(product));
    };

    return (
        <article className="product-card">
            <img
                src={product.image}
                alt={product.title}
                loading="lazy"
            />

            <div>
                <span className="category">
                    {product.category}
                </span>

                <h3>{product.title}</h3>

                <strong>
                    {money(product.price)}
                </strong>
            </div>

            <button onClick={handleAddToCart}>
                + Thêm vào giỏ
            </button>
        </article>
    );
}