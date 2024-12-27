import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/carousel";
import { NavLink, useLocation } from "react-router-dom";
import ListProductCard from "../components/ListProductCard";
import ps5 from "../assets/ps5.png"
import ServiceCard from "../components/ServiceCard";
import DotLoader from "../components/ui/DotLoader";
function HomeScreen() {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 8; // Define items per page
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://tancatest.me/api/v1/categories", {
                    method: "GET",
                });
                const result = await response.json();

                if (result?.data?.categories) {
                    setCategories(result.data.categories);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products/all`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                setAllProducts(data.data.items || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        const fetchRecommendedProducts = async (page = 1) => {
            try {
                if (page === 1) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }
                
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products/all?page=${page}&limit=${ITEMS_PER_PAGE}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                
                const newItems = data.data.items || [];
                
                if (page === 1) {
                    setRecommendedProducts(newItems);
                } else {
                    setRecommendedProducts(prevProducts => [...prevProducts, ...newItems]); // Append new items to existing ones
                }
                
                // Check if we have more pages based on total count from API
                setHasMore(data.data.meta.total > page * ITEMS_PER_PAGE);
            } catch (error) {
                console.error("Error fetching recommended products:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchRecommendedProducts(currentPage);
    }, [currentPage]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const initialTime = 7 * 60 * 60;

    const [timeInSeconds, setTimeInSeconds] = useState(initialTime);

    useEffect(() => {
        const timer = timeInSeconds > 0 && setInterval(() => {
            setTimeInSeconds(timeInSeconds - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeInSeconds]);

    const formatTime = () => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return [paddedHours, paddedMinutes, paddedSeconds];
    }

    const [hours, minutes, seconds] = formatTime();
    return (
        <div className="bg-gray-100">
            <div className="flex m-auto pt-2">
                {/* Sidebar with fetched categories */}
                <div
                    className="w-1/4 bg-white  border-r-2 ml-10 h-[500px] overflow-y-auto 
                [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-300"
                >
                    <ul className="space-y-2 text-gray-600 flex flex-col">
                        {/* Dynamically render categories */}
                        {categories.map((category, index) => (
                            <NavLink
                                key={category.id}
                                to={`/products/${category.id}`} // Target link
                                className={({ isActive }) =>
                                    `p-3 cursor-pointer ${isActive
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-100 text-black"
                                    }`
                                }
                            >
                                {category.name.charAt(0).toUpperCase() +
                                    category.name.slice(1)}
                            </NavLink>
                        ))}

                    </ul>
                </div>

                {/* Carousel */}
                <div className="w-3/5 bg-white mx-auto">
                    <CarouselComponent />
                </div>
            </div>
            {/* List Product */}
            <div className="max-w-7xl mx-auto p-6 space-x-8 bg-white mt-10 mb-10">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 px-10">
                    {/* Left Title */}
                    <h2 className="text-2xl font-bold">New Arrivals</h2>

                    {/* Right Button */}
                    <NavLink to={"/products/all"} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        View All
                    </NavLink>
                </div>
                {loading ? (
                    <DotLoader />
                ) : (
                    <ListProductCard products={allProducts} />
                )}
            </div>

            {/* Discount board */}
            <div className="flex max-w-7xl mx-auto space-x-8 bg-white mt-10 mb-10">
                {/* Container */}
                <div className="flex max-w-screen-xl w-full h-1/2 bg-black rounded-lg overflow-hidden shadow-lg">
                    {/* Left Side - Image */}
                    <div className="w-1/2 relative">
                        <img
                            src={ps5}
                            alt="PlayStation 5"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-8">
                            <h1 className="text-4xl font-bold mb-2 text-white">PlayStation 5</h1>
                            <p className="text-lg text-white">
                                Black and White version of the PS5 <br />
                                coming out on sale.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-1/2 flex flex-col justify-center px-10">
                        <h2 className="text-sm font-semibold text-blue-400 mb-2">
                            LIMITED EDITION
                        </h2>
                        <h3 className="text-4xl font-bold mb-4 text-white">Hurry up! 50% OFF</h3>
                        <p className="text-gray-300 mb-6">
                            Find clubs that are right for your game
                        </p>

                        {/* Offer Timer */}
                        <div className="flex space-x-4 mb-6">
                            {[hours, minutes, seconds].map((time, index) => (
                                <div
                                    key={index}
                                    className="bg-white text-gray-900 text-xl font-bold p-3 rounded"
                                >
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Shop Now Button */}
                        <button className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded">
                            Shop now
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommended Today Section */}
            <div className="max-w-7xl mx-auto p-6 bg-white mt-10 mb-10">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 px-10 mb-6">
                    <h2 className="text-2xl font-bold">Recommended Today</h2>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Updated daily</span>
                    </div>
                </div>
                {loading ? (
                    <DotLoader />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                            {recommendedProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <NavLink to={`/products/detail/${product.id}`}>
                                        <div className="relative h-48">
                                            <img
                                                src={product.images[0]?.url || 'placeholder-image-url'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {product.discount > 0 && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 flex justify-between items-center">
                                                <div>
                                                    {product.discount > 0 ? (
                                                        <>
                                                            <span className="text-red-500 font-bold">${product.price * (1 - product.discount / 100)}</span>
                                                            <span className="ml-2 text-gray-400 line-through text-sm">${product.price}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-700 font-bold">${product.price}</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Sold: {product.sold}
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-8">
                            {loadingMore ? (
                                <DotLoader />
                            ) : (
                                hasMore && (
                                    <button
                                        onClick={handleLoadMore}
                                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        View More
                                    </button>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>

            <ServiceCard />
        </div>

    );
}

export default HomeScreen;
