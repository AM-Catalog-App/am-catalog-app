// import { Typography } from "@mui/material";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./features/adminPortal/AdminPortal";
import Welcome from "./components/Welcome/Welcome";
import ExcelReader from "./components/ExcelReader/ExcelReader";
import Catalog from "./features/catalog/Catalog";
import { ThemeProvider } from "@mui/material";
import amTheme from "./styles/amTheme";
import Category from "./features/category/Category";
import ClientProductDetail from "./features/clientProductDetail/ClientProductDetail";
import OutOfStock from "./features/outOfStock/OutOfStock";

function App() {
  return (
    <ThemeProvider theme={amTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/excel-reader" element={<ExcelReader />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/product-detail" element={<ClientProductDetail />} />
          <Route path="/out-of-stock" element={<OutOfStock />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
