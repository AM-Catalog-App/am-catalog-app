import { Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/catalog";
import useIsMobile from "../../utils/useIsMobile";
import AppLayout from "../../components/AppLayout/AppLayout";
import amLogo from "../../assets/amLogo1.png";
function Catalog() {
  const [categories, setCategories] = useState([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const fetchAllCategories = async () => {
    try {
      const categories = await getAllCategories();
      // console.log("categories", categories);
      setCategories(categories);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleClick = (name) => {
    const encodedCategoryName = encodeURIComponent(name);
    navigate(`/category/${encodedCategoryName}`);
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <AppLayout>
      <Grid
        container
        direction="column"
        mt={4}
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        <Grid
          item
          xs={12}
          p={2}
          sx={{
            width: "100%",
          }}
        >
          <Typography variant="h1">CATALOG</Typography>
        </Grid>
        <Grid
          item
          container
          mt={4}
          sx={{
            height: "100%",
          }}
        >
          {categories &&
            categories?.map((category) => (
              <Grid
                key={category?._id}
                container
                item
                xs={6}
                p={1}
                mb={3}
                direction="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                onClick={() => handleClick(category?.name)}
              >
                <img
                  className=""
                  loading="lazy"
                  src={category?.imageUrl || amLogo}
                  height={isMobile ? "220px" : "400px"}
                  onError={(e) => {
                    e.target.src = amLogo; // Set backup image source when the original image fails to load
                  }}
                  style={{
                    maxWidth: "100%", // Set maximum width to maintain aspect ratio
                    height: "auto", // Automatically adjust height to maintain aspect ratio
                  }}
                  // width={"160px"}
                  alt={category?.name}
                />
                <Typography
                  sx={{ marginTop: isMobile ? "20px" : "30px" }}
                  variant="body1"
                >
                  {category?.name}
                </Typography>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </AppLayout>
  );
}

export default Catalog;
