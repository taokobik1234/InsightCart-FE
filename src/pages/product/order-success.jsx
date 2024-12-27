import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

export default function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const { orderData, checkoutData, selectedAddress } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/');
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, location.state]);

    if (!location.state || !orderData || !checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Redirecting to home page...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="text-center mb-8">
                        <CheckCircle className="text-green-500 text-6xl mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Thank you for your order. You will be redirected to home page in {countdown} seconds.</p>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">{orderData.order_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium">${checkoutData.total_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium">
                                    {orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedAddress && (
                        <div className="border-t pt-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                            <div className="p-4 border rounded-lg">
                                <p className="font-medium">{selectedAddress.street}</p>
                                <p className="text-sm text-gray-500">
                                    {selectedAddress.district}, {selectedAddress.city}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Phone: {selectedAddress.phone}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {checkoutData.items.map((item) => (
                                <div key={item.checkout_id} className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-600 mb-3">
                                        {item.shop_objects.shop_name}
                                    </h3>
                                    {item.product_list.map((product) => (
                                        <div key={product.product_id} className="flex items-center gap-4 py-3">
                                            <img
                                                src={product.product_image}
                                                alt={product.product_name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{product.product_name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {product.quantity} x ${product.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-blue-600">
                                                    ${(product.quantity * product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 