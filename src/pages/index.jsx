import React, { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import { NavLink } from "react-router-dom";
import ListProductCard from "../components/ListProductCard";
function HomeScreen() {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    // Fetch categories on component mount
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
            }
        };

        fetchAllProducts();
    }, []);
    console.log(allProducts);
    return (
        <div>
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
                    <Carousel />
                </div>
            </div>
            <div className="mt-10">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 px-10">
                    {/* Left Title */}
                    <h2 className="text-2xl font-bold">New Arrivals</h2>

                    {/* Right Button */}
                    <NavLink to={"/products/all"} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        View All
                    </NavLink>
                </div>
                <ListProductCard products={allProducts} />
            </div>
        </div>

    );
}

export default HomeScreen;
