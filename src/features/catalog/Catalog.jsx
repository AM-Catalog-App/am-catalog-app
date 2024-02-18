import { Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/catalog";
import useIsMobile from "../../utils/useIsMobile";
import AppLayout from "../../components/AppLayout/AppLayout";

function Catalog() {
  const [categories, setCategories] = useState([]);
  const isMobile = useIsMobile();

  const fetchAllCategories = async () => {
    try {
      const categories = await getAllCategories();
      // console.log("categories", categories);
      setCategories(categories);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <AppLayout>
      <Grid container>
        <Grid item xs={2} mt={3}>
          <Typography variant="h1">CATALOG</Typography>
        </Grid>
        <Grid item container mt={4}>
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
              >
                <img
                  className=""
                  loading="lazy"
                  src={category?.imageUrl}
                  height={isMobile ? "200px" : "400px"}
                  // width={"160px"}
                  alt={category?.name}
                />
                <Typography
                  sx={{ marginTop: isMobile ? "20px" : "30px" }}
                  variant="h5"
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
