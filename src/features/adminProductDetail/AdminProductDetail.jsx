import { useEffect, useState } from "react";
import { getProductDetails } from "../../services/product";
import AppLayout from "../../components/AppLayout/AppLayout";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import Chip from "@mui/material/Chip";
import ImageSlider from "../../globalComponents/Image/ImageSlider/ImageSlider";
import styles from "./AdminProductDetail.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { updateProductDetails } from "../../services";
import ProductImageUploader from "../../components/ProductImageUploader/ProductImageUploader";

export default function AdminProductDetail() {
  const [productDetails, setProductDetails] = useState(null);
  const [editMode, setEditMode] = useState(false); // State variable for edit mode
  const [editImageMode, setEditImageMode] = useState(false);
  const { barCode } = useParams();
  const [form, setForm] = useState({});

  const fetchProductDetails = async () => {
    try {
      const productDetails = await getProductDetails(
        decodeURIComponent(barCode)
      );
      setProductDetails(productDetails);
      let tempForm = {
        productName: productDetails.productName,
        barcode: barCode,
        styleCode: productDetails.styleCode,
        mrp: productDetails.mrp,
        description: productDetails.description,
      };
      console.log("tempForm", tempForm);
      setForm(tempForm);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleValueChange = (formField, value) => {
    console.log("here");
    let tempForm = { ...form };
    tempForm[formField] = value;
    console.log("tempForm", tempForm);

    setForm(tempForm);
  };

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
  const handleSaveProductDetails = async () => {
    const response = await updateProductDetails({
      ...form,
      _id: productDetails._id,
    });
    toast(response.message);
    fetchProductDetails();
    setEditMode(false);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  return (
    <AppLayout>
      {productDetails?.productName ? (
        <Box className={styles.ProductDetailPage}>
          <Box className={styles.ProductImages}>
            {editImageMode ? (
              <>
                <ProductImageUploader
                  productId={productDetails._id}
                  barcode={productDetails.barcode}
                  imageUrls={productDetails.imageUrls}
                  onClose={() => setEditImageMode(false)}
                  open={editImageMode}
                  onSuccessfulUpload={(uploadedImagesUrl) => {
                    productDetails.imageUrls = uploadedImagesUrl;
                  }}
                />
              </>
            ) : (
              <ImageSlider
                showBackButton={true}
                showEditButton={true}
                images={productDetails.imageUrls.map((image, index) => (
                  <img key={index} src={image} />
                ))}
              >
                {/* Add Edit Button in Image Slider */}

                <Tooltip
                  title={<Typography variant="body1">Edit Images</Typography>}
                >
                  <IconButton
                    className={styles.editButton} // Add a style for positioning
                    onClick={() => setEditImageMode(true)} // Open the image uploader
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </ImageSlider>
            )}
          </Box>
          <Box className={styles.ProductDetails}>
            <Box className={styles.ProductDetailsHeading}>
              <Typography
                className={styles.ProductName}
                variant="h6"
                color="initial"
              >
                {editMode ? (
                  <TextField
                    label={<Typography>Name</Typography>}
                    // defaultValue={productDetails.productName}
                    value={form.productName}
                    variant="standard"
                    onChange={(e) =>
                      handleValueChange("productName", e.target.value)
                    }
                  />
                ) : (
                  productDetails.productName
                )}
              </Typography>
              <Tooltip
                title={<Typography variant="body1">Edit Details</Typography>}
              >
                <IconButton
                  aria-label="Edit Button"
                  onClick={handleEditModeToggle}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {editMode ? (
                <IconButton
                  aria-label="Save Button"
                  onClick={handleSaveProductDetails}
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                <></>
              )}
              <IconButton
                aria-label="Share Button"
                onClick={handleShareButtonClick}
              >
                <ShareIcon />
              </IconButton>
            </Box>
            <Box className={styles.ProductDetailsSubHeading}>
              {editMode ? (
                <TextField
                  label={<Typography>Style Code</Typography>}
                  value={form.styleCode}
                  variant="standard"
                  onChange={(e) =>
                    handleValueChange("styleCode", e.target.value)
                  }
                />
              ) : (
                <>
                  <Typography variant="body1" color="initial">
                    Style Code - {productDetails.styleCode}
                  </Typography>
                </>
              )}
              {editMode ? (
                <TextField
                  label={<Typography variant="body1">Bar Code</Typography>}
                  // defaultValue={`${productDetails.barcode}`}
                  value={form.barcode}
                  variant="standard"
                  onChange={(e) => handleValueChange("barcode", e.target.value)}
                />
              ) : (
                <>
                  <Typography variant="body1" color="initial">
                    {productDetails.barcode}
                  </Typography>
                </>
              )}
            </Box>

            {editMode ? (
              <TextField
                label={<Typography>MRP</Typography>}
                // defaultValue={`${productDetails.mrp}`}
                value={form.mrp}
                variant="standard"
                onChange={(e) => handleValueChange("mrp", e.target.value)}
              />
            ) : (
              <>
                <Typography
                  className={styles.ProductMRP}
                  variant="h4"
                  color="initial"
                >
                  Rs {productDetails.mrp}
                </Typography>
              </>
            )}

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
              {editMode ? (
                <TextField
                  defaultValue={productDetails.description}
                  variant="standard"
                  fullWidth
                  multiline
                  onChange={(e) =>
                    handleValueChange("description", e.target.value)
                  }
                />
              ) : (
                <Typography variant="body1" color="initial">
                  {productDetails.description}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <CircularProgress />
        </Box>
      )}
      <ToastContainer />
    </AppLayout>
  );
}
