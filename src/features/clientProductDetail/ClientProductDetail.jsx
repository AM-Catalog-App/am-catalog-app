import { useEffect, useState } from "react";
import { getProductDetails } from "../../services/product";
import AppLayout from "../../components/AppLayout/AppLayout";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import Chip from "@mui/material/Chip";
import ImageSlider from "../../globalComponents/Image/ImageSlider/ImageSlider";
import styles from "./ClientProductDetail.module.css";

import { useParams } from "react-router-dom";

export default function ClientProductDetail() {
  const [productDetails, setProductDetails] = useState(null);
  const { barCode } = useParams();
  const fetchProductDetails = async () => {
    try {
      const productDetails = await getProductDetails(
        decodeURIComponent(barCode)
      );
      setProductDetails(productDetails);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleShareButtonClick = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
      });
  };

  return (
    <AppLayout>
      {productDetails?.productName ? (
        <Box className={styles.ProductDetailPage}>
          <Box className={styles.ProductImages}>
            <ImageSlider
              showBackButton={true}
              images={productDetails.imageUrls.map((image, index) => (
                <img key={index} src={image} />
              ))}
            />
          </Box>
          <Box className={styles.ProductDetails}>
            <Box className={styles.ProductDetailsHeading}>
              <Typography
                className={styles.ProductName}
                variant="h6"
                color="initial"
              >
                {productDetails.productName}
              </Typography>
              <IconButton
                aria-label="Share Button"
                onClick={handleShareButtonClick}
              >
                <ShareIcon />
              </IconButton>
            </Box>
            <Box className={styles.ProductDetailsSubHeading}>
              <Typography variant="body1" color="initial">
                Style Code - {productDetails.styleCode}
              </Typography>
              <Typography variant="body1" color="initial">
                {productDetails.barcode}
              </Typography>
            </Box>
            <Typography
              className={styles.ProductMRP}
              variant="h4"
              color="initial"
            >
              Rs {productDetails.mrp}
            </Typography>
            <Box className={styles.RelatedProducts}>
              <Box className={styles.Colours}>
                <Typography
                  variant="body2"
                  color="initial"
                  sx={{ marginBottom: "4px" }}
                >
                  Colours
                </Typography>
                {productDetails.colours.map((productColour, index) => {
                  return (
                    <Chip
                      key={productColour.key}
                      sx={{
                        backgroundColor: `${productColour.colourHexcode}`,
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        marginRight:
                          index !== productDetails.colours.length - 1
                            ? "4px"
                            : "0",
                      }}
                    />
                  );
                })}
              </Box>
              <Box className={styles.Sizes}>
                <Typography
                  variant="body2"
                  color="initial"
                  sx={{ marginBottom: "4px" }}
                >
                  Sizes
                </Typography>
                {productDetails.sizes.map((productSize, index) => {
                  return (
                    <Chip
                      key={productSize.key}
                      label={productSize.sizeName}
                      sx={{
                        color: "black",
                        backgroundColor: "white",
                        border: "1px solid grey",
                        borderRadius: "20%",
                        marginRight:
                          index !== productDetails.sizes.length - 1
                            ? "4px"
                            : "0",
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box className={styles.ProductDescription}>
              <Typography
                variant="h6"
                color="initial"
                sx={{ marginBottom: "4px", marginTop: "8px" }}
              >
                Description
              </Typography>
              <Typography variant="body1" color="initial">
                {productDetails.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </AppLayout>
  );
}
