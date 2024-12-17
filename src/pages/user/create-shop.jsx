import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import DotLoader from '../../components/ui/DotLoader'; 
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom"; 
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
export default function CreateShop() { 
  const {user} = useSelector(state => state.auth)
  const { shop } = useSelector((state) => state.shop);
   
  const dispatch = useDispatch();
  const [isLoading,setIsLoading]= useState(true); 
  const navigate = useNavigate(); 
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [errorText, setErrorText] = useState(""); 
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [open, setOpen] = useState(false); 
  const handleClickOpen = () => {
    setOpen(true);
  }; 
  const handleClose = () => {
    setOpen(false);
  };  
  const handleCreateShop = async (values, onSubmitProps) => {
    setIsLoading(false)
    try {
      const API_URL = "http://tancatest.me/api/v1/shops"
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'session-id': user.session_id,
          'Authorization': `Bearer ${user.token.AccessToken}`,
          'x-client-id': user.id
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          city: values.city,             
          street: values.street,
          district: values.district,
          
        }),
      }).then(response => response.json());
      if (response.message !== "Success") {
        console.log(response);
        setErrorText(response.message);
      } else {
        onSubmitProps.resetForm();  
         
      }
      console.log(response)
    } catch (error) {
      console.log(error);
    }
    fetchShop() 
  }
  const fetchShop = async () => {
    try {
      const shopId = await fetch(`http://tancatest.me/api/v1/shops/get-shop-id-by-user-id/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'session-id': user.session_id,
          'Authorization': `Bearer ${user.token.AccessToken}`,
          'x-client-id': user.id
        },
      }).then(response => response.json())
      .then(response => response.data)
      const shop = await fetch(`http://tancatest.me/api/v1/shops/${shopId}`, {
        headers: {
          'Content-Type': 'application/json',
          'session-id': user.session_id,
          'Authorization': `Bearer ${user.token.AccessToken}`,
          'x-client-id': user.id
        },
      }).then(response => response.json())
      .then(response => response.data)
      console.log(shop)
      dispatch(setShop(shop)); 
      setIsLoading(true) 
      navigate('/user/view-shop')  
    } catch (error) {
      console.log(error);
    }
     
  }  
  if(!isLoading) return(DotLoader())
  if(!shop) 
  return (
    <Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={"#F0F0F0"}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "20px" }}>
          Create Shop
        </Typography>
        {/* <Form /> */}
        <Box>

          <Formik
            onSubmit={handleCreateShop}
            initialValues={initialValuesSignUp}
            validationSchema={CreateShopSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  <TextField
                    label="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={Boolean(touched.name) && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone" 
                    error={Boolean(touched.phone) && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone} 
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Street" 
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.street }
                    name="street" 
                    error={Boolean(touched.street) && Boolean(errors.street)}
                    helperText={touched.street && errors.street}  
                    sx={{ gridColumn: "span 4" }}
                  />
                   <TextField
                    label="District" 
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.district }
                    name="district" 
                    sx={{ gridColumn: "span 4" }}
                  />
                   <TextField
                    label="City" 
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city }
                    name="city" 
                    error={Boolean(touched.city) && Boolean(errors.city)}
                    helperText={touched.city && errors.city}   
                    sx={{ gridColumn: "span 4" }}
                  />  
                  {errorText && <Box sx={{ gridColumn: "span 4" }}>
                    <Typography color="red" >{errorText}</Typography>
                  </Box>}
                </Box>
                <Box>
                <Typography
                    onClick={() => {
                      handleClickOpen() 
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: "#00D5FA",
                      "&:hover": {
                        cursor: "pointer",
                        color: "#E6FBFF",
                      },
                    }}
                  >
                    "Choose address from the maps"
                  </Typography>
                  <Button
                    fullWidth
                    type="submit"
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      backgroundColor: "#00D5FA",
                      color: "#FFFFFF",
                      "&:hover": { Opacity: 0.5 },
                    }}
                  >
                    Create Shop
                  </Button>
                  
                </Box>
                <Dialog open={open} onClose={handleClose}   maxWidth="xl" fullWidth>
        <DialogTitle>Map</DialogTitle>
        <DialogContent>
            <MapComponent setFieldValue={setFieldValue}  />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
                      handleClose() ;  
                    }} 
                     color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>  
              </form>
            )}
          </Formik>
        </Box>
      </Box>
      
                
    </Box>
  )
  if(shop) return (null) 
}
// src/MapComponent.js
 

// Fixing default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = (   {setFieldValue} ) => {
  const [position, setPosition] = useState(); 
  const [address, setAddress] = useState('');
  const [isLoading,setIsLoading]= useState(false);
  // Use effect to get user's current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          fetchAddress({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error fetching current location:", err);
          // Set to a default location or show an error message
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );  
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Custom component to update the map's center
  const RecenterAutomatically = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, map.getZoom(), { animate: true });
    }, [position, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  const fetchAddress = async ({ lat, lng }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
  
      // Extract specific fields from the response
      const number = data.address.house_number || '';
      const street = data.address.road || '';
      const city = data.address.city || data.address.town || data.address.village || '';
      const district = data.address.suburb || data.address.neighbourhood || '';
  
      // Combine the fields into a single string address
      const formattedAddress = `${number} ${street}, ${district}, ${city}`;
  
      // Set the extracted fields in the component's state
      
      setFieldValue("street", street); 
      setFieldValue("district", district); 
      setFieldValue("city", city);    
      setAddress(formattedAddress);
     } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    }
    
    setIsLoading(true)  
  };
  

 
 
  if(isLoading===false) return(DotLoader())
  return (
    <div>
      
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '700px', width: '100%', marginTop: '20px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically position={position} />
        <LocationMarker />
      </MapContainer>
      <div style={{ marginTop: '20px' }}>
        <strong>Selected Address:</strong>
        <p>{address}</p>
      </div>
    </div>
  );
};

 
