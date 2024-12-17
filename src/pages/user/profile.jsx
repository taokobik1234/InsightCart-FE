import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Radio, RadioGroup, FormLabel, Box, Typography, Alert } from '@mui/material';
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

      // Clear success message after 3 seconds
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
      backgroundColor={"#fff"} mt={"100px"}>
      <Box mr={"2rem"}>
        {successMessage && (
          <Box
            sx={{
              position: "fixed",
              top: "100px",
              right: "20px",
              zIndex: 1000, // Ensures it is above other components
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
          <FormControlLabel value="female" control={<Radio />} label="Femal" />
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
      </Box>
      <ImageUpload avatar={user.avatar ? user.avatar : ""} user={userAuth} />
    </Box>
  );
}


