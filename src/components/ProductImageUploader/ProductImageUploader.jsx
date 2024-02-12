import { useState } from 'react';
import PropTypes from 'prop-types';
import ImageSlider from '../../globalComponents/Image/ImageSlider/ImageSlider.jsx'; 
import DeletableImage from '../../globalComponents/Image/DeletableImage/DeletableImage.jsx'; 
import { normalizeString } from '../../utils/index.js';
import { uploadProductImages } from '../../services/index.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function ProductImageUploader({ productId, barcode, onClose, open }) {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setImages(prevImages => [...prevImages, imageData]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setImages([]);
    onClose();
  };

  const handleDone = async () => {
    try {

      const imageDataArray = images.map((image, index) => ({
        fileName: `${normalizeString(barcode)}/image-${index+1}`,
        data: image.split(',')[1], // Extract the base64 data
      }));
  
      await uploadProductImages(imageDataArray, productId);
  
      alert('Images uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Product Images</DialogTitle>
      <DialogContent>
        <ImageSlider images={images.map((image, index) => (
          <DeletableImage key={index} src={image} onDelete={() => handleDeleteImage(index)} />
        ))} />
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleDone}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

ProductImageUploader.propTypes = {
  productId: PropTypes.string.isRequired,
  barcode: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default ProductImageUploader;