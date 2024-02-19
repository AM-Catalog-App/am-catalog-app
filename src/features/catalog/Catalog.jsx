import { Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/catalog";
import useIsMobile from "../../utils/useIsMobile";
import AppLayout from "../../components/AppLayout/AppLayout";
import colors from "../../styles/colors";
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
    navigate(`/category/${name}`);
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
          sx={{ backgroundColor: colors.white, width: "100%" }}
        >
          <Typography variant="h1">CATALOG</Typography>
        </Grid>
        <Grid
          item
          container
          mt={4}
          sx={{ height: "100%", backgroundColor: colors.white }}
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
                onClick={() => handleClick(category?.name)}
              >
                <img
                  className=""
                  loading="lazy"
                  src={category?.imageUrl}
                  height={isMobile ? "220px" : "400px"}
                  // width={"160px"}
                  alt={category?.name}
                />
                <Typography
                  sx={{ marginTop: isMobile ? "20px" : "30px" }}
                  variant="h6"
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
