import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DotLoader from "../../components/ui/DotLoader";
import { useNavigate } from "react-router-dom";
export default function ProductList() {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
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
                const searchQuery = searchParams.get("search");
                if (searchQuery) {
                    url += `&search=${encodeURIComponent(searchQuery)}`;
                }
                console.log(url);
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
    }, [categoryId, page, limit, searchParams]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            {loading ? (
                <DotLoader />
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-6 gap-6">
                        {products.map((product) => (
                            <div
                                onClick={() => navigate(`/products/details/${product.id}`)}
                                key={product.id}
                                className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition bg-white relative mx-2 cursor-pointer"
                            >
                                {/* Badge (Top or Sale) */}
                                {product.badge && (
                                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {product.badge}
                                    </span>
                                )}
                                {product.discount && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        -{product.discount}%
                                    </span>
                                )}

                                {/* Product Image */}
                                <img
                                    src={product.images?.[0]?.url || "https://via.placeholder.com/150"}
                                    alt={product.name}
                                    className="w-full h-48 object-contain"
                                />

                                {/* Product Info */}
                                <div className="text-center p-3">
                                    <p className="text-red-500 font-bold text-lg mb-1">
                                        $ {product.price || "N/A"}
                                    </p>
                                    <p className="text-gray-800 text-sm font-medium mb-2 truncate">
                                        {product.name}
                                    </p>
                                    {/* Star Rating */}
                                    <div className="flex justify-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-yellow-500 fill-current"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 17.3l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.76-1.64 7.03z" />
                                            </svg>
                                        ))}
                                    </div>
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
