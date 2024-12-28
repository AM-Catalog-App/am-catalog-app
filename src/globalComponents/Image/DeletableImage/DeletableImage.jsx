import PropTypes from "prop-types";
import {  IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./DeletableImage.module.css";

function DeletableImage({ src, onDelete }) {
  return (
   
    <div className={styles.deletableImageContainer}>
      <img src={src} alt="Deletable" className={styles.image} />
      <IconButton
        onClick={onDelete} // Fixed issue of immediate invocation
        className={styles.deleteButton}
        aria-label="delete image"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

DeletableImage.propTypes = {
  src: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeletableImage;
