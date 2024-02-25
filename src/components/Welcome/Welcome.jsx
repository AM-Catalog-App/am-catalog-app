import { useEffect } from "react";
import { Box } from "@mui/material";
import amLogo from "../../assets/amLogo1.png";
import { useNavigate } from "react-router-dom";
import "./Welcome.css"; // Import CSS file for styling

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/catalog");
    }, 3000); // Redirect after 3 seconds (adjust the time as needed)

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigate]);

  return (
    <div className="welcome-container">
      <img src={amLogo} height={"200px"} alt="Anju Modi" className="logo" />
    </div>
  );
}

export default Welcome;
