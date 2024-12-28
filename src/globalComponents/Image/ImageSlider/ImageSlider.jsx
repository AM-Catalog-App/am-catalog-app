import PropTypes from "prop-types";
import Carousel from "react-material-ui-carousel";
import NoProductImage from "../../../assets/NoProductImage.png";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
function ImageSlider({ images, showBackButton = false, children }) {
  const navigate = useNavigate();
  if (images.length === 0) {
    return <img src={NoProductImage} alt="No Images" />;
  }

  return (
    <div style={{ position: "relative" }}>
      {showBackButton && ( // Conditional rendering of the back button
        <ArrowBackIosNewIcon
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 999,
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(-1);
          }}
        />
      )}
      <Carousel animation="slide" indicators={true}>
        {images.map((imageOrComponent, index) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            key={index}
          >
            {typeof imageOrComponent === "string" ? (
              <img src={imageOrComponent} alt={`Slide ${index}`} />
            ) : (
              imageOrComponent
            )}
          </Box>
        ))}
      </Carousel>

      {children}
    </div>
  );
}

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
  ).isRequired,
  showBackButton: PropTypes.bool, // New prop type for showBackButton
  children: PropTypes.element,
};

export default ImageSlider;
