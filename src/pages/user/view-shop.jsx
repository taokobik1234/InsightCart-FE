import {
  Alert,
  Box,
  Typography,
  useMediaQuery,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShop } from "../../store/shopSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DotLoader from "../../components/ui/DotLoader";
import { updateSourceFile } from "typescript";
const HeaderSection = ({ handleClickOpen, handleClickOpen2 }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mt={2}
    mb={2}
  >
    <Typography variant="h5" component="div">
      Products
    </Typography>
    <Box>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginRight: 1 }}
        onClick={handleClickOpen2}
      >
        Shop Detail
      </Button>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Product
      </Button>
    </Box>
  </Box>
);

const ProductsTable = ({ products ,setProducts, user, categories}) => { 
  const[openEddit,setopenEdit] = useState(false)  
  const[openDelete,setopenDelete] = useState(false) 
  const[id,setId] = useState(null) 
  const DeleteProducts = async () => {
    try {
      const res = await fetch("http://tancatest.me/api/v1/shops/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "session-id": user.session_id,
          Authorization: `Bearer ${user.token.AccessToken}`,
          "x-client-id": user.id,
        },
        body: JSON.stringify({ "ids": [id] }),  
      }) 
        .then((res) => res.json())
        .then((res) => res.data); 
      setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
      setopenDelete(false);
    } catch (error) {
      console.error(error);
    }
  };   
   return(
    <Box> 
   <TableContainer component={Card}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#1976d2" }}>
          {[
            "ID",
            "Name",
            "Category",
            "Price",
            "Stock level",
            "Reorder quantity",
            "Reorder level",
            "Action",
          ].map((head) => (
            <TableCell
              key={head}
              sx={{ fontWeight: "bold", color: "white" }}
              align="center"
            >
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {!products? null :products.map((product) => (
          <TableRow key={product.id}  >
            <TableCell align="center">{product.id}</TableCell>
            <TableCell align="center">{product.name}</TableCell>
            <TableCell align="center">{product.category_objects[0].name}</TableCell>
            <TableCell align="center">{product.price}</TableCell>
            <TableCell align="center">{product.inventory_object.stock_level}</TableCell>
            <TableCell align="center">{product.inventory_object.stock_level}</TableCell>
            <TableCell align="center">{product.inventory_object.stock_level}</TableCell>
            <TableCell align="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="text" color="primary" size="small"onClick={() => {
                  setopenEdit(true);
                  setId(product.id);
                }}>
                  Edit
                </Button>
                <Button variant="text" color="error" size="small" onClick={() => {
            setopenDelete(true);
            setId(product.id);
          }}>
                  Delete
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table> 
   </TableContainer>
   <Dialog open={openDelete} onClose={() => setopenDelete(false)}
 fullWidth maxWidth="md">
    <DialogTitle>Product Delete</DialogTitle>
    <DialogContent></DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          setopenDelete(false); 
        }}
        color="secondary"
      >
        Cancel
      </Button>
      <Button 
        variant="contained"
        color="primary"
        onClick={() => {
          DeleteProducts(); 
        }} 
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>   
  <AddEditProductDialog open={openEddit} categories={categories}
        user={user} handleClose={() => setopenEdit(false)} title={"Edit Product"} product_id={id}></AddEditProductDialog> 
  </Box>  
);
} 
const ImageUpload= ({ onUpload, onFileNameChange, user, url }) => {
  const [previewUrls, setPreviewUrls] = useState(url ? [url] : []);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update previews
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
      setError(null);

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file)); 

      try {
        const response = await fetch("http://tancatest.me/api/v1/media", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
            "session-id": user.session_id,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload images. Please try again.");
        }

        const result = await response.json();
        console.log("Upload result:", result);

        // Pass uploaded data and filenames to parent
        onUpload(result.data);
        const fileNames = files.map((file) => file.name);
        onFileNameChange(fileNames);
      } catch (error) {
        console.error("Upload error:", error);
        setError(error.message);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center" width="100%">
      <Button variant="outlined" component="label">
        Upload Images
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mt={2}>
        {previewUrls.map((url, index) => (
          <Box
            key={index}
            component="img"
            src={url}
            alt={`Preview ${index + 1}`}
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 1,
              border: "1px solid #ddd",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
const AddEditProductDialog = ({ open, handleClose, categories, user ,title, product_id}) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formData, setFormData] = useState({
    category_ids: "",
    media_ids: "",
    name: "",
    price: "",
    reorder_level: 0,
    reorder_quantity: 0,
    stock_level: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          : value,
    }));
  };

  const handleSubmit = () => {
    const numericPrice = formData.price.replace(/\./g, "");
    const dataToSubmit = { ...formData, price: parseInt(numericPrice, 10) };
    console.log("Submitted Data:", dataToSubmit);
    if(title == "Add Product" )createProduct();
    else updateProduct();
  };
  const updateProduct = async () => {
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/products/update `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
          body: JSON.stringify({
            id: product_id, 
            name: formData.name,
            price: formData.price,
            reorder_level: formData.reorder_level,
            reorder_quantity: formData.reorder_quantity,
            stock_level: formData.stock_level,
            media_ids: formData.media_ids,
            category_ids: formData.category_ids,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => response.data);

      handleClose();
    } catch (error) {
      console.log(error);
    }
  }; 

  const createProduct = async () => {
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/create-product `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            reorder_level: formData.reorder_level,
            reorder_quantity: formData.reorder_quantity,
            stock_level: formData.stock_level,
            media_ids: formData.media_ids,
            category_ids: formData.category_ids,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => response.data);

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle> {title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                select
                label="Category"
                name="category_ids"
                value={formData.category_ids}
                onChange={handleChange}
                sx={{ mt: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Media ID"
                name="media_ids"
                value={selectedFileName || formData.media_ids}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">₫</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Reorder Level"
                name="reorder_level"
                type="number"
                value={formData.reorder_level}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Reorder Quantity"
                name="reorder_quantity"
                type="number"
                value={formData.reorder_quantity}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Stock Level"
                name="stock_level"
                type="number"
                value={formData.stock_level}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <ImageUpload
              onUpload={(mediaId) =>
                handleChange({ target: { name: "media_ids", value: mediaId } })
              }
              onFileNameChange={(fileName) => setSelectedFileName(fileName)}
              user={user}
              url={null}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ViewShopDialog = ({
  open,
  handleClose,
  handleSubmit,
  user,
  shop,
  handleOpen,
}) => {
  const [userInput, setUserInput] = useState({
    name: shop.name,
    phone: shop.phone,
    city: shop.address.city,
    street: shop.address.street,
    district: shop.address.district,
    media_ids: shop.avatar_obj.url,
  });
  useEffect(() => {
    if (!open) {
      setUserInput({
        name: shop.name,
        phone: shop.phone,
        city: shop.address.city,
        street: shop.address.street,
        district: shop.address.district,
        media_ids: shop.avatar_obj.url,
      });
    }
  }, [open, shop]); 
  const [selectedFileName, setSelectedFileName] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DeleteShop = async () => {
    try {
      const res = await fetch("http://tancatest.me/api/v1/shops", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "session-id": user.session_id,
          Authorization: `Bearer ${user.token.AccessToken}`,
          "x-client-id": user.id,
        },
      })
        .then((res) => res.json())
        .then((res) => res.data);
      dispatch(setShop(null));
      setOpenDelete(false);
      navigate("/user/create-shop") 
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Shop Detail</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={userInput.name}
                  onChange={(e) =>
                    setUserInput({ ...userInput, name: e.target.value })
                  }
                  fullWidth
                  sx={{ mt: 2 }}
                />

                <TextField
                  label="Phone"
                  name="phone"
                  value={userInput.phone}
                  onChange={(e) =>
                    setUserInput({ ...userInput, phone: e.target.value })
                  }
                  fullWidth
                />

                <TextField
                  label="City"
                  name="city"
                  value={userInput.city}
                  onChange={(e) =>
                    setUserInput({ ...userInput, city: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="District"
                  name="district"
                  value={userInput.district}
                  onChange={(e) =>
                    setUserInput({ ...userInput, district: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Street"
                  name="street"
                  value={userInput.street}
                  onChange={(e) =>
                    setUserInput({ ...userInput, street: e.target.value })
                  }
                  fullWidth
                />
                <Typography
                  onClick={() => {
                    setMapOpen(true);
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
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ImageUpload
                onUpload={(mediaId) =>
                  setUserInput({
                    target: { name: "media_ids", value: mediaId },
                  })
                }
                onFileNameChange={(fileName) => setSelectedFileName(fileName)}
                user={user}
                url={shop.avatar_obj.url}
              />
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            mb={2}
          >
            <Button
              onClick={() => {
                setOpenDelete(true);
                handleClose();
              }}
              variant="contained"
              color="error"
            >
              Delete Shop
            </Button>
            <Box>
              <Button onClick={handleClose} color="info">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Shop Delete</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDelete(false);
              handleOpen();
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              DeleteShop();
            }}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={mapOpen}
        onClose={() => {
          setMapOpen(false);
          handleOpen();
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Map</DialogTitle>
        <DialogContent>
          <MapComponent setFieldValue={setUserInput} userInput={userInput} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMapOpen(false);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ setFieldValue, userInput }) => {
  const [position, setPosition] = useState();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    return position === null ? null : <Marker position={position}></Marker>;
  };

  const fetchAddress = async ({ lat, lng }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();

      // Extract specific fields from the response
      const number = data.address.house_number || "";
      const street = data.address.road || "";
      const city =
        data.address.city || data.address.town || data.address.village || "";
      const district = data.address.suburb || data.address.neighbourhood || "";

      // Combine the fields into a single string address
      const formattedAddress = `${number} ${street}, ${district}, ${city}`;

      // Set the extracted fields in the component's state

      setFieldValue({
        ...userInput,
        street,
        district,
        city,
      });
      setAddress(formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }

    setIsLoading(true);
  };

  if (isLoading === false) return DotLoader();
  return (
    <div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "700px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically position={position} />
        <LocationMarker />
      </MapContainer>
      <div style={{ marginTop: "20px" }}>
        <strong>Selected Address:</strong>
        <p>{address}</p>
      </div>
    </div>
  );
};

const WaitApprovrMessege = ({ isNonMobileScreens, navigate }) => (
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
);
export default function ViewYourShop() {
  const { user } = useSelector((state) => state.auth);
  const { shop } = useSelector((state) => state.shop);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [categories, setCategories] = useState([]);
  const [products, setproducts] = useState([]); 
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const cates = await fetch("http://tancatest.me/api/v1/categories ", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => res.data); 
      setCategories(cates.categories);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchCategories();
    fetchProduct(); 
  }, [shop]);

 
  const fetchProduct = async () => {
    if (!shop) return null; 
    console.log (shop.id)
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/products?shop_id=671cb859fb04eff50015bf06 `,
        { 
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          }, 
        }
      )
        .then((response) => response.json())
        .then((response) => response.data);
      console.log("Content-Type",response.products)   
      setproducts(response.products)  
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
   
  if (!shop) return null;
  if (shop.is_verified === true)
    return (
      <WaitApprovrMessege
        isNonMobileScreens={isNonMobileScreens}
        navigate={navigate}
      ></WaitApprovrMessege>
    );
  return (
    <Container
      display="flex"
      width={isNonMobileScreens ? "50%" : "100%"}
      p="2rem"
      m="2rem auto"
      mt="100px"
    >
      <HeaderSection
        handleClickOpen={() => setOpen(true)}
        handleClickOpen2={() => setOpen2(true)}
      />
      <ProductsTable products={products} setProducts={setproducts} user={user} categories={categories} ></ProductsTable>
      <AddEditProductDialog
        open={open}
        title = "Add Product" 
        handleClose={() => setOpen(false)}
        categories={categories}
        user={user}
      />
      <ViewShopDialog
        shop={shop}
        open={open2}
        handleClose={() => setOpen2(false)}
        handleOpen={() => setOpen2(true)}
        user={user}
      />
    </Container>
  );
}
