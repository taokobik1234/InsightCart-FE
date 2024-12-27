import {
    Box,
    Typography,
    useMediaQuery, 
    Button,
  } from "@mui/material"; 
  import Tooltip from '@mui/material/Tooltip';
   
import { AppBar,   Tabs, Tab, Grid, Card, CardMedia, CardContent,Container } from '@mui/material';
import {  Menu, MenuItem } from '@mui/material';

  import { useParams  } from "react-router-dom";
 
  import {  useSelector } from "react-redux";
  import DotLoader from "../../components/ui/DotLoader";  
  import { useNavigate } from "react-router-dom";
  import React, { useRef ,useState, useEffect, useCallback } from "react"; 
  
  
  export default function ViewShop() {
    const navigate = useNavigate(); 
    const { user } = useSelector((state) => state.auth);
    const { shopId } = useParams();
    const [shop,setShop] = useState(null); 
     const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); 
    const [categories, setCategories] = useState([]);
    const [products, setproducts] = useState([]); 
    const [productss, setproductss] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // Menu anchor element
    const [sortOrder, setSortOrder] = useState("Low to High"); // Default sort order
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const productsPerPage = 16; // Changed to match API's default per_page
  
    // Add debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
  
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
      
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !isLoading) {
            setIsLoading(true);
            setCurrentPage(newPage);
            try {
                const response = await fetch(
                    `http://tancatest.me/api/v1/shops/products?shop_id=${shopId}&page=${newPage}&limit=${productsPerPage}`,
                    { 
                        headers: {
                            "Content-Type": "application/json",
                            "session-id": user.session_id,
                            Authorization: `Bearer ${user.token.AccessToken}`,
                            "x-client-id": user.id,
                        }, 
                    }
                );
                const data = await response.json();
                if (data.error_code === 0) {
                    setproducts(data.data.products);
                    setTotalPages(data.data.meta.total_pages);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };
      
    // Debounced version of handlePageChange
    const debouncedHandlePageChange = useCallback(
        debounce((newPage) => handlePageChange(newPage), 300),
        [shopId, user]
    );
      
    const fetchProduct = async () => { 
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://tancatest.me/api/v1/shops/products?shop_id=${shopId}&page=${currentPage}&limit=${productsPerPage}`,
                { 
                    headers: {
                        "Content-Type": "application/json",
                        "session-id": user.session_id,
                        Authorization: `Bearer ${user.token.AccessToken}`,
                        "x-client-id": user.id,
                    }, 
                }
            );
            const data = await response.json();
            if (data.error_code === 0) {
                const allProducts = data.data.products;
                setproducts(allProducts);
                setproductss(allProducts);
                setTotalPages(data.data.meta.total_pages);
                
                // Set random products for recommendations
                const shuffled = shuffleArray(allProducts);
                setRandomProducts(shuffled.slice(0, 6));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
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
            <Tab label="recomment Product" />
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
            <Typography variant="h6">Your Recommend</Typography>
            <Grid container spacing={2}>
              {randomProducts.map((product) => (
                <Grid item xs={2} sm={2} md={2} key={product.id}>
                  <Card 
                    onClick={() => navigate(`/products/details/${product.id}`)} 
                    sx={{ 
                      '&:hover': {
                        cursor: 'pointer',
                        boxShadow: 3,
                      },
                      height: '100%', // Make all cards same height
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%',
                        height: 200, // Fixed height for images
                        objectFit: 'cover'
                      }}
                      image={product.avatar ? product.avatar[0].url : "https://via.placeholder.com/150"}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <Tooltip title={product.name || "Unnamed Product"} arrow>
                          <Typography variant="subtitle1" noWrap>
                            {product.name || "Unnamed Product"}
                          </Typography>
                        </Tooltip>
                        <Typography variant="subtitle2" color="text.secondary">
                          Price: {product.price}₫
                        </Typography>
                      </div>
                      <Button 
                        variant="contained" 
                        size="small" 
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        Buy Now
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
              {isLoading ? (
                  <Box display="flex" justifyContent="center" width="100%" py={4}>
                      <DotLoader />
                  </Box>
              ) : (
                  products.map((product) => (
                    <Grid item  xs={6} sm={4} md={3} key={product.id}>
                      <Card onClick={() => navigate(`/products/details/${product.id}`)} sx={{ 
                            '&:hover': {
                            cursor: 'pointer',
                            boxShadow: 3,
                            },
                        }}>
                        <CardMedia
                          component="img"
                          style={{ width: '100%', aspectRatio: '1' }}
                          image= {product.avatar? product.avatar[0].url : "https://via.placeholder.com/150"}
                          alt="Product Image"
                        />
                        <CardContent>
                        <Tooltip title={product.name || "Unnamed Product"} arrow>
                          <Typography variant="subtitle1" noWrap>
                            {product.name || "Unnamed Product"}
                          </Typography>
                        </Tooltip>
                          <Typography variant="subtitle2" color="text.secondary">
                            Price: {product.price}₫
                          </Typography>
                          <Button variant="contained" size="small" color="primary">
                            Buy Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
              )}
            </Grid>
            </Box>              
            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4} gap={2}>
                <Button 
                    variant="outlined" 
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Box display="flex" alignItems="center" gap={1}>
                    {[...Array(totalPages)].map((_, index) => (
                        <Button
                            key={index + 1}
                            variant={currentPage === index + 1 ? "contained" : "outlined"}
                            onClick={() => handlePageChange(index + 1)}
                            disabled={isLoading}
                            size="small"
                        >
                            {index + 1}
                        </Button>
                    ))}
                </Box>
                <Button 
                    variant="outlined"
                    disabled={currentPage === totalPages || isLoading}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </Box>
          </Box> 
          </Container>  
        </div>
      );
  }
 