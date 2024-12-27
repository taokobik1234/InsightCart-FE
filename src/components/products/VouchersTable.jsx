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
} from "@mui/material";

const VouchersTable = ({ vouchers }) => {
    const [openDelete, setOpenDelete] = useState(false);

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
                        {vouchers &&
                            vouchers
                                .filter((voucher) => voucher) // Filter out undefined or null values
                                .map((voucher, index) => (
                                    <TableRow key={voucher.id || index}>
                                        <Tooltip title={voucher.name || "N/A"} arrow>
                                            <TableCell align="center">{voucher.name || "N/A"}</TableCell>
                                        </Tooltip>
                                        <Tooltip title={voucher.code || "N/A"} arrow>
                                            <TableCell align="center">{voucher.code || "N/A"}</TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`${voucher.discount_amount || 0}%`}
                                            arrow
                                        >
                                            <TableCell align="center">
                                                {voucher.discount_amount || "N/A"}
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={
                                                voucher.minimum_order_amount !== undefined
                                                    ? voucher.minimum_order_amount
                                                    : "N/A"
                                            }
                                            arrow
                                        >
                                            <TableCell align="center">
                                                {voucher.minimum_order_amount || "N/A"}
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={
                                                voucher.max_discount_amount !== undefined
                                                    ? voucher.max_discount_amount
                                                    : "N/A"
                                            }
                                            arrow
                                        >
                                            <TableCell align="center">
                                                {voucher.max_discount_amount || "N/A"}
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip title={voucher.usage_limit || "N/A"} arrow>
                                            <TableCell align="center">{voucher.usage_limit || "N/A"}</TableCell>
                                        </Tooltip>
                                        <Tooltip title={voucher.valid_from || "N/A"} arrow>
                                            <TableCell align="center">{voucher.valid_from || "N/A"}</TableCell>
                                        </Tooltip>
                                        <Tooltip title={voucher.valid_to || "N/A"} arrow>
                                            <TableCell align="center">{voucher.valid_to || "N/A"}</TableCell>
                                        </Tooltip>
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
