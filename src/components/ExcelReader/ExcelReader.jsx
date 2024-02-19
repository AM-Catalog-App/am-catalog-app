import { useState } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { PRODUCT_DETAIL_EXCEL_COLUMN_NAMES } from "../../constants/constants.js";
import { capitalizeFirstLetter } from "../../utils/index";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { bulkUploadProducts } from "../../services/index";
import ProductImageUploader from "../ProductImageUploader/ProductImageUploader";

function ExcelReader() {
  const [tableData, setTableData] = useState([]);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploadImageColumn, setShowUploadImageColumn] = useState(true);
  const [isProductImageUploaderOpen, setIsProductImageUploaderOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBarCode, setSelectedBarCode] = useState("");

  const findMissingColumns = (columns) => {
    return PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.filter((col) => !columns.includes(col.toLowerCase()));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Validate file type
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid Excel file (.xls or .xlsx)");
      return; // Exit the function if file is not an Excel file
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const columns = jsonData[0].map((header) => header.toLowerCase());

      const missingColumns = findMissingColumns(columns);
      if (missingColumns.length === 0) {
        // Process data to convert keys to lowercase
        const data = XLSX.utils.sheet_to_json(worksheet).map((row) => {
          let newRow = {};
          Object.keys(row).forEach((key) => {
            newRow[key.toLowerCase()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          });
          return newRow;
        });
        console.log(data, "data");
        setTableData(data);
      } else {
        toast.error(`Missing columns: ${missingColumns.join(", ")}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkUpload = async () => {
    try {
      const response = await bulkUploadProducts(tableData);
      setUploadResponse(response);
      console.log(response, "response");
      setIsModalOpen(true);
      toast.success("Products processed");

      // Update tableData with the products received in the response
      if (response.success && response.success.products) {
        const updatedTableData = response.success.products;
        setTableData(updatedTableData);
        setShowUploadImageColumn(true);
      }
    } catch (error) {
      toast.error("Failed to upload products");
      console.error("Upload error:", error);
    }
  };

  const renderModalContent = () => (
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <h2>Upload Results</h2>
      {uploadResponse && (
        <>
          <h3>Success</h3>
          <pre>{uploadResponse.success.count}</pre>
          <h3>Failure</h3>
          <pre>{uploadResponse.failed.count}</pre>
        </>
      )}
      <button onClick={() => setIsModalOpen(false)}>Close</button>
    </Box>
  );

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={handleBulkUpload}>Upload Products</button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map(
                (header, index) =>
                  header !== "Image" && (
                    <TableCell key={index}>{capitalizeFirstLetter(header)}</TableCell>
                  )
              )}
              {showUploadImageColumn && <TableCell>Upload Image</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map((header, colIndex) => {
                  if (header !== "Image") {
                    if (header === "sr no.") {
                      return <TableCell key={colIndex}>{rowIndex + 1}</TableCell>;
                    }
                    if (header === "product name") {
                      return (
                        <TableCell key={colIndex}>{row[header] || row["productName"]}</TableCell>
                      );
                    }
                    if (header === "style code") {
                      return (
                        <TableCell key={colIndex}>{row[header] || row["styleCode"]}</TableCell>
                      );
                    }
                    return <TableCell key={colIndex}>{row[header]}</TableCell>;
                  }
                })}
                {showUploadImageColumn && (
                  <TableCell>
                    <button
                      onClick={() => {
                        setIsProductImageUploaderOpen(true);
                        setSelectedProductId(row._id);
                        setSelectedBarCode(row.barcode);
                      }}
                    >
                      Upload
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {renderModalContent()}
      </Modal>
      {isProductImageUploaderOpen && (
        <ProductImageUploader
          productId={selectedProductId}
          barcode={selectedBarCode}
          open={isProductImageUploaderOpen}
          onClose={() => setIsProductImageUploaderOpen(false)}
        />
      )}
    </div>
  );
}

export default ExcelReader;
