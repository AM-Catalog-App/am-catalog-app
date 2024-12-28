import { useState } from "react";
import PropTypes from "prop-types";
import ImageSlider from "../../globalComponents/Image/ImageSlider/ImageSlider.jsx";
import DeletableImage from "../../globalComponents/Image/DeletableImage/DeletableImage.jsx";
import { normalizeString } from "../../utils/index.js";
import { uploadProductImages } from "../../services/index.js";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import styles from "./ProductImageUploader.module.css";

function ProductImageUploader({
  productId,
  barcode,
  onClose,
  open,
  imageUrls,
  onSuccessfulUpload,
}) {
  const [images, setImages] = useState(imageUrls);
  const [removedImages, setRemovedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        if (!images.includes(imageData)) {
          setImages((prevImages) => [...prevImages, imageData]);
        } else {
          alert("This image is already added.");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (images[index].includes("http")) {
      setRemovedImages((prevImages) => [...prevImages, images[index]]);
    }
    console.log(index, "delete image");
  };

  const handleCancel = () => {
    setImages([]);
    setRemovedImages([]);
    onClose();
  };

  const handleDone = async () => {
    try {
      setUploading(true);
      const filteredImages = images.filter((image) => !image.includes("http"));
      const imageDataArray = filteredImages.map((image, index) => ({
        fileName: `${normalizeString(barcode)}/image-${imageUrls.length + 1}`,
        data: image.split(",")[1], // Extract the base64 data
      }));

      const uploadedImagesUrl = await uploadProductImages(
        imageDataArray,
        removedImages,
        productId
      );
      onSuccessfulUpload(uploadedImagesUrl);
      setUploading(false);

      alert("Images uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle className={styles.Title}>Upload Product Images</DialogTitle>
      <DialogContent>
        <Box className={styles.ImageBox}>
          <ImageSlider
            images={images.map((image, index) => (
              <DeletableImage
                key={index}
                src={image}
                onDelete={() => {
                  handleDeleteImage(index);
                }}
              />
            ))}
          />
        </Box>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className={styles.UploadFile}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          <Typography
            variant="body2"
            color="initial"
            className={styles.UploadText}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDone}
          className={styles.UploadButton}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Typography
              variant="body2"
              color="initial"
              className={styles.UploadText}
            >
              Upload
            </Typography>
            {uploading && (
              <CircularProgress className={styles.CircularProgress} />
            )}
          </Stack>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductImageUploader.propTypes = {
  productId: PropTypes.string.isRequired,
  barcode: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  imageUrls: PropTypes.array,
  onSuccessfulUpload: PropTypes.func,
};

export default ProductImageUploader;
