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
    Checkbox,
    FormControlLabel,
} from '@mui/material';

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const userAuth = useSelector((state) => state.auth.user);
    const { checkoutData, cartData } = location.state || {};
    
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [addresses, setAddresses] = useState([]);
    const [message, setMessage] = useState({ type: '', message: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddressListDialog, setOpenAddressListDialog] = useState(false);
    const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [addressInput, setAddressInput] = useState({
        street: '',
        district: '',
        city: '',
        province: '',
        phone: '',
        default: false
    });
    const [remainingTime, setRemainingTime] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(null);

    useEffect(() => {
        fetchAddresses();

        const updateRemainingTime = () => {
            const expireDate = new Date(checkoutData.expired_at);
            const now = new Date();
            const diff = expireDate - now;

            if (diff <= 0) {
                setRemainingTime('Expired');
                setIsExpired(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let timeStr = '';
            if (days > 0) timeStr += `${days}d `;
            if (hours > 0) timeStr += `${hours}h `;
            if (minutes > 0) timeStr += `${minutes}m `;
            timeStr += `${seconds}s`;

            setRemainingTime(timeStr);
        };

        updateRemainingTime();
        const timer = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(timer);
    }, [checkoutData.expired_at]);

    const showMessage = (type, msg) => {
        setMessage({ type, message: msg });
        setTimeout(() => {
            setMessage({ type: '', message: '' });
        }, 3000);
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`http://tancatest.me/api/v1/users/${userAuth.id}`, {
                headers: {
                    "Authorization": `Bearer ${userAuth.token.AccessToken}`,
                    "x-client-id": userAuth.id,
                    "session-id": userAuth.session_id,
                }
            });
            const data = await response.json();
            if (data.error_code === 0) {
                setAddresses(data.data.addressess || []);
                const defaultAddr = data.data.addressess.find(addr => addr.default);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr.id);
                    setDefaultAddress(defaultAddr);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddressDialog = (address = null) => {
        if (address) {
            setSelectedAddress(address);
            setAddressInput(address);
        } else {
            setSelectedAddress(null);
            setAddressInput({
                street: '',
                district: '',
                city: '',
                province: '',
                phone: '',
                default: false
            });
        }
        setOpenDialog(true);
    };

    const handleSaveAddress = async () => {
        try {
            const method = selectedAddress ? "PATCH" : "POST";
            const url = "http://tancatest.me/api/v1/users/address";

            const requestBody = selectedAddress 
                ? { ...addressInput, id: selectedAddress.id }
                : addressInput;

            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${userAuth.token.AccessToken}`,
                    "x-client-id": userAuth.id,
                    "session-id": userAuth.session_id,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (data.error_code === 0) {
                fetchAddresses();
                setOpenDialog(false);
                showMessage('success', selectedAddress ? "Address updated successfully!" : "Address added successfully!");
            }
        } catch (error) {
            console.error('Error saving address:', error);
            showMessage('error', 'Failed to save address');
        }
    };

    const handlePlaceOrder = async () => {
        if (isExpired) {
            showMessage('error', 'This checkout session has expired. Please return to cart.');
            return;
        }

        if (!selectedAddress) {
            showMessage('error', 'Please select a delivery address');
            return;
        }

        try {
            const orderData = {
                checkout_id: checkoutData.checkout_id,
                address_id: selectedAddress,
                payment_method: paymentMethod,
                ...(selectedVoucher && { voucher_id: selectedVoucher.id })
            };

            const response = await fetch('http://tancatest.me/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'session-id': userAuth.session_id,
                    'Authorization': `Bearer ${userAuth.token.AccessToken}`,
                    'x-client-id': userAuth.id
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (data.error_code === 0) { 
                console.log(data);
                showMessage('success', 'Order placed successfully!');
                
                navigate('/order-success', {
                    state: {
                        orderData: {
                            order_id: data.data.order_id,
                            payment_method: paymentMethod
                        },
                        checkoutData: {
                            total_price: checkoutData.total_price,
                            items: checkoutData.items,
                            voucher_discount: voucherDiscount,
                            final_price: checkoutData.total_price - voucherDiscount
                        },
                        selectedAddress: defaultAddress,
                        voucher: selectedVoucher
                    }
                });
            } else {
                showMessage('error', data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showMessage('error', 'Failed to place order. Please try again.');
        }
    };

    const handleBackToCart = () => {
        navigate('/cart');
    };

    const handleSelectAddress = (addressId) => {
        setSelectedAddress(addressId);
        const selected = addresses.find(addr => addr.id === addressId);
        setDefaultAddress(selected);
        setOpenAddressListDialog(false);
    };

    const fetchVouchers = async () => {
        try {
            const response = await fetch('http://tancatest.me/api/v1/vouchers?page=1&limit=10', {
                headers: {
                    "Authorization": `Bearer ${userAuth.token.AccessToken}`,
                    "x-client-id": userAuth.id,
                    "session-id": userAuth.session_id,
                    "Access-Control-Allow-Origin": "*",
                    "accept": "application/json"
                }
            });
            const data = await response.json();
            if (data.error_code === 0) {
                setVouchers(data.data.list || []);
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            showMessage('error', 'Failed to fetch vouchers');
        }
    };

    const handleApplyVoucher = async (voucher) => {
        try {
            const response = await fetch('http://tancatest.me/api/v1/vouchers/apply', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${userAuth.token.AccessToken}`,
                    "x-client-id": userAuth.id,
                    "session-id": userAuth.session_id,
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    id: voucher.id,
                    order_amount: checkoutData.total_price
                })
            });
            const data = await response.json();
            if (data.error_code === 0) {
                setSelectedVoucher(data.data.voucher);
                setVoucherDiscount(data.data.discount_amount || 0);
                showMessage('success', 'Voucher applied successfully!');
                setOpenVoucherDialog(false);
            } else {
                showMessage('error', data.message || 'Failed to apply voucher');
            }
        } catch (error) {
            console.error('Error applying voucher:', error);
            showMessage('error', 'Failed to apply voucher');
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
                
                {isExpired && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        <strong className="font-bold">Checkout Expired! </strong>
                        <span className="block sm:inline">This checkout session has expired. Please return to cart and try again.</span>
                        <button
                            onClick={handleBackToCart}
                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Back to Cart
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Delivery Address</h2>
                                <button 
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => setOpenAddressListDialog(true)}
                                    disabled={isExpired}
                                >
                                    Change Address
                                </button>
                            </div>
                            
                            {defaultAddress ? (
                                <div className="p-4 border rounded-lg">
                                    <p className="font-medium">{defaultAddress.street}</p>
                                    <p className="text-sm text-gray-500">
                                        {defaultAddress.district}, {defaultAddress.city}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Phone: {defaultAddress.phone}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-yellow-500 font-medium">
                                    Please add your address to complete the order
                                </p>
                            )}
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
                                            disabled={isExpired}
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
                                            disabled={isExpired}
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
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Voucher</h2>
                                <button 
                                    onClick={() => {
                                        setOpenVoucherDialog(true);
                                        fetchVouchers();
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                    disabled={isExpired}
                                >
                                    {selectedVoucher ? 'Change Voucher' : 'Apply Voucher'}
                                </button>
                            </div>
                            
                            {selectedVoucher && (
                                <div className="p-4 border rounded-lg">
                                    <p className="font-medium">{selectedVoucher.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Discount: ${voucherDiscount}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-6 mb-6">
                                {checkoutData.items.map((item) => (
                                    <div key={item.checkout_id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-blue-600">
                                                {item.shop_objects.shop_name}
                                            </h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {item.product_list.map((product) => (
                                                <div key={product.product_id} className="flex gap-4 p-3 bg-white rounded-lg shadow-sm">
                                                    <img
                                                        src={product.product_image}
                                                        alt={product.product_name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 mb-1">
                                                            {product.product_name}
                                                        </h4>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm text-gray-600">
                                                                Quantity: {product.quantity}
                                                            </p>
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-500">
                                                                    ${product.price} each
                                                                </p>
                                                                <p className="font-semibold text-blue-600">
                                                                    ${(product.quantity * product.price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Shop Subtotal:</span>
                                                <span className="text-lg font-semibold text-blue-600">
                                                    ${item.price}
                                                </span>
                                            </div>
                                        </div>
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
                                {voucherDiscount > 0 && (
                                    <div className="flex justify-between mb-2 text-green-600">
                                        <span>Voucher Discount</span>
                                        <span>-${voucherDiscount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${(checkoutData.total_price - voucherDiscount).toFixed(2)}</span>
                                </div>
                                
                                <button
                                    onClick={handlePlaceOrder}
                                    className={`w-full py-3 rounded-lg mt-6 ${
                                        isExpired 
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white`}
                                    disabled={isExpired}
                                >
                                    {isExpired ? 'Checkout Expired' : 'Place Order'}
                                </button>
                                
                                <p className={`text-lg font-semibold mt-4 text-center ${
                                    isExpired ? 'text-red-500' : 'text-red-500'
                                }`}>
                                    {isExpired ? 'Checkout has expired' : `Order expires in: ${remainingTime}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address List Dialog */}
            <Dialog 
                open={openAddressListDialog} 
                onClose={() => setOpenAddressListDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Select Delivery Address</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`p-4 border rounded-lg cursor-pointer ${
                                    selectedAddress === addr.id ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                                onClick={() => handleSelectAddress(addr.id)}
                            >
                                <p className="font-medium">{addr.street}</p>
                                <p className="text-sm text-gray-500">
                                    {addr.district}, {addr.city}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Phone: {addr.phone}
                                </p>
                                {addr.default && (
                                    <span className="text-sm text-blue-600">Default Address</span>
                                )}
                            </div>
                        ))}
                        <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                                setOpenAddressListDialog(false);
                                handleAddressDialog();
                            }}
                        >
                            + Add New Address
                        </button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddressListDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Address Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
                    {selectedAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        margin="dense"
                        label="Street"
                        fullWidth
                        value={addressInput.street}
                        onChange={(e) => setAddressInput({...addressInput, street: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="District"
                        fullWidth
                        value={addressInput.district}
                        onChange={(e) => setAddressInput({...addressInput, district: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        fullWidth
                        value={addressInput.city}
                        onChange={(e) => setAddressInput({...addressInput, city: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Province"
                        fullWidth
                        value={addressInput.province}
                        onChange={(e) => setAddressInput({...addressInput, province: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        fullWidth
                        value={addressInput.phone}
                        onChange={(e) => setAddressInput({...addressInput, phone: e.target.value})}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Checkbox
                                checked={addressInput.default}
                                onChange={(e) => setAddressInput({...addressInput, default: e.target.checked})}
                                color="primary"
                            />
                        }
                        label="Set as default address"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveAddress} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Voucher Dialog */}
            <Dialog 
                open={openVoucherDialog} 
                onClose={() => setOpenVoucherDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Select Voucher</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-4">
                        {Array.isArray(vouchers) && vouchers.map((voucher) => (
                            <div
                                key={voucher.id}
                                className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
                                onClick={() => handleApplyVoucher(voucher)}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium">{voucher.name}</p>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {voucher.code}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {voucher.description}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm text-blue-600">
                                        Discount: {voucher.discount_amount}
                                        {voucher.discount_type === 'percent' ? '%' : '$'}
                                        {voucher.max_discount_amount ? ` (Max: $${voucher.max_discount_amount})` : ''}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Min order: ${voucher.minimum_order_amount}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    Valid until: {new Date(voucher.valid_to).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {(!Array.isArray(vouchers) || vouchers.length === 0) && (
                            <p className="text-center text-gray-500">No vouchers available</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVoucherDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}