// import { Typography } from "@mui/material";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./features/adminPortal/AdminPortal";
import Welcome from "./components/Welcome/Welcome";
import ExcelReader from "./components/ExcelReader/ExcelReader";
import { ThemeProvider } from "@mui/material";
import amTheme from "./styles/amTheme";

function App() {
  return (
    <ThemeProvider theme={amTheme}>
      <Router>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/excel-reader" element={<ExcelReader />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
