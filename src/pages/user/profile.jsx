import React from 'react';
import { TextField, Button, FormControlLabel, Radio, RadioGroup, FormLabel, Box, Typography } from '@mui/material';
import ImageUpload from '../../components/user/ImageUpload';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
export default function Profile() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector(state => state.auth.user)
  console.log(user);
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
        <Typography variant="h6" gutterBottom>
          My profile
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Tên"
          defaultValue={user.username}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          defaultValue={user.email}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Số điện thoại"
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
        >
          Lưu
        </Button>
      </Box>
      <ImageUpload />
    </Box>
  );
}


