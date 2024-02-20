import { Box } from "@mui/material";
import amLogo from "../../assets/amLogo1.png";

function Welcome() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: " center" /* Center horizontally */,
        alignItems: "center" /* Center vertically */,
        height: "98vh",
      }}
    >
      <img src={amLogo} height={"200px"} alt="Anju Modi" />
    </div>
  );
}

export default Welcome;
