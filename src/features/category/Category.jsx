import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  TextField,
  Stack,
  InputAdornment,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import useInfiniteScroll from "react-infinite-scroll-hook";
import {
  getBestsellers,
  getProducts,
  getFilters,
} from "../../services/catalog";
import useIsMobile from "../../utils/useIsMobile";
import AppLayout from "../../components/AppLayout/AppLayout";
import colors from "../../styles/colors";
import classes from "./category.module.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ExpandMore } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import amLogo from "../../assets/amLogo1.png";
import { capitalizeFirstLetter } from "../../utils";

const DebouncedTextField = ({ onChange, ...rest }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <TextField
      {...rest}
      value={value}
      onChange={handleChange}
      variant="outlined"
      InputProps={{
        sx: { borderRadius: "20px", border: colors.green },

        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const circleStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: colors.light2, // Grey background color
  width: "50px", // Default width
  height: "50px", // Default height
};

const iconStyle = {
  color: colors.dark3, // Adjust icon color as needed
};

function FilterMenu({
  filters,
  selectedLocations,
  selectedColours,
  setSelectedLocations,
  setSelectedColours,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const handleLocationSelect = (location) => {
    setSelectedLocations((prevState) => {
      // If the location is already selected, remove it
      if (prevState.includes(location)) {
        return prevState.filter((loc) => loc !== location);
      } else {
        // Otherwise, add it to the selected locations
        return [...prevState, location];
      }
    });
  };

  const handleColourSelect = (colour) => {
    setSelectedColours((prevState) => {
      // If the colour is already selected, remove it
      if (prevState.includes(colour)) {
        return prevState.filter((col) => col !== colour);
      } else {
        // Otherwise, add it to the selected colours
        return [...prevState, colour];
      }
    });
  };

  return (
    <>
      <IconButton onClick={handleFilterClick} sx={iconStyle}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        sx={{ borderRadius: "50px", width: "300px" }}
      >
        <Stack>
          <Typography sx={{ pl: 3 }} variant="h6">
            Filters
          </Typography>
          {Object.entries(filters).map(([category, values]) => (
            <Accordion key={category} sx={{ boxShadow: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ flexDirection: "row-reverse", pl: 2 }} // Move expand icon to the left
              >
                <Typography variant="body1">
                  {capitalizeFirstLetter(category)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack>
                  {values.map((value) => (
                    <FormControlLabel
                      key={value._id}
                      control={
                        <Checkbox
                          checked={
                            category === "location"
                              ? selectedLocations?.includes(value.name)
                              : selectedColours?.includes(value.name)
                          }
                          onChange={() => {
                            if (category === "location") {
                              handleLocationSelect(value?.name);
                            } else {
                              handleColourSelect(value?.name);
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" noWrap>
                          {value.name}
                        </Typography>
                      }
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Menu>
    </>
  );
}
function Category() {
  let { categoryName } = useParams();
  categoryName = decodeURIComponent(categoryName);
  const navigate = useNavigate();
  const displayCategoryName =
    categoryName[0].charAt(0).toUpperCase() +
    categoryName.slice(1).toLowerCase();
  const isMobile = useIsMobile();
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [filters, setFilters] = useState([]);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  useEffect(() => {
    fetchFilters();
    fetchBestsellers();
    return () => {};
  }, []);

  useEffect(() => {
    loadMoreProducts(true);
  }, [selectedColours, selectedLocations]);

  const loadMoreProducts = async (reset = false, tempSearch = search) => {
    try {
      setLoading(true);
      let startIndex = reset ? 0 : products?.length;
      const { total, products: tempProducts } = await getProducts({
        category: categoryName,
        startIndex,
        endIndex: startIndex + 10,
        colour: selectedColours,
        location: selectedLocations,
        search: tempSearch,
      });

      if (reset) {
        setProducts([...tempProducts]);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...tempProducts]);
      }

      setTotalProducts(total);
      setHasNextPage(tempProducts?.length >= 10); // Update hasNextPage based on fetched items
      setLoading(false);
    } catch (err) {
      setProducts([]);
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const tempFilters = await getFilters();
      setFilters(tempFilters);
    } catch (err) {
      setFilters([]);
    }
  };

  const truncateProductName = (name, maxLength) => {
    return name.length > maxLength
      ? name.substring(0, maxLength - 3) + "..."
      : name;
  };

  const fetchBestsellers = async () => {
    try {
      const tempBestellers = await getBestsellers(categoryName);
      setBestsellers(tempBestellers);
    } catch (err) {
      setBestsellers([]);
    }
  };

  // // const { items error, loadMore } = useLoadItems();
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMoreProducts,
    // disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  const handleSearchChange = (e) => {
    const tempSearch = e;
    setSearch(e);
    loadMoreProducts(true, tempSearch);
  };

  const debounce = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  const handleProductClick = (barCode) => {
    const encodedBarCode = encodeURIComponent(barCode);
    if (localStorage.getItem("isAdminLoggedIn") === "true")
      navigate(`/admin-product-detail/${encodedBarCode}`);
    else navigate(`/product-detail/${encodedBarCode}`);
  };

  const DebouncedSearch = debounce(handleSearchChange, 500); // 500 ms is the current delay

  return (
    <AppLayout>
      <Grid container direction="column" alignItems="center">
        <Grid
          item
          container
          p={2}
          backgroundColor={colors.light1}
          sx={{ position: "sticky", top: "0px" }}
        >
          <Grid
            container
            item
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={1} alignSelf="center">
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={10} textAlign="center">
              <Typography variant="h1">{displayCategoryName}</Typography>
            </Grid>
          </Grid>
          <Grid item pl={2} mt={3} sx={{ width: "100%" }}>
            {/*  carousel content goes here */}
            <Box sx={{ display: "flex", overflowX: "auto" }}>
              {bestsellers?.map((bestseller) => {
                if (bestseller?.imageUrls?.length > 0)
                  return (
                    <img
                      key={bestseller?._id}
                      height={isMobile ? "150px" : "200px"}
                      src={bestseller?.imageUrls[0]}
                      // alt={`Image ${index + 1}`}
                      style={{ marginRight: "8px" }}
                    />
                  );
              })}
            </Box>
          </Grid>
          <Grid
            container
            item
            xs={12}
            mt={3}
            mb={3}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Typography noWrap variant="h6">
                {totalProducts} {displayCategoryName}(s)
              </Typography>
            </Grid>

            {/* Filter Chip */}
            <Grid container item xs={6} justifyContent="flex-end" columnGap={1}>
              <Box sx={{ ...circleStyle }}>
                <FilterMenu
                  filters={filters}
                  selectedLocations={selectedLocations}
                  selectedColours={selectedColours}
                  setSelectedLocations={setSelectedLocations}
                  setSelectedColours={setSelectedColours}
                />
              </Box>
              {isSearchExpanded === false && (
                <Box sx={circleStyle}>
                  <IconButton onClick={handleSearchClick} sx={iconStyle}>
                    <SearchIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            {/* Search Chip */}

            {/* <Grid item xs={4}>
            
          </Grid> */}
          </Grid>
          <Grid item xs={12} mb={2}>
            {isSearchExpanded && (
              <DebouncedTextField
                id="input-with-icon-textfield"
                label={
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Search {displayCategoryName}
                  </Typography>
                }
                fullWidth
                size="small"
                onChange={DebouncedSearch}
              />
            )}
          </Grid>
        </Grid>
        <Grid item container mb={3} p={2} direction="row">
          {products?.map((product) => (
            <>
              <Grid
                item
                direction="column"
                xs={6}
                sm={4}
                md={3}
                p={2}
                alignItems="center"
              >
                <Stack
                  onClick={() => {
                    handleProductClick(product?.barcode);
                  }}
                  direction="column"
                  justifyContent="flex-end"
                >
                  <Stack
                    sx={{
                      minHeight: "300px",
                    }}
                    justifyContent="center"
                  >
                    <img
                      key={product?._id}
                      src={product?.imageUrl || amLogo}
                      height={isMobile ? "200px" : "300px"}
                      width={"auto"}
                      onError={(e) => {
                        e.target.src = amLogo; // Set backup image source when the original image fails to load
                      }}
                      style={{
                        maxWidth: "100%", // Set maximum width to maintain aspect ratio
                        height: "auto", // Automatically adjust height to maintain aspect ratio
                      }}
                      loading="lazy"
                      alt={"Anju Modi"}
                    />
                  </Stack>
                  <Typography variant="body2" textAlign="left">
                    {product?.productName}
                  </Typography>
                  <Typography sx={{ color: colors.dark2 }} variant="body2">
                    Style Code - {product?.styleCode}
                  </Typography>
                  <Typography sx={{ color: colors.green }} variant="body1">
                    Rs. {product?.mrp?.toLocaleString()}
                  </Typography>
                </Stack>
              </Grid>
            </>
          ))}
        </Grid>

        {(loading || hasNextPage) && (
          <Grid item alignSelf="center" ref={sentryRef}>
            <CircularProgress fontSize="small" />
          </Grid>
        )}
        {!(loading || hasNextPage) && (
          <Grid item alignSelf="center" ref={sentryRef}>
            <Typography variant="h6">No more Articles</Typography>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
}

export default Category;
