import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Card,
    Box,
} from "@mui/material";

const VouchersTable = ({ vouchers }) => {
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState(null);


    return (
        <>
            <TableContainer
                component={Card}
                sx={{
                    width: "120%",
                }}
            >
                <Table sx={{ tableLayout: "auto", minWidth: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            {[
                                "Name",
                                "Code",
                                "Discount",
                                "Minimum Order",
                                "Max Discount",
                                "Usage Limit",
                                "Valid From",
                                "Valid To",
                                "Action",
                            ].map((head) => (
                                <Tooltip title={head} key={head} arrow>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "white",
                                            fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size for readability
                                            padding: { xs: "6px", sm: "8px" }, // Add more padding
                                            overflow: "visible", // Allow content to expand
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {head}
                                    </TableCell>
                                </Tooltip>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vouchers.map((voucher, index) => (
                            <TableRow key={voucher.id}>
                                <Tooltip title={voucher.name} arrow>
                                    <TableCell align="center">{voucher.name}</TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.code} arrow>
                                    <TableCell align="center">{voucher.code}</TableCell>
                                </Tooltip>
                                <Tooltip title={`${voucher.discount_amount}%`} arrow>
                                    <TableCell align="center">{voucher.discount_amount}</TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.minimum_order_amount} arrow>
                                    <TableCell align="center">
                                        {voucher.minimum_order_amount}
                                    </TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.max_discount_amount} arrow>
                                    <TableCell align="center">
                                        {voucher.max_discount_amount}
                                    </TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.usage_limit} arrow>
                                    <TableCell align="center">{voucher.usage_limit}</TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.valid_from} arrow>
                                    <TableCell align="center">{voucher.valid_from}</TableCell>
                                </Tooltip>
                                <Tooltip title={voucher.valid_to} arrow>
                                    <TableCell align="center">{voucher.valid_to}</TableCell>
                                </Tooltip>
                                <TableCell align="center">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Button
                                            variant="text"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                // Handle edit voucher logic here
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                setOpenDelete(true);
                                                setId(voucher.id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Delete Voucher</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this voucher?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => { }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VouchersTable;
