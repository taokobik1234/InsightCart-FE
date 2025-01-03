import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import ListProductCard from "../../components/ListProductCard";
import ServiceCard from "../../components/ServiceCard";
import { Alert, Box } from "@mui/material";
import { useSelector } from "react-redux";

export default function ProductDetailPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { productId } = useParams();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [productDetail, setProductDetail] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [message, setMessage] = useState({ type: "", message: "" });
    const [shop, setShop] = useState();
    
    const convertDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
        
            year: 'numeric', 
            month: 'long',    
            day: 'numeric', 
          
        };
        const formattedDate = date.toLocaleString('en-US', options);
        return formattedDate;
    } 
        
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products/${productId}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                const productImages = data?.data?.avatar || [];
                setProductDetail(data?.data || {});
                setImages(productImages);
                setSelectedImage(
                    productImages.length > 0
                        ? productImages[0].url
                        : "https://via.placeholder.com/300"
                );
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchProductDetail();
    }, [productId]);

    useEffect(() => {
        if (!productDetail.category_id) return;

        const fetchRelatedProducts = async () => {
            try {
                const categoryQuery = Array.isArray(productDetail.category_id)
                    ? productDetail.category_id.map((id) => `category_ids=${id}`).join("&")
                    : `category_ids=${productDetail.category_id}`;

                console.log(categoryQuery);
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products/all?${categoryQuery}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                setRelatedProducts(data.data.items || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
         
        const fetchShop = async () => {
            try { 
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/${productDetail.shop_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "session-id": user.session_id,
                            Authorization: `Bearer ${user.token.AccessToken}`,
                            "x-client-id": user.id,
                          }, 
                    }
                     
                );
                 
                const data = await response.json();
                setShop(data.data) 
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchShop(); 
        fetchRelatedProducts();
    }, [productDetail]);
    const handleQuantityChange = (type) => {
        if (type === "increment") setQuantity(quantity + 1);
        if (type === "decrement" && quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddtoCart = async () => {
        if (!isAuthenticated) {
            setMessage({ type: "warning", message: "You need to sign in to add to cart" });
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        try {
            const response = await fetch(
                `http://tancatest.me/api/v1/carts/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "session-id": user.session_id,
                        "Authorization": `Bearer ${user.token.AccessToken}`,
                        "x-client-id": user.id
                    },
                    body: JSON.stringify({ product_id: productId, quantity: quantity }),
                }
            );
            const data = await response.json();
            if (data.message !== "Success") {
                setMessage({ type: "warning", message: data.message });
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage({ type: "success", message: "Added to cart" });
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const handleViewShop = () => {
        if (!isAuthenticated) {
            setMessage({ type: "warning", message: "You need to sign in to View Shop" });
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        navigate(`/shop/${productDetail.shop_id}`);
    }
    return (
        <div className="bg-gray-100 min-h-screen py-10">
            {/* details */}
            {message.message && (
                <Box
                    sx={{
                        position: "fixed",
                        top: "100px",
                        right: "20px",
                        zIndex: 1000, // Ensures it is above other components
                        minWidth: "250px",
                    }}
                >
                    <Alert severity={message.type} variant="filled">
                        {message.message}
                    </Alert>
                </Box>
            )}
            <div className="max-w-7xl mx-auto p-6 flex space-x-8 bg-white">
                {/* Left Side - Images */}
                <div className="flex space-x-4">
                    {/* Thumbnail Images */}
                    <div className="flex flex-col space-y-4">
                        {images && images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.url}
                                alt="thumbnail"
                                className={`w-20 h-20 rounded border cursor-pointer ${img === selectedImage ? "border-blue-500" : "border-gray-300"}`}
                                onClick={() => setSelectedImage(img.url)}
                            />
                        ))}
                    </div>
                    {/* Main Image */}
                    <div>
                        <img
                            src={selectedImage}
                            alt="Main"
                            className="w-[400px] h-[400px] object-cover rounded"
                        />
                    </div>
                </div>

                {/* Right Side - Product Details */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{productDetail.name}</h1>
                    <div className="flex items-center space-x-2 text-sm mb-4">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span>(150 Reviews)</span>
                        <span className="text-green-500 font-semibold">In Stock</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mb-4">
                        <span className="text-black-500">Seller: {productDetail.shop_name}</span>

                    </div>
                    <h2 className="text-3xl font-bold mb-2">${productDetail.price}</h2>
                    <p className="text-gray-600 mb-4">
                        {productDetail.description || "No description available"}
                    </p>

                    {/* Quantity and Buy */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center border rounded">
                            <button
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                                onClick={() => handleQuantityChange("decrement")}
                            >
                                <AiOutlineMinus />
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                                onClick={() => handleQuantityChange("increment")}
                            >
                                <AiOutlinePlus />
                            </button>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-red-600" onClick={handleAddtoCart}>
                            Add to Cart
                        </button>

                        <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300 font-bold">
                            Buy Now
                        </button>
                    </div>

                    {/* Delivery Information */}
                    <div className="border-t pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-xl">🚚</span>
                            <div>
                                <h3 className="font-semibold">Free Delivery</h3>
                                <p className="text-gray-600 text-sm">
                                    Enter your postal code for Delivery Availability
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl">🔄</span>
                            <div>
                                <h3 className="font-semibold">Return Delivery</h3>
                                <p className="text-gray-600 text-sm">
                                    Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Shop Information */}
            <div className="max-w-7xl mx-auto p-6 bg-white mt-10">
                <div className="flex items-start space-x-4 border-b pb-6 mb-6">
                    {/* Shop Logo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                            src={shop?.avatar_obj?.url || "https://via.placeholder.com/64"}
                            alt="Shop Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Shop Details   */}
                    <div className="flex-[0.25] flex space-x-4">
                        {/* Shop Details */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">{shop?.name || "Shop Name"}</h2>
                            <p className="text-gray-500">Online {shop?.last_active || "N/A"} ago</p>
                        </div>


                    </div>
                    <div className="flex-1 flex justify-between items-center " >
                        {/* Shop Statistics */}
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                                <span className="text-gray-500">Rating </span>
                                <p className="font-bold">{productDetail.shop_reviews || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Phone</span>
                                <p className="font-bold">{shop?.phone || "N/A"}</p>
                            </div>

                            <div>
                                <span className="text-gray-500">Join date </span>
                                <p className="font-bold">{convertDate(shop?.created_at) || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Address</span>
                                <p className="font-bold">{shop?.address.city + ", " + shop?.address.district + ", " + shop?.address.street || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex space-x-4">
                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Chat Now
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100" onClick={handleViewShop}>
                            View Shop
                        </button>

                    </div>
                </div>
            </div>

            {/* description */}
            <div className="max-w-7xl mx-auto p-6 space-x-8 bg-white mt-10">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === "description"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === "reviews"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        Reviews (2)
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "description" && (
                        <div>
                            <p className="text-gray-700 leading-relaxed">
                                {productDetail.description || "No description available"}
                            </p>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Review 1:</strong> Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Pellentesque euismod, nibh et suscipit ultrices,
                                lorem odio vestibulum eros, ac scelerisque sapien metus non ligula.
                            </p>
                            <p className="text-gray-700 mt-4 leading-relaxed">
                                <strong>Review 2:</strong> Proin in quam nec nulla tincidunt
                                facilisis. Nullam at ligula vel erat consequat efficitur nec vel
                                elit.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* related product */}
            <div className="max-w-7xl mx-auto p-6 space-x-8 bg-white mt-10">
                <div className="mt-10">
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2 px-10">
                        {/* Left Title */}
                        <h2 className="text-2xl font-bold">Related Products</h2>


                    </div>
                    <ListProductCard products={relatedProducts} />
                </div>
            </div>
            <ServiceCard />
        </div>
    );
}
