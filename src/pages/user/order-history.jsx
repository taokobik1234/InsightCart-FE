import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('pending');
  const { user: authUser } = useSelector((state) => state.auth);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'canceled', label: 'Canceled' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipping: 'primary',
      delivered: 'success',
      canceled: 'error',
    };
    return colors[status] || 'default';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authUser?.id) return;

      try {
        const response = await fetch(`http://tancatest.me/api/v1/order?status=${status}`, {
          headers: {
            'Content-Type': 'application/json',
            'session-id': authUser.session_id,
            'Authorization': `Bearer ${authUser.token.AccessToken}`,
            'x-client-id': authUser.id
          }
        });
        const data = await response.json();
        if (data.data) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [authUser, status]);

  return (
    <Container maxWidth="lg" sx={{ py: 6, pl: { xs: 4, sm: 4, md: 4 }, pr: 4 }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: '#1a237e'
          }}
        >
          Order History
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={status}
            label="Filter by Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a237e',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a237e',
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Products</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.order_id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#f8f8f8',
                    transition: 'background-color 0.2s'
                  }
                }}
              >
                <TableCell sx={{ py: 2.5 }}>
                  <Typography variant="body2" sx={{ color: '#1a237e', fontWeight: 500 }}>
                    {order.order_id}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      minWidth: 90,
                      fontSize: '0.85rem'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Box component="ul" sx={{ 
                    listStyle: 'none',
                    m: 0,
                    p: 0
                  }}>
                    {order.products.map((product) => (
                      <Box 
                        component="li" 
                        key={product.product_id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 0.5,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Typography variant="body2">
                          {product.product_name}
                          <Typography 
                            component="span" 
                            variant="body2" 
                            sx={{ color: '#666', ml: 1 }}
                          >
                            (x{product.quantity})
                          </Typography>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a237e' }}>
                    ${order.total_price.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderHistory; 