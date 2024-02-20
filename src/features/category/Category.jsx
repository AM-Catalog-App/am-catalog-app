import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  TextField,
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
import { useNavigate, useParams } from "react-router-dom";
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
    setSelectedLocations((prevState) => [...prevState, location]);
    // handleClose();
  };

  const handleColourSelect = (colour) => {
    setSelectedColours((prevState) => [...prevState, colour]);
    // handleClose();
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
        p={5}
        sx={{ padding: "20px" }}
      >
        {/* {Object.entries(filters).map(([category, values]) => (
          <MenuItem key={category}>
            <Typography variant="h6">{category}</Typography>
            {category === "location" && (
              <Menu
                anchorReference="anchorEl"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
              >
                {values.map((location) => (
                  <MenuItem
                    key={location._id}
                    onClick={() => handleLocationSelect(location)}
                    selected={selectedLocations?.includes(location.name)}
                  >
                    <Typography variant="body2">{location.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
            {category === "colour" && (
              <Menu
                anchorReference="anchorEl"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
              >
                {values.map((colour) => (
                  <MenuItem
                    key={colour._id}
                    onClick={() => handleColourSelect(colour)}
                    selected={selectedColours?.includes(colour.name)}
                  >
                    <Typography variant="body2"> {colour.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </MenuItem>
        ))} */}

        {Object.entries(filters).map(([category, values]) => (
          <Accordion sx={{ padding: "10px" }} key={category}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              {category}
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", flexDirection: "column" }}>
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
                    label={value.name}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </Menu>
    </>
  );
}

function Category() {
  const { categoryName } = useParams();
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
    loadMoreProducts();
    return () => {};
  }, []);

  useEffect(() => {
    loadMoreProducts(true);
  }, [selectedColours, selectedLocations]);

  const loadMoreProducts = async (reset = "false") => {
    try {
      setLoading(true);
      let startIndex = reset ? 0 : products?.length,
        endIndex = reset ? 10 : products?.length + 10;
      const { total, products: tempProducts } = await getProducts({
        category: categoryName,
        startIndex,
        endIndex,
        colour: selectedColours,
        location: selectedLocations,
        search,
      });
      if (total !== totalProducts) setTotalProducts(total);
      if (reset === true) {
        setProducts([...tempProducts]);
      } else {
        setProducts([...products, ...tempProducts]);
      }
      if (tempProducts?.length < 10) setHasNextPage(false);

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
    setSearch(e.target.value);
  };
  const handleSearchSubmit = () => {
    loadMoreProducts(true); // resets the current fetched results
  };
  return (
    <AppLayout>
      <Grid container direction="column" alignItems="center" mt={3} p={2}>
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
            {bestsellers?.map((bestseller) => (
              <img
                key={bestseller?._id}
                height={isMobile ? "150px" : "200px"}
                src={bestseller?.imageUrls[0]}
                // alt={`Image ${index + 1}`}
                style={{ marginRight: "8px" }}
              />
            ))}
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
          <Grid item xs={4}>
            <Typography variant="h5">
              {totalProducts} {displayCategoryName}
            </Typography>
          </Grid>

          {/* Filter Chip */}
          <Grid item xs={4}>
            <Box sx={{ ...circleStyle }}>
              <FilterMenu
                filters={filters}
                selectedLocations={selectedLocations}
                selectedColours={selectedColours}
                setSelectedLocations={setSelectedLocations}
                setSelectedColours={setSelectedColours}
              />
              {/* <IconButton onClick={handleFilterClick} sx={iconStyle}>
                <FilterListIcon />
              </IconButton> */}
            </Box>
          </Grid>

          {/* Search Chip */}

          <Grid item xs={4}>
            {isSearchExpanded ? (
              <TextField
                id="input-with-icon-textfield"
                label={
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Search {displayCategoryName}
                  </Typography>
                }
                // variant="standard"
                value={search}
                onChange={handleSearchChange}
                fullWidth
                variant="filled"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearchSubmit}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <Box sx={circleStyle}>
                <IconButton onClick={handleSearchClick} sx={iconStyle}>
                  <SearchIcon />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          container
          mb={3}
          direction="row"
          // justifyContent="center"
          // alignItems="center"
          // onClick={() => handleClick(category?.name)}
        >
          {products?.map((product) => (
            <>
              <Grid
                container
                item
                direction="column"
                xs={6}
                sm={4}
                md={3}
                p={2}
                alignItems="center"
              >
                <Grid item>
                  <img
                    key={product?._id}
                    src={product?.imageUrl}
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

                  <Typography variant="body2" textAlign="left">
                    {product?.productName}
                  </Typography>
                  <Typography sx={{ color: colors.dark2 }} variant="body2">
                    Style Code - {product?.styleCode}
                  </Typography>
                  <Typography sx={{ color: colors.green }} variant="body1">
                    Rs. {product?.mrp?.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>

        {/* <Grid container direction="row" spacing={2} mb={3}>
          {products.map((product) => (
            <Grid item xs={6} md={3} key={product._id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product._id}
                  style={{ marginBottom: "8px" }}
                />
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography variant="body1">
                  Style Code - {product.styleCode}
                </Typography>
                <Typography variant="body1">
                  Rs. {product.mrp?.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid> */}

        {(loading || hasNextPage) && (
          <Grid item alignSelf="center" ref={sentryRef}>
            <CircularProgress fontSize="small" />
          </Grid>
        )}
        {!(loading || hasNextPage) && (
          <Grid item alignSelf="center" ref={sentryRef}>
            <Typography variant="h6">No more Products</Typography>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
}

export default Category;
