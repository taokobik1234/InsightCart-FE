import {
    Box,
    Typography,
    useMediaQuery, 
    Button,
  } from "@mui/material"; 
import { AppBar,   Tabs, Tab, Grid, Card, CardMedia, CardContent,Container } from '@mui/material';
import {  Menu, MenuItem } from '@mui/material';

  import { useParams  } from "react-router-dom";
 
  import {  useSelector } from "react-redux";
  import DotLoader from "../../components/ui/DotLoader";  
  import { useNavigate } from "react-router-dom";
  import React, { useRef ,useState, useEffect } from "react"; 
  
  
  export default function ViewShop() {
    const navigate = useNavigate(); 
    const { user } = useSelector((state) => state.auth);
    const { shopId } = useParams();
    const [shop,setShop] = useState(null); 
     const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); 
    const [categories, setCategories] = useState([]);
    const [products, setproducts] = useState([]); 
    const [productss, setproductss] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // Menu anchor element
    const [sortOrder, setSortOrder] = useState("Low to High"); // Default sort order
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget); // Open the menu when the button is clicked
    };
  
    const handleClose = () => {
      setAnchorEl(null); // Close the menu when an option is selected
    };
  
    const handleSortChange = (order) => {
      setSortOrder(order); // Update the sort order based on selection
      handleClose();
    }; 
    const fetchShop = async () => {
      try { 
        const shop = await fetch(`http://tancatest.me/api/v1/shops/${shopId}`, {
          headers: {
            "Content-Type": "application/json",
            "session-id": user.session_id,
            Authorization: `Bearer ${user.token.AccessToken}`,
            "x-client-id": user.id,
          },
        })
          .then((response) => response.json())
          .then((response) => response.data);
        console.log(shop); 
        setShop(shop)  
      } catch (error) {
        console.log(error);
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
      function findMostFrequentFirstCategory(products) {
        const counts = products
          .map(product => product.category_objects?.[0]?.name) 
          .filter(name => name) 
          .reduce((counts, name) => {
            counts[name] = (counts[name] || 0) + 1; 
            return counts;
          }, {});  
      
        // Handle the case where no categories exist
        if (Object.keys(counts).length === 0) {
          return "";  
        }
      
        // Find the most frequent category
        return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      }
      
      const fetchProduct = async () => { 
        try {
          const response = await fetch(
            `http://tancatest.me/api/v1/shops/products?shop_id=671cb859fb04eff50015bf06 
            `,
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
          setproductss(response.products)   
          console.log(products)  
        } catch (error) {
          console.log(error);
        }
      };   
    useEffect(() => {
        fetchShop()
        fetchProduct() 
        fetchCategories() 
      }, [shopId ]);
      const allProductsRef = useRef(null);  
      const recomProductsRef = useRef(null);   
      const [value, setValue] = useState(false);
       
      const handleTabChange = (event, newValue) => {
        setValue(newValue) 
        if (newValue === 0) { 
            recomProductsRef.current.scrollIntoView({ behavior: "smooth" });  
         }  
        if (newValue === 1) { 
           allProductsRef.current.scrollIntoView({ behavior: "smooth" });  
           setproducts(productss); 
        }
        if (newValue === 2) { 
            allProductsRef.current.scrollIntoView({ behavior: "smooth" });  
            setproducts(productss);
            const filteredProducts = productss.filter((product) =>
            product.category_objects.some((category) => category.name === findMostFrequentFirstCategory(products))
            );
            setproducts(filteredProducts); 
         }
      };   
      const convertDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
        
            year: 'numeric', 
            month: 'long',    
            day: 'numeric', 
          
        };
        const formattedDate = date.toLocaleString('en-US', options);
        return formattedDate;
    } 
    if (!shop) return DotLoader(); 
    return (
        <div>
          {/* Header */}
          <AppBar position="static" sx={{ backgroundColor: 'primary ' }}>
          <div className="flex items-start space-x-4 pb-6 mb-6 mt-6 ml-[20%] center ">
                    {/* Shop Logo */}
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                            src={shop.avatar_obj.url || "https://via.placeholder.com/64"}
                            height= {100}  
                            alt="Shop Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Shop Details   */}
                    <div className="flex-[0.25] flex space-x-4">
                        {/* Shop Details */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">{shop.name || "Shop Name"}</h2>
                            <p className="text-black-500">Online {shop.last_active || "N/A"} ago</p>
                        </div>

                         
                    </div>
                    <div className="flex-1 flex justify-between items-center " >
                        {/* Shop Statistics */}
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                                <span className="text-black-500">Phone </span>
                                <p className="font-bold">{shop.phone || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-black-500">Address</span>
                                <p className="font-bold">{shop.address.city + ", " + shop.address.district + ", " + shop.address.street || "N/A"}</p>
                            </div>
                             
                            <div>
                                <span className="text-black-500">Join date </span>
                                <p className="font-bold">{convertDate(shop.created_at) || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-black-500">Followers</span>
                                <p className="font-bold">{shop.followers || "N/A"}</p>
                            </div>
                        </div> 
                    </div>            
                    {/* Actions */}
                   
                </div>
          </AppBar>
          <Container
      display="flex"
      width={isNonMobileScreens ? "50%" : "100%"}
      p="2rem"
      m="2rem auto"
      mt="100px"
    >
          {/* Navigation Tabs */}
          <Tabs value={value} onChange={handleTabChange} centered>
            <Tab label="REcoment Product" />
            <Tab label="All Product" />
            <Tab label= {findMostFrequentFirstCategory(products)} />
            <Tab label="???" />
          </Tabs>
    
          {/* Promo Section */}
          <Box sx={{ padding: 2, backgroundColor: '#f8f8f8' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography>Sale 7%</Typography>
                  <Typography>Voucher 1600k</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
               <Typography>Sale 17%</Typography>
                  <Typography>Voucher 112 k</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
                  
          {/* Product Recommendations */}
          <Box id="recom-products-section" ref={recomProductsRef} sx={{ padding: 2 }}>
            <Typography variant="h6">Your Recomment</Typography>
            <Grid container spacing={2}>
              {[1, 2, 3, 4,5,6  ].map((product) => (
                <Grid item xs={7} sm={7} md={2} key={product}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="10"
                      image="https://via.placeholder.com/150"
                      alt="Product Image"
                    />
                    <CardContent>
                      <Typography variant="subtitle1">Product Name</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price: 99,000₫
                      </Typography>
                      <Button variant="contained" size="small" color="primary">
                        Mua Ngay
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
           
          {/* ALL Product */}
          <Box  id="all-products-section" ref={allProductsRef} sx={{ padding: 2 }}>
            <Box display="flex" flexDirection="row" justifyContent="space-between"  mb={2}>  
            <Typography variant="h5">All Product </Typography>
             <Box display="flex" flexDirection="row "  justifyContent="space-between" gap={2} mb={2}> 
            <Typography variant="h7" >Sort by:  </Typography> 
            <Button    variant="text" color="primary" size="small" onClick={() => setproducts([...products].reverse())} >
 
                    Newest
             </Button>
             <Button    variant="text" color="primary" size="small"   >
                     Topseller
             </Button>
             <Button
        variant="text"
        color="primary"
        size="small"
        onClick={handleClick}
      >
        Sort by: {sortOrder}
      </Button>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleSortChange("Low to High"); setproducts([...products].sort((a, b) => a.price - b.price))}  }>
          Low to High
        </MenuItem>
        <MenuItem onClick={() => {handleSortChange("High to Low"); setproducts([...products].sort((a, b) => b.price - a.price))}  }>
          High to Low
        </MenuItem>
      </Menu> 
            </Box> 
            </Box> 
            <Typography variant="h6"gutterBottom>Categories:   </Typography>

            <Box display="flex" flexDirection="row"   mb={2}>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
                 <Button    variant="text" color="primary" size="small" sx={{ textAlign: 'left', justifyContent: 'flex-start', width: '100%' }} onClick={() => {
                        setproducts(productss);
                          
                      }}>
                     All
                  </Button>
                {categories.map((cate) => (
                    <Button key={cate.id}  variant="text" color="primary" size="small" sx={{ textAlign: 'left', justifyContent: 'flex-start', width: '100%' }} onClick={() => {
                        setproducts(productss);
                        const filteredProducts = productss.filter((product) =>
                          product.category_objects.some((category) => category.name === cate.name)
                        );
                        setproducts(filteredProducts);   
                      }}>
                     {cate.name}
                    </Button>
                    
                     
                ))}
             </Box>
             <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item  xs={6} sm={4} md={3} key={product.id}>
                  <Card onClick={() => navigate(`/products/details/${product.id}`)} sx={{ 
                        '&:hover': {
                        cursor: 'pointer',
                        boxShadow: 3,
                        },
                    }}>
                    <CardMedia
                      component="img"
                      width="100%"
                      image= {product.avatar? product.avatar[0].url : "https://via.placeholder.com/150"}
                      alt="Product Image"
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name} </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price: {product.price}₫
                      </Typography>
                      <Button variant="contained" size="small" color="primary">
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            </Box>              
          </Box> 
          </Container>  
        </div>
      );
  }
 