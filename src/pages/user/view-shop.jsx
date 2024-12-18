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
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShop } from '../../store/shopSlice';

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

const ProductsTable = ({ products }) => (
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
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell align="center">{product.id}</TableCell>
            <TableCell align="center">{product.name}</TableCell>
            <TableCell align="center">{product.type}</TableCell>
            <TableCell align="center">{product.price}</TableCell>
            <TableCell align="center">{product.quantity}</TableCell>
            <TableCell align="center">{product.quantity}</TableCell>
            <TableCell align="center">{product.quantity}</TableCell>
            <TableCell align="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="text" color="primary" size="small">
                  Edit
                </Button>
                <Button variant="text" color="secondary" size="small">
                  Delete
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ImageUpload = ({ onUpload, onFileNameChange, user, url }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(url);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("files", file);
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
          throw new Error("Failed to upload image. Please try again.");
        }

        const result = await response.json();
        console.log("Upload result:", result);
        onUpload(result.data);
        onFileNameChange(file.name);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <Button variant="outlined" component="label">
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {previewUrl && (
        <Box
          component="img"
          src={previewUrl}
          alt="Preview"
          sx={{
            width: "100%",
            maxHeight: 200,
            objectFit: "contain",
            borderRadius: 1,
            border: "1px solid #ddd",
          }}
        />
      )}
    </Box>
  );
};
const AddProductDialog = ({
  open,
  handleClose, 
  categories,
  user,
}) => {
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
    createProduct();
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

      handleClose()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add Product</DialogTitle>
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
    media_ids:  shop.avatar_obj.url
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [openDelete, setOpenDelete] = useState(false); 
  const dispatch = useDispatch();
 
  const DeleteShop = async () => {
    try {
      const cates = await fetch("http://tancatest.me/api/v1/shops", {
        method: "DELETE", 
        headers: {
          'Content-Type': 'application/json',
            'session-id': user.session_id,
            'Authorization': `Bearer ${user.token.AccessToken}`,
            'x-client-id': user.id
        },
      })
        .then((res) => res.json())
        .then((res) => res.data); 
        dispatch(setShop(null)); 
        setOpenDelete(false) 
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
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <ImageUpload
              onUpload={(mediaId) =>
                setUserInput({ target: { name: "media_ids", value: mediaId } })
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
        <Button onClick={() => { setOpenDelete(true); handleClose(); }} variant="contained" color="error">
            Delete Shop
          </Button> 
          <Box>
            <Button onClick={handleClose} color="info">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
          </Box>
        </Box> 
      </DialogContent>  
    </Dialog> 
     
    <Dialog open={openDelete} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Shop Delete</DialogTitle>
      <DialogContent>
          
      </DialogContent>  
      <DialogActions>
        <Button onClick={() => { setOpenDelete(false); handleOpen(); }} color="secondary">
          Cancel
        </Button>
        <Button onClick={() =>{DeleteShop()}} variant="contained" color="primary">
          Confirm
        </Button>
         
      </DialogActions> 
    </Dialog>  
     </Box> 
     
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
export default function ViewShop() {
  const { user } = useSelector((state) => state.auth);
  const { shop } = useSelector((state) => state.shop);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [categories, setCategories] = useState([]);
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
      console.log(cates.categories);
      setCategories(cates.categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    createProduct();
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

      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const products = [
    {
      id: 1,
      name: "Test1",
      type: "Test Product",
      price: "$34.00",
      quantity: 100000,
    },
    {
      id: 2,
      name: "Test21",
      type: "Test Product",
      price: "$32.00",
      quantity: 100000,
    },
    {
      id: 3,
      name: "Test3",
      type: "Test Product",
      price: "$38.00",
      quantity: 100000,
    },
  ];
  console.log(formData);
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
      <ProductsTable products={products} />
      <AddProductDialog
        open={open}
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
