import { useState } from "react";
import PropTypes from "prop-types";
import DeletableImage from "../../../../globalComponents/Image/DeletableImage/DeletableImage.jsx";
import { updateCategoryImage } from "../../../../services/index.js";
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
import styles from "./UpdateCategoryImage.module.css";

function UpdateCategoryImage({
  categoryName = null,
  onClose,
  open,
  imageUrl = "",
  onSuccessfulUpload,
}) {
  const [image, setImage] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (image) => {
    console.log(image, "delete image");
  };

  const handleCancel = () => {
    setImage("");
    onClose();
  };

  const handleDone = async () => {
    try {
      if (image.startsWith("http") && image.includes("amazonaws.com")) return;
      setUploading(true);
      const imageData = {
        categoryName,
        categoryImage: image.split(",")[1],
      };

      const { categoryImageUrl } = await updateCategoryImage(imageData);
      onSuccessfulUpload(categoryImageUrl);
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
      <DialogTitle className={styles.Title}>Upload Category Image</DialogTitle>
      <DialogContent>
        <Box className={styles.ImageBox}>
          <DeletableImage src={image} onDelete={() => handleDeleteImage(image)} />
        </Box>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.UploadFile}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          <Typography variant="body2" color="initial" className={styles.UploadText}>
            Cancel
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDone}
          className={styles.UploadButton}
        >
          <Stack direction="row" alignItemst="center" justifyContent="center" spacing={2}>
            <Typography variant="body2" color="initial" className={styles.UploadText}>
              Upload
            </Typography>
            {uploading && <CircularProgress className={styles.CircularProgress} />}
          </Stack>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UpdateCategoryImage.propTypes = {
  categoryName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string,
  onSuccessfulUpload: PropTypes.func,
};

export default UpdateCategoryImage;
