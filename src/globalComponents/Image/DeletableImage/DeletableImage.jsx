import PropTypes from "prop-types";
import { Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./DeletableImage.module.css";

function DeletableImage({ src, onDelete }) {
  return (
    <Stack direction="column" className={styles.DeletableImage}>
      <img src={src} alt="Deletable" className={styles.image} />
      <IconButton onClick={onDelete} className={styles.deleteButton} aria-label="delete image">
        <CloseIcon fontSize="small" sx={{ cursor: "pointer" }} />
      </IconButton>
    </Stack>
  );
}

DeletableImage.propTypes = {
  src: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeletableImage;
