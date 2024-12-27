import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutline } from '@mui/icons-material';

export default function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderData, checkoutData, selectedAddress, voucher } = location.state || {};

    if (!orderData || !checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Invalid order data. Please return to shop.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="text-center mb-8">
                        <CheckCircleOutline className="text-green-500 text-6xl mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Thank you for your order.</p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">{orderData.order_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium">
                                    {orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">{selectedAddress.street}</p>
                            <p className="text-gray-600">
                                {selectedAddress.district}, {selectedAddress.city}
                            </p>
                            <p className="text-gray-600">Phone: {selectedAddress.phone}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {checkoutData.items.map((item) => (
                                <div key={item.checkout_id} className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-600 mb-3">
                                        {item.shop_objects.shop_name}
                                    </h3>
                                    {item.product_list.map((product) => (
                                        <div key={product.product_id} className="flex items-center gap-4 mb-3">
                                            <img
                                                src={product.product_image}
                                                alt={product.product_name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{product.product_name}</p>
                                                <p className="text-gray-600">
                                                    Quantity: {product.quantity} x ${product.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${(product.quantity * product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>${checkoutData.total_price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span>Free</span>
                                    </div>
                                    {checkoutData.voucher_discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Voucher Discount:</span>
                                            <span>-${checkoutData.voucher_discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total:</span>
                                        <span>${checkoutData.final_price.toFixed(2)}</span>
                                    </div>
                                    {voucher && (
                                        <div className="mt-2 text-sm text-gray-500">
                                            Applied voucher: {voucher.code}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-x-4">
                    <button
                        onClick={() => navigate('/user/order-history')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
} 