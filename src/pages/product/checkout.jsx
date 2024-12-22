import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { checkoutData, cartData } = location.state || {};
    
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [addresses, setAddresses] = useState([]);
    const [message, setMessage] = useState({ type: '', message: '' });
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        district: '',
        city: '',
        phone: '',
        isDefault: false
    });
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        fetchAddresses();

        // Calculate and update remaining time
        const updateRemainingTime = () => {
            const expireDate = new Date(checkoutData.expired_at);
            const now = new Date();
            const diff = expireDate - now;

            if (diff <= 0) {
                setRemainingTime('Expired');
                return;
            }

            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
            const days = Math.floor(diff / 1000 / 60 / 60 / 24);

            let timeStr = '';
            if (days > 0) timeStr += `${days}d `;
            if (hours > 0) timeStr += `${hours}h `;
            timeStr += `${minutes}m`;

            setRemainingTime(timeStr);
        };

        updateRemainingTime();
        const timer = setInterval(updateRemainingTime, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [checkoutData.expired_at]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch('http://tancatest.me/api/v1/user/addresses', {
                headers: {
                    'Content-Type': 'application/json',
                    'session-id': user.session_id,
                    'Authorization': `Bearer ${user.token.AccessToken}`,
                    'x-client-id': user.id
                }
            });
            const data = await response.json();
            if (data.message === 'Success') {
                setAddresses(data.data.addresses || []);
                const defaultAddr = data.data.addresses.find(addr => addr.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr.id);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setMessage({ type: 'error', message: 'Failed to load addresses' });
        }
    };

    const handleAddAddress = async () => {
        try {
            const response = await fetch('http://tancatest.me/api/v1/user/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'session-id': user.session_id,
                    'Authorization': `Bearer ${user.token.AccessToken}`,
                    'x-client-id': user.id
                },
                body: JSON.stringify(newAddress)
            });
            const data = await response.json();
            if (data.message === 'Success') {
                setMessage({ type: 'success', message: 'Address added successfully' });
                setIsAddressDialogOpen(false);
                fetchAddresses();
                setNewAddress({
                    street: '',
                    district: '',
                    city: '',
                    phone: '',
                    isDefault: false
                });
            } else {
                setMessage({ type: 'error', message: data.message || 'Failed to add address' });
            }
        } catch (error) {
            console.error('Error adding address:', error);
            setMessage({ type: 'error', message: 'Failed to add address' });
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setMessage({ type: 'error', message: 'Please select a delivery address' });
            return;
        }

        try {
            const orderData = {
                checkout_id: checkoutData.items[0].checkout_id,
                address_id: selectedAddress,
                payment_method: paymentMethod
            };

            const response = await fetch('http://tancatest.me/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'session-id': user.session_id,
                    'Authorization': `Bearer ${user.token.AccessToken}`,
                    'x-client-id': user.id
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (data.message === 'Success') {
                setMessage({ type: 'success', message: 'Order placed successfully!' });
                
                if (paymentMethod === 'card') {
                    window.location.href = data.data.payment_url;
                } else {
                    setTimeout(() => {
                        navigate('/orders');
                    }, 2000);
                }
            } else {
                setMessage({ type: 'error', message: data.message || 'Failed to place order' });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setMessage({ type: 'error', message: 'Failed to place order. Please try again.' });
        }
    };

    if (!checkoutData || !cartData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Invalid checkout session. Please return to cart.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            {message.message && (
                <div className={`fixed top-5 right-5 p-4 rounded-md ${
                    message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white z-50`}>
                    {message.message}
                </div>
            )}
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                            <div className="space-y-4">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr.id}
                                        className={`block p-4 border rounded-lg cursor-pointer ${
                                            selectedAddress === addr.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="address"
                                                value={addr.id}
                                                checked={selectedAddress === addr.id}
                                                onChange={(e) => setSelectedAddress(e.target.value)}
                                                className="mr-3"
                                            />
                                            <div>
                                                <p className="font-medium">{addr.street}</p>
                                                <p className="text-sm text-gray-500">
                                                    {addr.district}, {addr.city}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Phone: {addr.phone}
                                                </p>
                                                {addr.isDefault && (
                                                    <span className="text-sm text-blue-600">Default Address</span>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                                <button 
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => setIsAddressDialogOpen(true)}
                                >
                                    + Add New Address
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-4">
                                <label className="block p-4 border rounded-lg cursor-pointer">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-gray-500">Pay when you receive</p>
                                        </div>
                                    </div>
                                </label>
                                <label className="block p-4 border rounded-lg cursor-pointer">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">Credit/Debit Card</p>
                                            <p className="text-sm text-gray-500">Pay now with your card</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {checkoutData.items.map((item) => (
                                    <div key={item.checkout_id}>
                                        <h3 className="font-medium mb-2">{item.shop_objects.shop_name}</h3>
                                        {item.product_list.map((product) => (
                                            <div key={product.product_id} className="flex justify-between items-center mb-2">
                                                <div className="flex items-center">
                                                    <img
                                                        src={product.product_image}
                                                        alt={product.product_name}
                                                        className="w-12 h-12 object-cover rounded mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{product.product_name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {product.quantity} x ${product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">
                                                    ${(product.quantity * product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                        <div className="text-right font-medium mt-2">
                                            Subtotal: ${item.price}
                                        </div>
                                        <hr className="my-4" />
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${checkoutData.total_price}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${checkoutData.total_price}</span>
                                </div>
                                
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
                                >
                                    Place Order
                                </button>
                                
                                <p className="text-lg font-semibold text-red-500 mt-4 text-center">
                                    Order expires in: {remainingTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Dialog */}
            <Dialog open={isAddressDialogOpen} onClose={() => setIsAddressDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-4">
                        <TextField
                            fullWidth
                            label="Street Address"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="District"
                            value={newAddress.district}
                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Set as Default</InputLabel>
                            <Select
                                value={newAddress.isDefault}
                                label="Set as Default"
                                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.value })}
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddressDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddAddress} variant="contained" color="primary">
                        Add Address
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
} 