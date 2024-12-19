import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Default styles for react-multi-carousel
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6, slidesToSlide: 6 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 3, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 767, min: 464 }, items: 2, slidesToSlide: 1 },
};

export default function ListProductCard({ products }) {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <div className="max-w-screen-xl mx-auto my-6 px-4">
            <Carousel
                responsive={responsive}
                // autoPlay={true}
                swipeable={true}
                draggable={true}
                infinite={true}
                showDots={false}
                keyBoardControl={true}
                partialVisible={false}
                dotListClass="custom-dot-list-style"
                customLeftArrow={<button
                    onClick={() => { }}
                    className="absolute left-0   bg-white rounded-full hover:bg-gray-800 "
                >
                    <IoIosArrowBack size={40} color="black" />
                </button>}
                customRightArrow={<button
                    onClick={() => { }}
                    className="absolute right-0   bg-white rounded-full hover:bg-gray-800 "
                >
                    <IoIosArrowForward size={40} color="black" />
                </button>}
                containerClass="carousel-container"
            >
                {products.map((product) => (
                    <div
                        onClick={() => { navigate(`/products/details/${product.id}`) }}
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
                                $ 10
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
            </Carousel>
        </div>
    );
}
