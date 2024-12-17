import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import {    Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import DotLoader from '../../components/ui/DotLoader';  
import * as yup from "yup";
import { useNavigate } from "react-router-dom"; 
import React, { useState, useEffect } from 'react'; 
import 'leaflet/dist/leaflet.css'; 
import { setShop } from '../../store/shopSlice';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 
const CreateShopSchema = yup.object().shape({
  name: yup.string().required("required"),
  phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').required("required"),
  street: yup.string().required("required"),
  city: yup.string().required("required"), 
});

const initialValuesSignUp = {
  name: "",
  phone: "",
  city: "",
  street: "",
  district: "",  
};
export default function ViewShop() { 
  const {user} = useSelector(state => state.auth)
  const { shop } = useSelector((state) => state.shop);
   
  const dispatch = useDispatch();
  const [isLoading,setIsLoading]= useState(true); 
  const navigate = useNavigate(); 
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [errorText, setErrorText] = useState(""); 
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [open, setOpen] = useState(false); 
//   const handleClickOpen = () => {
//     setOpen(true);
//   }; 
//   const handleClose = () => {
//     setOpen(false);
//   };  
//   const handleCreateShop = async (values, onSubmitProps) => {
//     setIsLoading(false)
//     try {
//       const API_URL = "http://tancatest.me/api/v1/shops"
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           'Content-Type': 'application/json',
//           'session-id': user.session_id,
//           'Authorization': `Bearer ${user.token.AccessToken}`,
//           'x-client-id': user.id
//         },
//         body: JSON.stringify({
//           name: values.name,
//           phone: values.phone,
//           city: values.city,             
//           street: values.street,
//           district: values.district,
          
//         }),
//       }).then(response => response.json());
//       if (response.message !== "Success") {
//         console.log(response);
//         setErrorText(response.message);
//       } else {
//         onSubmitProps.resetForm();  
         
//       }
//       console.log(response)
//     } catch (error) {
//       console.log(error);
//     }
//     fetchShop() 
//   }
//   const fetchShop = async () => {
//     try {
//       const shopId = await fetch(`http://tancatest.me/api/v1/shops/get-shop-id-by-user-id/${user.id}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'session-id': user.session_id,
//           'Authorization': `Bearer ${user.token.AccessToken}`,
//           'x-client-id': user.id
//         },
//       }).then(response => response.json())
//       .then(response => response.data)
//       const shop = await fetch(`http://tancatest.me/api/v1/shops/${shopId}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'session-id': user.session_id,
//           'Authorization': `Bearer ${user.token.AccessToken}`,
//           'x-client-id': user.id
//         },
//       }).then(response => response.json())
//       .then(response => response.data)
//       console.log(shop)
//       dispatch(setShop(shop)); 
//     } catch (error) {
//       console.log(error);
//     }
//     setIsLoading(true) 
//   }   
  if(!shop) 
  return (null)
  if(shop.is_verified === false) 
  return (
    <Box
   display="flex"
   justifyContent="center"
   alignItems="center"
   height="80vh"  
   bgcolor="#f9f9f9"  
 >
   <Box
     width={isNonMobileScreens ? "50%" : "93%"}
     p="2rem"
     borderRadius="1.5rem"
     backgroundColor="#F0F0F0"
     textAlign="center"
   >
     <Typography
       fontWeight="800"
       variant="h4"
       sx={{ mb: "20px" }}
       fontFamily="bold"
     >
       
        Your shop is awaiting approval ... 
         
     </Typography>
     <Box
       display="flex"
       justifyContent="center"
       gap="40px"
       flexDirection="row"
       mt="2rem"
     >
       <Button
         onClick={() => navigate("/auth/sign-in")}
         sx={{
           p: "1rem 2rem",
           backgroundColor: "#00D5FA",
           color: "#FFFFFF",
           fontWeight: "600",
         }}
       >
         Return
       </Button>
     </Box>
   </Box>
 </Box>
 
  )  
  return(
     <Box> 
     //viewshop ....
     </Box> 
  ) 
}
 
 


 
  
   
    
     
      
       
        
 