import { useEffect, useState } from "react";
import { getProductDetails } from "../../services/product";
import AppLayout from "../../components/AppLayout/AppLayout";
import { Box, Typography, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import Chip from '@mui/material/Chip';

export default function ClientProductDetail() {
  const [productDetails, setProductDetails] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const productDetails = await getProductDetails("AM/48425");
      setProductDetails(productDetails);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <AppLayout>
      {productDetails?.productName ? (
        <Box>
          <Box className="ProductImages">
            
          </Box>
          <Box className="ProductDetails">
            <Box className="ProductDetailsHeading">
              <Typography variant="h2" color="initial">
                {productDetails.productName}
              </Typography>
              <IconButton
                aria-label="Share Button"
                onClick={() => {
                  console.log("Share button clicked");
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
            <Box className="ProductDetailsSubHeading">
              <Typography variant="body1" color="initial">
                {productDetails.styleCode}
              </Typography>
              <Typography variant="body1" color="initial">
                {productDetails.barcode}
              </Typography>
            </Box>
            <Typography variant="h4" color="initial">
              Rs {productDetails.mrp}
            </Typography>
            <Box className="RelatedProducts">
              <Box className="Colours">
                {
                  productDetails.colours.map((productColour) => {
                    return <Chip key={productColour.key} sx={{
                      backgroundColor: `${productColour.colourHexcode}`
                    }} />
                  } )
                }
              </Box>
              <Box className="Sizes"></Box>
            </Box>
            <Box className="ProductDescription">
              <Typography variant="body1" color="initial">{productDetails.description}</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>Oops! Something went wrong</Box>
      )}
    </AppLayout>
  );
}
