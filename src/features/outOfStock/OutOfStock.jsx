import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Stack,
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
import { getOutOfStockProducts, getFilters } from "../../services/catalog";
import useIsMobile from "../../utils/useIsMobile";
import AppLayout from "../../components/AppLayout/AppLayout";
import colors from "../../styles/colors";
// import classes from "./category.module.css";
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

function OutOfStock() {
  const navigate = useNavigate();
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
    //   fetchBestsellers();
    return () => {};
  }, []);

  useEffect(() => {
    loadMoreProducts(true);
  }, [selectedColours, selectedLocations]);

  const loadMoreProducts = async (reset = "false", tempSearch = search) => {
    try {
      setLoading(true);
      let startIndex = reset ? 0 : products?.length,
        endIndex = reset ? 10 : products?.length + 10;
      const { total, outOfStockProducts: tempProducts } =
        await getOutOfStockProducts({
          category: "",
          startIndex,
          endIndex,
          colour: selectedColours,
          location: selectedLocations,
          search: tempSearch,
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
  const handleSearchChange = (e) => {
    const tempSearch = e;
    setSearch(e);
    loadMoreProducts(true, tempSearch);
  };

  const DebouncedSearch = debounce(handleSearchChange, 500); // 500 ms is the current delay

  // const truncateProductName = (name, maxLength) => {
  //   return name.length > maxLength
  //     ? name.substring(0, maxLength - 3) + "..."
  //     : name;
  // };

  // // const { items error, loadMore } = useLoadItems();
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMoreProducts,
    // disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <AppLayout>
      <Grid container direction="column" alignItems="center" mt={3} p={2}>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          position="sticky"
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
            <Typography variant="h1">Customer Section</Typography>
          </Grid>
        </Grid>

        <Grid
          container
          item
          // xs={12}
          mt={3}
          mb={3}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
            </Box>
          </Grid>

          {/* Search Chip */}

          <Grid item xs={8}>
            {isSearchExpanded ? (
              <DebouncedTextField
                id="input-with-icon-textfield"
                label={
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Search Customs
                  </Typography>
                }
                fullWidth
                size="small"
                onChange={DebouncedSearch}
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

export default OutOfStock;
