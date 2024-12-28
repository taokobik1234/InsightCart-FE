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
  Tab,
  Tabs,
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
  Select,
  FormControl,
  InputLabel,
  Switch,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddEditVoucherDialog from "../../components/products/AddVoucherDialog";
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
import VouchersTable from "../../components/products/VouchersTable";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Legend);

const HeaderSection = ({ handleClickOpen, handleClickOpen2, title, button1, button2 }) => (
  <Box
    display="flex"
    width="100%"
    m="2rem auto"
    justifyContent="space-between"
    alignItems="center"
    mt={2}
    mb={2}
  >
    <Typography variant="h5" component="div">
      {title}
    </Typography>
    <Box>
      {button1 && <Button
        variant="outlined"
        color="secondary"
        sx={{ marginRight: 1 }}
        onClick={handleClickOpen2}
      >
        {button1}
      </Button>}
      {button2 && <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {button2}
      </Button>}
    </Box>
  </Box>
);


const ProductsTable = ({
  products,
  setProducts,
  user,
  categories,
  setEdit,
  setEditProductId,
  setEditProduct,
  page
}) => {
  const [openDelete, setopenDelete] = useState(false);
  const [id, setId] = useState(null);
  const DeleteProducts = async () => {
    try {
      const res = await fetch("http://tancatest.me/api/v1/shops/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "session-id": user.session_id,
          Authorization: `Bearer ${user.token.AccessToken}`,
          "x-client-id": user.id,
        },

        body: JSON.stringify({ ids: [id] }),
      })
        .then((res) => res.json())
        .then((res) => res.data);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      ); 
      setopenDelete(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <TableContainer
        component={Card}
        sx={{
          width: "100%",
        }}
      >
        <Table sx={{ tableLayout: "fixed" }}>
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
                <Tooltip title={head} key={head} arrow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: { xs: "0.7rem", sm: "0.9rem" },
                      padding: { xs: "4px", sm: "6px" },
                      maxWidth: "150px", // Limit max width for name column
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Adds an ellipsis if text overflows
                      whiteSpace: "nowrap", // Prevents text from wrapping to next line
                    }}
                  >
                    {head}
                  </TableCell>
                </Tooltip>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!products
              ? null
              : products.slice(( page-1 )* 10 , page * 10   ).map((product, index) => (
                <TableRow key={product.id}>
                  <Tooltip title={product?.id} arrow>
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {(page - 1) * 10 + index + 1}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={product.name} arrow>
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={product.category_objects[0].name} arrow>
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.category_objects[0].name}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={product.price} arrow>
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.price}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={product.inventory_object.stock_level} arrow>
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.inventory_object.stock_level}
                    </TableCell>
                  </Tooltip>
                  <Tooltip
                    title={product.inventory_object.reorder_quantity}
                    arrow
                  >
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.inventory_object.reorder_quantity}
                    </TableCell>
                  </Tooltip>
                  <Tooltip
                    title={product.inventory_object.reorder_level}
                    arrow
                  >
                    <TableCell
                      align="center"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {product.inventory_object.reorder_level}
                    </TableCell>
                  </Tooltip>

                  <TableCell align="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setEdit(true);
                          setEditProductId(product.id);
                          setEditProduct(product);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => {
                          setopenDelete(true);
                          setId(product.id);
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
      <Dialog
        open={openDelete}
        onClose={() => setopenDelete(false)}
        fullWidth
        maxWidth="md"
      >

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
    </>
  );
};
const ImageUpload = ({ onUpload, onFileNameChange, user, url }) => {
  const [previewUrls, setPreviewUrls] = useState(url ? url : []);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update previews
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
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

        const ids = result.data.map((item) => item.id);
        onUpload(ids);
        const fileNames = files.map((file) => file.name);
        onFileNameChange(fileNames);
      } catch (error) {
        console.error("Upload error:", error);
        setError(error.message);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      width="100%"
    >
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

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        mt={2}
      >
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

const AddEditProductDialog = ({
  open,
  handleClose,
  categories,
  user,
  title,
  product_id,
  setProducts,
  shop,
  product,setTotalpage,page
}) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formData, setFormData] = useState({
    category_ids: "",
    media_ids: "",
    name: "",
    price: "",
    reorder_level: 1,
    reorder_quantity: 1,
    stock_level: 1,
  });
  const [message, setMessage] = useState({ type: "", message: "" });
  const [waitting, setWaitting] = useState(false);
  useEffect(() => {
    if (product) {
      setSelectedFileName("");
      setFormData({
        category_ids: product?.category_objects?.[0]?.id || "",
        media_ids: product?.avatar?.map((item) => item.media_id) || "",
        name: product?.name || "",
        price: product?.price || "",
        reorder_level: product?.inventory_object?.reorder_level || 1,
        reorder_quantity: product?.inventory_object?.reorder_quantity || 1,
        stock_level: product?.inventory_object?.stock_level || 1,
      });
    }
  }, [product]);
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
    setWaitting(true) 
    const requiredFields = [
      "media_ids",
      "category_ids",
      "name",
      "price",
      "reorder_level",
      "reorder_quantity",
      "stock_level",
    ];
    const missingFields = requiredFields.filter(
      (key) => !formData[key] || Number(formData[key]) <= 0
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((key) =>
          key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        )
        .join(", ");
      setMessage({
        type: "warning",
        message: `The following fields are invalid or missing: ${missingFieldNames}.`,
      });
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (
      ["price", "reorder_level", "reorder_quantity", "stock_level"].some(
        (key) => Number(formData[key]) <= 0
      )
    ) {
      setMessage({
        type: "warning",
        message:
          "Values for Price, Reorder Level, Reorder Quantity, and Stock Level must be greater than 0.",
      });
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (title == "Add Product") createProduct();
    else updateProduct();
  };
  const updateProduct = async () => {
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/products`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
          body: JSON.stringify({
            id: product_id,
            name: formData.name,
            price: parseInt(String(formData.price).replace(/\./g, ""), 10),
            reorder_level: parseInt(formData.reorder_level, 10),
            reorder_quantity: parseInt(formData.reorder_quantity, 10),
            stock_level: parseInt(formData.stock_level, 10),
            media_ids: formData.media_ids,
            category_ids: [formData.category_ids],
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => response.data);
        const newId =response.id 
        if (!shop) return null; 
        try {
        const response2 = await fetch(
          `http://tancatest.me/api/v1/shops/products?shop_id=${shop.id}&page=${page}&limit=10`,
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
          setProducts((prev) => {
            return prev.map((product) => { 
              const updatedProduct = response2.products.find((p) => p.id === newId); 
              return product.id === newId ? { ...product, ...updatedProduct } : product;
            });
          });
          
          
          
      } catch (error) {
        console.log(error);
      }   
      setWaitting(false) 
      handleClose()  
      
    } catch (error) {
      console.log(error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/products`,
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
            price: parseInt(String(formData.price).replace(/\./g, ""), 10),
            reorder_level: parseInt(formData.reorder_level, 10),
            reorder_quantity: parseInt(formData.reorder_quantity, 10),
            stock_level: parseInt(formData.stock_level, 10),
            media_ids: formData.media_ids,
            category_ids: [formData.category_ids],
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => response.data);
        const newId = response.ID
        if (!shop) return null; 
        try {
        const response2 = await fetch(
          `http://tancatest.me/api/v1/shops/products?shop_id=${shop.id}&page=1&limit=10`,
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
          setTotalpage(response2.meta.total_pages) 
          setProducts((prev) => { 
            const newProduct = response2.products.find(product => product.id === newId);
           
            return newProduct ? [newProduct, ...prev] : prev;
          });
      } catch (error) {
        console.log(error);
      } 
        setWaitting(false)
        handleClose(); 
     
    } catch (error) {
      console.log(error);
    }
     
  };

   
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
     {waitting ? (
          <DotLoader />
            ) : (
              <> 
       <DialogTitle> {title}</DialogTitle>
      <DialogContent>
       
            {message.message && (
              <Box
                sx={{
                  position: "fixed",
                  top: "100px",
                  right: "20px",
                  zIndex: 1000, // Ensures it is above other components
                  minWidth: "250px",
                }}
              >
                <Alert severity={message.type} variant="filled">
                  {message.message}
                </Alert>
              </Box>
            )}
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
                    label="Selected File Name  "
                    name="media_ids"
                    value={selectedFileName}
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
                  url={product?.avatar?.map((item) => item.url) || null}
                />
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
      </> 
      )} 
    </Dialog>
  );
};

