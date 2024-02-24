import PropTypes from "prop-types";
import Carousel from "react-material-ui-carousel";
import NoProductImage from "../../../assets/NoProductImage.png";

function ImageSlider({ images }) {
  if (images.length === 0) {
    return <img src={NoProductImage} alt="No Images" />;
  }

  return (
    <Carousel
      animation="slide"
      indicators={true}
    >
      {images.map((imageOrComponent, index) => (
        <>
          {typeof imageOrComponent === "string" ? (
            <img
              src={imageOrComponent}
              alt={`Slide ${index}`}
            />
          ) : (
            imageOrComponent
          )}
        </>
      ))}
    </Carousel>
  );
}

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]))
    .isRequired,
};

export default ImageSlider;
