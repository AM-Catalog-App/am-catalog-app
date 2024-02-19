import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './DeletableImage.module.css';

function DeletableImage({ src, onDelete }) {
  return (
    <div className={styles.imageContainer}>
      <img src={src} alt="Deletable" className={styles.image} />
      <IconButton
        onClick={onDelete}
        className={styles.deleteButton}
        aria-label="delete image"
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

DeletableImage.propTypes = {
  src: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeletableImage;