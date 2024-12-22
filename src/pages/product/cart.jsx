import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { ImBin } from "react-icons/im";
import debounce from "lodash.debounce";

export default function CartScreen() {
    const { user } = useSelector((state) => state.auth);
    const [cartData, setCartData] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch("http://tancatest.me/api/v1/carts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "session-id": user.session_id,
                        Authorization: `Bearer ${user.token.AccessToken}`,
                        "x-client-id": user.id,
                    },
                });
                const data = await response.json();
                setCartData(data.data.item || []);
                calculateSubtotal(data.data.item || []);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchCartData();
    }, []);

    const calculateSubtotal = (items) => {
        let total = 0;
        items.forEach((shop) => {
            shop.item.forEach((product) => {
                total += product.quantity * product.price;
            });
        });
        setSubtotal(total.toFixed(2));
    };

    const updateCartAPI = async (updatedCart) => {
        try {
            const items = updatedCart.flatMap((shop) =>
                shop.item.map((product) => ({
                    product_id: product.product_id,
                    quantity: product.quantity,
                }))
            );
            console.log(items);
            const response = await fetch("http://tancatest.me/api/v1/carts", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "session-id": user.session_id,
                    Authorization: `Bearer ${user.token.AccessToken}`,
                    "x-client-id": user.id,
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                throw new Error("Failed to update the cart");
            }
            console.log("Cart updated successfully");
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // Debounced updateCartAPI to limit API calls
    const debouncedUpdateCartAPI = useCallback(
        debounce((updatedCart) => {
            updateCartAPI(updatedCart);
        }, 300),
        []
    );

    const updateQuantity = (shopIndex, productIndex, newQuantity) => {
        const updatedCartData = [...cartData];
        updatedCartData[shopIndex].item[productIndex].quantity = newQuantity;
        setCartData(updatedCartData);
        calculateSubtotal(updatedCartData);

        // Trigger debounced API call
        debouncedUpdateCartAPI(updatedCartData);
    };

    const removeProduct = (shopIndex, productIndex) => {
        const updatedCartData = [...cartData];
        updatedCartData[shopIndex].item.splice(productIndex, 1);
        setCartData(updatedCartData);
        calculateSubtotal(updatedCartData);

        // Trigger debounced API call
        debouncedUpdateCartAPI(updatedCartData);
    };

    return (
        <div className="min-h-screen pt-10 mx-auto px-10 bg-gray-100">
            {cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    {/* Empty Cart Message */}
                    <div className="text-gray-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-24 h-24"
                        >
                            <path d="M3 3v18h18V9l-6-6H3zm2 2h9v5h5v10H5V5zm4.707 6.707l1.586-1.586 1.586 1.586a1 1 0 101.414-1.414l-1.586-1.586 1.586-1.586a1 1 0 00-1.414-1.414L10.707 8.293l-1.586-1.586a1 1 0 00-1.414 1.414l1.586 1.586-1.586 1.586a1 1 0 101.414 1.414z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-red-500">
                        YOUR CART IS CURRENTLY EMPTY.
                    </p>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 w-full">
                            {cartData.map((shop, shopIndex) => (
                                <div key={shop.id} className="bg-white mb-10">
                                    <h2 className="font-bold text-lg mb-4 text-center">Shop {shop.shop_name}</h2>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="text-left bg-white">
                                                <th className="p-3">Product</th>
                                                <th className="p-3">Unit Price</th>
                                                <th className="p-3">Quantity</th>
                                                <th className="p-3">Subtotal</th>
                                                <th className="p-3">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shop.item.map((product, productIndex) => (
                                                <tr key={product.product_id} className="border-b">
                                                    <td className="p-3 flex items-center gap-3">
                                                        <img
                                                            src={
                                                                product.medias?.[0]?.url ||
                                                                "https://via.placeholder.com/250"
                                                            }
                                                            alt={product.product_name}
                                                            className="w-12 h-12 object-cover"
                                                        />
                                                        <span>{product.product_name}</span>
                                                    </td>
                                                    <td className="p-3">${product.price.toFixed(2)}</td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            className="w-16 border rounded text-center"
                                                            value={product.quantity}
                                                            min="1"
                                                            onChange={(e) =>
                                                                updateQuantity(
                                                                    shopIndex,
                                                                    productIndex,
                                                                    parseInt(e.target.value) || 1
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        ${(product.quantity * product.price).toFixed(2)}
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            className="text-red-500 hover:underline"
                                                            onClick={() => removeProduct(shopIndex, productIndex)}
                                                        >
                                                            <ImBin />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="lg:w-1/3 w-full bg-white shadow rounded p-4 h-60">
                            <h2 className="font-bold text-lg mb-4">Summary</h2>
                            <div className="flex justify-between mb-4">
                                <span>Subtotal:</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between mb-4 font-bold">
                                <span>Total:</span>
                                <span>${subtotal}</span>
                            </div>
                            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
