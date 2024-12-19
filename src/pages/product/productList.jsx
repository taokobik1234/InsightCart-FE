import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DotLoader from "../../components/ui/DotLoader";
import Carousel from "../../components/carousel";

export default function ProductList() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(5);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = `http://tancatest.me/api/v1/shops/products/all?page=${page}&limit=${limit}`;
                if (categoryId !== 'all') {
                    url += `&category_ids=${categoryId}`;
                }
                const response = await fetch(
                    url,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();

                setProducts(data.data.items || []);
                setTotalPages(Math.ceil(data.data.meta.total / limit));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, page, limit]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <div className="w-4/5 bg-white mx-auto">
                <Carousel />
            </div>
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            {loading ? (
                <DotLoader />
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-6 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative bg-gray-50"
                            >
                                {/* Badge and Discount */}
                                <div className="absolute top-3 left-3">
                                    {product.isNew && (
                                        <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded shadow">
                                            NEW
                                        </span>
                                    )}
                                    {product.discount && (
                                        <span className="block mt-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Product Image */}
                                <img
                                    src={
                                        product.images?.length > 0
                                            ? product.images[0].url
                                            : "https://via.placeholder.com/150"
                                    }
                                    alt={product.name}
                                    className="w-full h-50 object-cover p-1"
                                />

                                {/* Product Info */}
                                <div className="p-4 text-center">
                                    <p className="font-semibold mb-1 text-gray-800">{product.name}</p>
                                    <p className="text-gray-600 font-medium mb-1">${product.price}</p>
                                    {/* Add to Cart Button */}
                                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-lg font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
