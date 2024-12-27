import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Tabs,
    Tab,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

const ORDER_STATUSES = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
    processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50' },
    shipping: { label: 'Shipping', color: 'text-purple-600 bg-purple-50' },
    delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50' },
    canceled: { label: 'Canceled', color: 'text-red-600 bg-red-50' },
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const userAuth = useSelector((state) => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchOrders(currentStatus);
    }, [currentStatus, userAuth]);

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            const response = await fetch(`http://tancatest.me/api/v1/order?status=${status}`, {
                headers: {
                    'Authorization': `Bearer ${userAuth.token.AccessToken}`,
                    'x-client-id': userAuth.id,
                    'session-id': userAuth.session_id,
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const data = await response.json();
            if (data.error_code === 0) {
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (event, newStatus) => {
        setCurrentStatus(newStatus);
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                <Tabs
                    value={currentStatus}
                    onChange={handleStatusChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="bg-white rounded-lg shadow-sm mb-6 p-2"
                >
                    {Object.entries(ORDER_STATUSES).map(([status, { label }]) => (
                        <Tab
                            key={status}
                            value={status}
                            label={label}
                            className={currentStatus === status ? 'text-blue-600' : ''}
                        />
                    ))}
                </Tabs>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <CircularProgress />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.order_id}
                                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID: {order.order_id}</p>
                                        <p className="text-sm text-gray-500">
                                            Ordered on: {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${ORDER_STATUSES[order.status].color}`}>
                                        {ORDER_STATUSES[order.status].label}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {order.products.map((product) => (
                                        <div key={product.product_id} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="font-medium">{product.product_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {product.quantity} x ${product.price}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ${(product.quantity * product.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Amount:</span>
                                        <span className="text-lg font-bold">${order.total_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Order Details</DialogTitle>
                    {selectedOrder && (
                        <DialogContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID: {selectedOrder.order_id}</p>
                                        <p className="text-sm text-gray-500">
                                            Ordered on: {new Date(selectedOrder.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${ORDER_STATUSES[selectedOrder.status].color}`}>
                                        {ORDER_STATUSES[selectedOrder.status].label}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {selectedOrder.products.map((product) => (
                                        <div key={product.product_id} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="font-medium">{product.product_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {product.quantity} x ${product.price}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ${(product.quantity * product.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Amount:</span>
                                        <span className="text-lg font-bold">
                                            ${selectedOrder.total_price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
} 