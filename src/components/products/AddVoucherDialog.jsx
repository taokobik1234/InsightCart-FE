import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    Box,
    Alert,
} from "@mui/material";

const AddEditVoucherDialog = ({
    open,
    handleClose,
    title,
    user,
    shop,
}) => {
    const [formData, setFormData] = useState({
        applicable_category_ids: [],
        applicable_product_ids: [],
        code: "",
        description: "",
        discount_amount: 0,
        discount_type: "percent",
        max_discount_amount: 0,
        minimum_order_amount: 0,
        name: "",
        shop_ids: [shop?.id || ""],
        usage_limit: 1,
        valid_from: "",
        valid_to: "",
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState({ type: "", message: "" });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://tancatest.me/api/v1/categories", {
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                setCategories(data.data.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products?shop_id=${shop.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "session-id": user.session_id,
                            Authorization: `Bearer ${user.token.AccessToken}`,
                            "x-client-id": user.id,
                        },
                    }
                );
                const data = await response.json();
                setProducts(data.data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (shop) {
            fetchCategories();
            fetchProducts();
        }
    }, [shop, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        };

        const payload = {
            ...formData,
            discount_amount: Number(formData.discount_amount),
            minimum_order_amount: Number(formData.minimum_order_amount),
            max_discount_amount: Number(formData.max_discount_amount),
            usage_limit: Number(formData.usage_limit),
            valid_from: formatDate(formData.valid_from),
            valid_to: formatDate(formData.valid_to),
        };
        try {
            const response = await fetch("http://tancatest.me/api/v1/vouchers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "session-id": user.session_id,
                    Authorization: `Bearer ${user.token.AccessToken}`,
                    "x-client-id": user.id,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.message === "Success") {
                setMessage({ type: "success", message: "Voucher created successfully!" });
                handleClose();
            } else {
                setMessage({ type: "error", message: data.message || "Error creating voucher." });
            }
        } catch (error) {
            setMessage({ type: "error", message: "An error occurred while creating the voucher." });
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {message.message && (
                    <Box sx={{ mb: 2 }}>
                        <Alert severity={message.type} variant="filled">
                            {message.message}
                        </Alert>
                    </Box>
                )}
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            label="Voucher Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Discount Amount"
                            name="discount_amount"
                            type="number"
                            value={formData.discount_amount}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {formData.discount_type === "percentage" ? "%" : "₫"}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Discount Type"
                            name="discount_type"
                            select
                            value={formData.discount_type}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="percent">Percentage</MenuItem>
                            <MenuItem value="fixed">Fixed</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Max Discount Amount"
                            name="max_discount_amount"
                            type="number"
                            value={formData.max_discount_amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Minimum Order Amount"
                            name="minimum_order_amount"
                            type="number"
                            value={formData.minimum_order_amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Valid From"
                            name="valid_from"
                            type="datetime-local"
                            value={formData.valid_from}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Valid To"
                            name="valid_to"
                            type="datetime-local"
                            value={formData.valid_to}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Usage Limit"
                            name="usage_limit"
                            type="number"
                            value={formData.usage_limit}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Applicable Categories"
                            name="applicable_category_ids"
                            select
                            SelectProps={{
                                multiple: true,
                            }}
                            value={formData.applicable_category_ids}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    applicable_category_ids: e.target.value,
                                }))
                            }
                            fullWidth
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Applicable Products"
                            name="applicable_product_ids"
                            select
                            SelectProps={{
                                multiple: true,
                            }}
                            value={formData.applicable_product_ids}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    applicable_product_ids: e.target.value,
                                }))
                            }
                            fullWidth
                        >
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEditVoucherDialog;
