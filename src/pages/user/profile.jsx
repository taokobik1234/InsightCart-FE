import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControlLabel, Radio, RadioGroup, FormLabel, Box, Typography, Alert, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Paper, Divider } from '@mui/material';
import ImageUpload from '../../components/user/ImageUpload';
import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/userslice';

export default function Profile() {
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userAuth = useSelector(state => state.auth.user)
  const user = useSelector(state => state.user.user)
  const user_media = useSelector(state => state.user.user_media)
  const [userInput, setUserInput] = useState({ name: user.name, email: user.email })
  const [successMessage, setSuccessMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressInput, setAddressInput] = useState({
    street: '',
    district: '',
    city: '',
    province: '',
    phone: '',
    default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`http://tancatest.me/api/v1/users/${userAuth.id}`, {
        headers: {
          "Authorization": `Bearer ${userAuth.token.AccessToken}`,
          "x-client-id": userAuth.id,
          "session-id": userAuth.session_id,
        },
      });
      const data = await response.json();
      if (data.error_code === 0) {
        setAddresses(data.data.addressess || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
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
        setSuccessMessage(selectedAddress ? "Address updated successfully!" : "Address added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleSave = async () => {
    try {
      const requestBody = {
        name: userInput.name,
        email: userInput.email,
        ...(user_media?.[0]?.id && { media_id: user_media[0].id }),
      };

      const response = await fetch("http://tancatest.me/api/v1/users", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${userAuth.token.AccessToken}`,
          "x-client-id": userAuth.id,
          "session-id": userAuth.session_id,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to Update User. Please try again.");
      }

      const result = await response.json();
      console.log("Update result:", result);
      dispatch(setUser(result.data));
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      width={isNonMobileScreens ? "50%" : "93%"}
      p="2rem"
      m="2rem auto"
      borderRadius="1.5rem"
      backgroundColor={"#fff"} 
      mt={"100px"}>
      <Box mr={"2rem"} width="100%">
        {successMessage && (
          <Box
            sx={{
              position: "fixed",
              top: "100px",
              right: "20px",
              zIndex: 1000,
              minWidth: "250px",
            }}
          >
            <Alert severity="success" variant="filled">
              {successMessage}
            </Alert>
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          My profile
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Name"
          defaultValue={userInput.name}
          onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          defaultValue={userInput.email}
          onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Phone Number"
          defaultValue="*******41"
        />
        <FormLabel component="legend">Giới tính</FormLabel>
        <RadioGroup row>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <TextField
          margin="normal"
          fullWidth
          type="date"
          label="Ngày sinh"
          defaultValue="2024-10-30"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>

        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              My Addresses
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddressDialog()}
              size="small"
            >
              Add New Address
            </Button>
          </Box>
          <Divider />
          <List sx={{ width: '100%' }}>
            {addresses.map((address) => (
              <Paper 
                key={address.id} 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  borderRadius: 2,
                  border: address.default ? '2px solid #1976d2' : 'none'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {`${address.street}, ${address.district}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${address.city}, ${address.province}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`Phone: ${address.phone}`}
                    </Typography>
                    {address.default && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        Default Address
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleAddressDialog(address)}
                  >
                    Edit
                  </Button>
                </Box>
              </Paper>
            ))}
          </List>
        </Box>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
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
      </Box>
      <ImageUpload avatar={user.avatar ? user.avatar : ""} user={userAuth} />
    </Box>
  );
}