const ViewShopDialog = ({ open, handleClose, user, shop, handleOpen }) => {
  const [userInput, setUserInput] = useState({
    name: shop.name,
    phone: shop.phone,
    city: shop.address.city,
    street: shop.address.street,
    district: shop.address.district,
    media_ids: shop.avatar_obj.url,
  });
  const [message, setMessage] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInput((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          : value,
    }));
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const handleSubmit = () => {
    const requiredFields = ["name", "phone", "city", "street", "district"];
    const missingFields = requiredFields.filter(
      (key) => !userInput[key] || Number(userInput[key]) <= 0
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((key) =>
          key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        )
        .join(", ");
      setMessage({
        type: "warning",
        message: `The following fields are invalid or missing: ${missingFieldNames}.`,
      });
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!phoneRegExp.test(userInput.phone)) {
      setMessage({ type: "warning", message: "Phone number is not valid." });
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    UpdateShop();
  };
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

      navigate("/user/create-shop");
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateShop = async () => {
    try {
      // Update shop details
      const updateResponse = await fetch("http://tancatest.me/api/v1/shops", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "session-id": user.session_id,
          Authorization: `Bearer ${user.token.AccessToken}`,
          "x-client-id": user.id,
        },
        body: JSON.stringify({
          name: userInput.name,
          phone: userInput.phone,
          city: userInput.city,
          street: userInput.street,
          district: userInput.district,

          ids: [shop.id],
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update shop details.");
      }

      const updateResult = await updateResponse.json(); 

      // Fetch shop details by ID
      const shopResponse = await fetch(
        `http://tancatest.me/api/v1/shops/${shop.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
        }
      );

      if (!shopResponse.ok) {
        throw new Error("Failed to fetch shop details.");
      }

      const shopResult = await shopResponse.json();
      const newshop = shopResult.data; 

      // Update Redux store
      dispatch(setShop(newshop));
      setMessage({
        type: "success",
        message: `Shop Updated.`,
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error during shop update process:", error.message);
    }
  };
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" /*maxWidth="md"*/
      >
        <DialogTitle>Shop Detail</DialogTitle>
        <DialogContent>
          {message.message && (
            <Box
              sx={{
                position: "fixed",
                top: "100px",
                right: "20px",
                zIndex: 1000, // Ensures it is above other components
                minWidth: "250px",
              }}
            >
              <Alert severity={message.type} variant="filled">
                {message.message}
              </Alert>
            </Box>
          )}
          {/* <Grid container spacing={3}> */}
          <Grid item xs={8}>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Name"
                name="name"
                value={userInput.name}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 2 }}
              />

              <TextField
                label="Phone"
                name="phone"
                value={userInput.phone}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="City"
                name="city"
                value={userInput.city}
                onChange={handleChange}
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
                onChange={handleChange}
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
          {/* <Grid 
              item
              xs={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <SingleImageUpload
                onUpload={(mediaId) =>
                  handleChange({
                    target: { name: "media_ids", value: mediaId },
                  })
                }
                onFileNameChange={(fileName) => setSelectedFileName(fileName)}
                user={user}
                url={shop.avatar_obj.url}
              />
            </Grid> */}
          {/* </Grid> */}
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
            color="primary"
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

const OrdersTable = ({ orders, user, updateOrderStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState({});

  const handleStatusChange = async (orderId, newStatus) => {
    setSelectedStatus(prev => ({ ...prev, [orderId]: newStatus }));
    updateOrderStatus(orderId, newStatus);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TableContainer component={Card} sx={{ width: "100%" }}>
      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            {[
              { label: "Order ID", width: "15%" },
              { label: "Customer Name", width: "10%" },
              { label: "Customer Email", width: "25%" },
              { label: "Products", width: "20%" },
              { label: "Total Amount", width: "10%" },
              { label: "Created At", width: "10%" },
              { label: "Status", width: "5%" },
              { label: "Action", width: "5%" },
            ].map((column) => (
              <TableCell
                key={column.label}
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: { xs: "0.7rem", sm: "0.9rem" },
                  padding: { xs: "4px", sm: "6px" },
                  width: column.width,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                {order.order_id}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                {order.user_name}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.8rem", wordBreak: "break-word" }}>
                {order.user_email}
              </TableCell>
              <TableCell align="left" sx={{ fontSize: "0.8rem" }}>
                {order.products.map((product, index) => (
                  <Box key={product.product_id} sx={{ mb: index !== order.products.length - 1 ? 1 : 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {product.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity} x ${product.price}
                    </Typography>
                  </Box>
                ))}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                ${order.total_price}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                {formatDate(order.created_at)}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                {selectedStatus[order.order_id] || order.status}
              </TableCell>
              <TableCell align="center">
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedStatus[order.order_id] || order.status}
                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipping">Shipping</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
            backgroundColor: "#3B82F6",
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
const Pagination = ({ totalPage, pageCount, setPageCount }) => {
  const getPageNumbers = () => {
    const maxVisible = 5;  
    const numbers = [];
    if (totalPage <= maxVisible) {
     
      for (let i = 1; i <= totalPage; i++) numbers.push(i);
    } else {
      if (pageCount <= 3) {
        numbers.push(1, "...");  
      } else if (pageCount >= totalPage - 2) {
        numbers.push("...", totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage); // Last pages
      } else {
        numbers.push("...", pageCount - 2, pageCount - 1, pageCount, pageCount + 1, pageCount + 2, "..."); // Centered around current page
      }
    }
    return numbers;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}> 
      <Button
        variant="outlined"
        onClick={() => setPageCount((prev) => Math.max(prev - 1, 1))}
        disabled={pageCount === 1}
        sx={{
          minWidth: "36px",
          height: "36px",
          marginX: "4px",
        }}
      >
        {"<"}
      </Button>

      {/* Page Numbers */}
      {getPageNumbers().map((number, index) => (
        <Button
          key={index}
          variant={number === pageCount ? "contained" : "outlined"}
          onClick={() => typeof number === "number" && setPageCount(number)}
          disabled={number === "..." || number === pageCount}
          sx={{
            minWidth: "36px",
            height: "36px",
            marginX: "4px",
          }}
        >
          {number}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outlined"
        onClick={() => setPageCount((prev) => Math.min(prev + 1, totalPage))}
        disabled={pageCount === totalPage}
        sx={{
          minWidth: "36px",
          height: "36px",
          marginX: "4px",
        }}
      >
        {">"}
      </Button>
    </Box>
  );
};

// Add ReportsSection component
const ReportsSection = ({ user }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPercentage, setShowPercentage] = useState({
    viewed: false,
    sold: false,
    trend: false
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://tancatest.me/api/v1/shops/report", {
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
        });
        const data = await response.json();
        setReportData(data.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  if (loading) return <DotLoader />;
  if (!reportData) return <Typography>No report data available</Typography>;

  const calculatePercentages = (data) => {
    const total = data.reduce((sum, item) => sum + item, 0);
    return data.map(value => ((value / total) * 100).toFixed(1));
  };

  const mostViewedData = {
    labels: reportData.most_viewed_products.map(product => product.name),
    datasets: [{
      data: showPercentage.viewed 
        ? calculatePercentages(reportData.most_viewed_products.map(product => product.viewed))
        : reportData.most_viewed_products.map(product => product.viewed),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
    }]
  };

  const mostSoldData = {
    labels: reportData.most_sold_products.map(product => product.name),
    datasets: [{
      data: showPercentage.sold
        ? calculatePercentages(reportData.most_sold_products.map(product => product.sold))
        : reportData.most_sold_products.map(product => product.sold),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
    }]
  };

  const viewTrendData = {
    labels: reportData.most_view_trend.map(product => product.name),
    datasets: [{
      data: showPercentage.trend
        ? calculatePercentages(reportData.most_view_trend.map(product => product.view_trend))
        : reportData.most_view_trend.map(product => product.view_trend),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#4DBECF',
        '#949FB1',
        '#FF99CC'
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value) => {
          return showPercentage.viewed || showPercentage.sold || showPercentage.trend 
            ? `${value}%` 
            : value;
        }
      }
    }
  };

  const ChartHeader = ({ title, type }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">{title}</Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" color="textSecondary" mr={1}>
          Amount
        </Typography>
        <Switch
          size="small"
          checked={showPercentage[type]}
          onChange={(e) => setShowPercentage(prev => ({
            ...prev,
            [type]: e.target.checked
          }))}
        />
        <Typography variant="body2" color="textSecondary" ml={1}>
          Percentage
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Shop Analytics</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <ChartHeader title="Most Viewed Products" type="viewed" />
            <Box sx={{ height: 300 }}>
              <Pie data={mostViewedData} options={chartOptions} plugins={[ChartDataLabels]} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <ChartHeader title="Most Sold Products" type="sold" />
            <Box sx={{ height: 300 }}>
              <Pie data={mostSoldData} options={chartOptions} plugins={[ChartDataLabels]} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <ChartHeader title="View Trend" type="trend" />
            <Box sx={{ height: 300 }}>
              <Pie data={viewTrendData} options={chartOptions} plugins={[ChartDataLabels]} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function ViewYourShop() {
  const { user } = useSelector((state) => state.auth);
  const { shop } = useSelector((state) => state.shop); 
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [categories, setCategories] = useState([]);
  const [products, setproducts] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editProduct, setEditProduct] = useState();
  const [editProductId, setEditProductId] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("pending");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [onFetch,setOnFetch] = useState(true);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Update UI immediately
    setSelectedStatus(prev => ({ ...prev, [orderId]: newStatus }));
    
    // Make API call in background
    try {
      await fetch(
        `http://tancatest.me/api/v1/order/shop/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      // Remove the order from the current list after successful status change
      if (newStatus !== selectedOrderStatus) {
        setOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
      }
      
    } catch (error) {
      console.error("Error updating order status:", error);
      // Revert UI if API call fails
      setSelectedStatus(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  const fetchOrders = async (status = selectedOrderStatus) => {
    if (!shop) return null;
    setIsLoadingOrders(true);
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/order/shop?status=${status}`,
        {
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log("Fetched orders:", data);
      
      const ordersList = data?.data || [];
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, isLocalUpdate = false) => {
    if (isLocalUpdate) {
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      return;
    }

    // If not a local update, fetch fresh data
    await fetchOrders(selectedOrderStatus);
  };
 
  const [pageCount,setPageCount] = useState(0);
  const [totalPage,setTotalpage] = useState();
  const [fetchPage,setFetchpage] = useState(1);  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Fetch orders when Orders tab (index 2) is selected
    if (newValue === 2) {
      fetchOrders();
    }
  };
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

  const fetchProduct = async () => {
    setOnFetch(true) 
    if (!shop) return null; 
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/shops/products?shop_id=${shop.id}&page=1&limit=10`,
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
      setproducts(response.products); 
      setTotalpage(response.meta.total_pages) 
      setOpen(false);
      setPageCount(1)
      setOnFetch(false)  
    } catch (error) {
      console.log(error);
    }
  }; 
  const fetchVoucher = async () => {
    if (!shop) return null;
    try {
      const response = await fetch(
        `http://tancatest.me/api/v1/vouchers?shop_id=${shop.id}  `,
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

      console.log("Voucher-Type", response.list);
      setVouchers(response.list);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchCategories();
    fetchProduct();
    fetchVoucher();
     fetchOrders();
  }, [shop, setVouchers]);
 
  useEffect(() => {
    if(onFetch) return
    setOnFetch(true) 
    const fetchProduct2 = async (page) => {
      if (!shop) return null; 
      try {
        const response = await fetch(
          `http://tancatest.me/api/v1/shops/products?shop_id=${shop.id}&page=${page}&limit=10`,
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
  
        setproducts((prev) => [...prev, ...response.products]); // Append products to the previous ones
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchNextPages = async () => {
      const totalPagesToFetch = Math.min(4, totalPage - fetchPage); // Ensure not fetching more than available pages
      for (let i = 1; i <= totalPagesToFetch; i++) {
        await fetchProduct2(fetchPage + i);
        setFetchpage((prev) => prev + 1);
  
      }
    };
  
    if (pageCount > 0 && fetchPage <= pageCount) {
      fetchNextPages()
      .then(() => {
      setOnFetch(false);  
    })
    .catch((error) => {
      console.error("Error fetching pages:", error);  
      setOnFetch(false);  
    });  
    } 
  }, [pageCount, fetchPage, shop, totalPage,]); 
  if (!shop) return null;
  if (shop.is_verified === false)
    return (
      <WaitApprovrMessege
        isNonMobileScreens={isNonMobileScreens}
        navigate={navigate}
      ></WaitApprovrMessege>
    );  
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      flexShrink={0}
      width={isNonMobileScreens ? "60%" : "100%"}
      m="2rem auto"
    >
      <Box
        display="flex"
        justifyContent="center"
        borderBottom={1}
        borderColor="divider"
        mb={2}
      >
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="View Shop" />
          <Tab label="View Vouchers" />
          <Tab label="Orders" />
          <Tab label="Reports" />
        </Tabs>
      </Box>
      {activeTab === 0 && (
        <Box>
          <HeaderSection
            handleClickOpen={() => setOpen(true)}
            handleClickOpen2={() => setOpen2(true)}
            title={"Products"}
            button1={"Shop Details"}
            button2={"Add Product"}
          />
          {products === undefined ?(
            <DotLoader></DotLoader>
          ) : (
            <ProductsTable
              page ={pageCount}
              products={products}
              setProducts={setproducts}
              user={user}
              categories={categories}
              setEdit={setEdit}
              setEditProduct={setEditProduct}
              setEditProductId={setEditProductId}
            ></ProductsTable>
          )}
       
            <Pagination pageCount={pageCount} setPageCount={setPageCount} totalPage={totalPage}></Pagination>
      
          <AddEditProductDialog
            open={open}
            setTotalpage ={setTotalpage}
            title="Add Product"
            handleClose={() => setOpen(false)}
            categories={categories}
            user={user}
            setProducts={setproducts}
            shop={shop}
          />
          <AddEditProductDialog
            open={edit}
            page={pageCount} 
            product={editProduct}
            product_id={editProductId}
            title="Edit Product"
            handleClose={() => setEdit(false)}
            categories={categories}
            user={user}
            setProducts={setproducts}
            shop={shop}
          />
          <ViewShopDialog
            shop={shop}
            open={open2}
            handleClose={() => setOpen2(false)}
            handleOpen={() => setOpen2(true)}
            user={user}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* View Voucher Content */}
          <HeaderSection
            handleClickOpen={() => setVoucherDialogOpen(true)}
            handleClickOpen2={() => setVoucherDialogOpen(true)}
            title={"Vouchers"}
            button1={""}
            button2={"Add Voucher"}
          />
          <AddEditVoucherDialog
            open={isVoucherDialogOpen}
            handleClose={() => setVoucherDialogOpen(false)}
            title={"Add Voucher"}
            setVouchers={setVouchers}
            shop={shop}
            user={user}
          />
          {vouchers?.length === 0 ? (
            <DotLoader></DotLoader>
          ) : (
            <VouchersTable vouchers={vouchers} />
          )
          }
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Shop Orders
          </Typography>
          <Box 
            display="flex" 
            gap={1} 
            mb={3}
          >
            {["pending", "processing", "shipping", "delivered", "canceled"].map((status) => (
              <Button
                key={status}
                variant={selectedOrderStatus === status ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedOrderStatus(status);
                  setOrders([]); // Clear current orders to show loading state
                  fetchOrders(status);
                }}
                sx={{
                  textTransform: 'capitalize',
                  borderRadius: '4px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.9rem',
                  backgroundColor: selectedOrderStatus === status ? '#1976d2' : 'transparent',
                  borderColor: '#1976d2',
                  color: selectedOrderStatus === status ? 'white' : '#1976d2',
                  '&:hover': {
                    backgroundColor: selectedOrderStatus === status ? '#1565c0' : 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                {status}
              </Button>
            ))}
          </Box>
          {isLoadingOrders ? (
            <DotLoader />
          ) : orders.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Typography variant="h6" color="textSecondary">
                No {selectedOrderStatus} orders found
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Card} sx={{ width: "100%", boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1976d2' }}>
                    <TableCell sx={{ 
                      width: '200px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '8px 16px',
                    }}>Order ID</TableCell>
                    <TableCell sx={{ 
                      width: '120px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Customer Name</TableCell>
                    <TableCell sx={{ 
                      width: '200px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Customer Email</TableCell>
                    <TableCell sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Products</TableCell>
                    <TableCell sx={{ 
                      width: '120px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Total Amount</TableCell>
                    <TableCell sx={{ 
                      width: '150px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Created At</TableCell>
                    <TableCell sx={{ 
                      width: '100px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Status</TableCell>
                    <TableCell sx={{ 
                      width: '120px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                    }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.order_id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '8px 16px',
                      }}>{order.order_id}</TableCell>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        padding: '8px 16px',
                      }}>{order.user_name}</TableCell>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        wordBreak: 'break-word',
                        padding: '8px 16px',
                      }}>{order.user_email}</TableCell>
                      <TableCell sx={{ padding: '8px 16px' }}>
                        {order.products.map((product, index) => (
                          <Box key={product.product_id} sx={{ mb: index !== order.products.length - 1 ? 1 : 0 }}>
                            <Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>
                              {product.product_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                              Quantity: {product.quantity} × ${product.price}
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        padding: '8px 16px',
                      }}>${order.total_price}</TableCell>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        padding: '8px 16px',
                      }}>{formatDate(order.created_at)}</TableCell>
                      <TableCell sx={{ 
                        fontSize: '0.85rem', 
                        color: '#333',
                        padding: '8px 16px',
                      }}>{selectedStatus[order.order_id] || order.status}</TableCell>
                      <TableCell sx={{ padding: '8px 16px' }}>
                        <Select
                          value={selectedStatus[order.order_id] || order.status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          size="small"
                          fullWidth
                          sx={{
                            fontSize: '0.85rem',
                            height: '32px',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                          }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="shipping">Shipping</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="canceled">Canceled</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {activeTab === 3 && (
        <ReportsSection user={user} />
      )}
    </Box>
  );
}
