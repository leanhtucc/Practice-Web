import { useEffect } from "react";

import {
    useAppDispatch,
    useAppSelector,
} from "../../app/hooks";

import { fetchProducts } from "./productsSlice";

import { ProductCard } from "./ProductCard";

export function ProductList() {
    const dispatch = useAppDispatch();

    const {
        items,
        status,
        error,
    } = useAppSelector(
        (state) => state.products
    );

    // Gọi API khi dữ liệu chưa được tải
    useEffect(() => {
        if (status === "idle") {
            void dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    return (
        <section>
            <div className="section-heading">
                <h2>Danh sách sản phẩm</h2>

                <span>
                    {items.length} sản phẩm
                </span>
            </div>

            {/* Đang tải */}
            {status === "loading" && (
                <p role="status">
                    Đang tải sản phẩm...
                </p>
            )}

            {/* Có lỗi */}
            {status === "failed" && (
                <div role="alert">
                    <p>Lỗi: {error}</p>

                    <button
                        onClick={() =>
                            void dispatch(fetchProducts())
                        }
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Thành công */}
            {status === "succeeded" && (
                items.length > 0 ? (
                    <div className="products">
                        {items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Chưa có sản phẩm.</p>
                )
            )}
        </section>
    );
}