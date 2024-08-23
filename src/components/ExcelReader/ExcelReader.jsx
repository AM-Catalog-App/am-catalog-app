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
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { bulkUploadProducts } from "../../services/index";
import ProductImageUploader from "../ProductImageUploader/ProductImageUploader";
import styles from "./ExcelReader.module.css";
import AppLayout from "../../components/AppLayout/AppLayout";

function ExcelReader() {
  const [tableData, setTableData] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploadImageColumn, setShowUploadImageColumn] = useState(false);
  const [isProductImageUploaderOpen, setIsProductImageUploaderOpen] =
    useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBarCode, setSelectedBarCode] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());
  const [uploading, setUploading] = useState(false);
  const [selectedProductImageUrls, setSelectedProductImageUrls] = useState([]);

  const matchDescriptionKey = (description, pattern) => {
    const regex = new RegExp(pattern, "i");
    return regex.test(description);
  };

  const extractQuantity = (text) => {
    const result = text.match(/\d+/);
    return result ? parseInt(result[0], 10) : null;
  };

  const removeSpacesAroundSpecialChars = (text) => {
    // Regex explanation:
    // \s* matches any whitespace characters (space, tab, line break, etc.) zero or more times
    // ([!-/:-@[-`{-~]) is a character class matching any punctuation character based on ASCII order
    return text.replace(/\s*([!-/:-@[-`{-~])\s*/g, "$1").toUpperCase();
  };

  const normalizeData = (data) => {
    let requiredData = [];
    let newRow = {};

    console.log(requiredData);

    data.forEach((row, index) => {
      const keys = Object.keys(row).map((key) => {
        const trimmedKey = key.trim();
        row[trimmedKey] =
          typeof row[key] === "string" ? row[key].trim() : row[key];
        return trimmedKey;
      });
      if (keys.includes("SL. NO.")) {
        if (index !== 0) {
          requiredData.push(newRow);
          newRow = {};
        }
        newRow["sr no."] = row["SL. NO."];
        newRow["collection"] = row["COLLECTION"];
        newRow["description"] = row["DESCRIPTION"];
        newRow["mrp"] = parseFloat(String(row["Main MRP"]).replace(/,/g, ""));
        newRow["size"] = row["SAM Size"];
      }
      if (keys.includes("GARMENT CATEGORY")) {
        newRow["category"] =
          newRow["category"] ??
          removeSpacesAroundSpecialChars(row["GARMENT CATEGORY"]);
      }
      if (keys.includes("BARCODE")) {
        newRow["barcode"] = newRow["barcode"] ?? row["BARCODE"];
      }

      const description = row["DESCRIPTION"] || "";
      if (matchDescriptionKey(description, "^title[ /]*one[ /]*liner")) {
        newRow["product name"] = row["__EMPTY"];
      } else if (matchDescriptionKey(description, "^color")) {
        newRow["colour"] = row["__EMPTY"];
      } else if (matchDescriptionKey(description, "^tag")) {
        newRow["tag"] = row["__EMPTY"];
      } else if (
        matchDescriptionKey(description, "^no\\.?\\s*of\\s*pcs\\s*:?") ||
        matchDescriptionKey(description, "^no[ /]*of[ /]*pcs")
      ) {
        newRow["quantity"] = extractQuantity(row["__EMPTY"]);
      } else if (matchDescriptionKey(description, "^location")) {
        newRow["location"] = row["__EMPTY"];
      } else if (matchDescriptionKey(description, "^style code")) {
        newRow["style code"] = row["__EMPTY"];
      }
    });

    requiredData.push(newRow);
    return requiredData.filter((row) => Object.keys(row).length);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        const updatedData = normalizeData(data);
        setTableData(updatedData);
      } catch (error) {
        toast.error("Failed to process the Excel file.");
        console.error("Excel processing error:", error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkUpload = async () => {
    try {
      setUploading(true);
      const response = await bulkUploadProducts(tableData);
      setUploading(false);
      setUploadResponse(response);
      setIsModalOpen(true);
      toast.success("Products processed");

      // Update tableData with the products received in the response
      if (response.success && response.success.products) {
        const updatedTableData = response.success.products;
        setTableData(updatedTableData);
        setShowUploadImageColumn(true);
      }

      if (response.success && response.success.count === 0) {
        reset();
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

  const reset = () => {
    setInputKey(Date.now());
    setShowUploadImageColumn(false);
    setTableData(null);
  };

  return (
    <AppLayout>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        pt={0}
        mt={0}
        className={styles.UploadCatalog}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          className={styles.Header}
          mt={0}
        >
          <Typography variant="h2">Upload Catalog</Typography>
          {/* <img src={AMLogoLeaf} alt="AM Logo" className={styles.AMLogoLeaf} /> */}
        </Stack>
        <Stack
          direction="row"
          alignSelf="flex-start"
          alignItems="center"
          spacing={4}
        >
          <input
            id="fileInput"
            className={styles.UploadFile}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            key={inputKey} // Key to force re-render
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkUpload}
            className={styles.UploadButton}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Typography
                variant="body1"
                color="initial"
                className={styles.UploadText}
              >
                Upload
              </Typography>
              {uploading && (
                <CircularProgress className={styles.CircularProgress} />
              )}
            </Stack>
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map(
                  (header, index) =>
                    header.toLowerCase() !== "imageurls" && (
                      <TableCell key={index}>
                        <Typography
                          variant="h6"
                          color="initial"
                          className={styles.ColumnTitle}
                        >
                          {capitalizeFirstLetter(header)}
                        </Typography>
                      </TableCell>
                    )
                )}
                {showUploadImageColumn && (
                  <TableCell>
                    <Typography
                      variant="h6"
                      color="initial"
                      className={styles.ColumnTitle}
                    >
                      Upload Image
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData !== null &&
                tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map(
                      (header, colIndex) => {
                        if (header.toLowerCase() !== "imageurls") {
                          if (header === "sr no.") {
                            return (
                              <TableCell key={colIndex}>
                                {rowIndex + 1}
                              </TableCell>
                            );
                          }
                          if (header === "product name") {
                            return (
                              <TableCell key={colIndex}>
                                {row[header] || row["productName"]}
                              </TableCell>
                            );
                          }
                          if (header === "style code") {
                            return (
                              <TableCell key={colIndex}>
                                {row[header] || row["styleCode"]}
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={colIndex}>{row[header]}</TableCell>
                          );
                        }
                      }
                    )}
                    {showUploadImageColumn && (
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setIsProductImageUploaderOpen(true);
                              setSelectedProductId(row._id);
                              setSelectedBarCode(row.barcode);
                              setSelectedProductImageUrls(row.imageUrls);
                            }}
                            className={styles.UploadButton}
                          >
                            Upload
                          </Button>
                          {row.imageUrls.length > 0 && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setIsProductImageUploaderOpen(true);
                                setSelectedProductId(row._id);
                                setSelectedBarCode(row.barcode);
                                setSelectedProductImageUrls(row.imageUrls);
                              }}
                              className={styles.ViewButton}
                            >
                              View
                            </Button>
                          )}
                        </Stack>
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
            imageUrls={selectedProductImageUrls}
            onSuccessfulUpload={(imageUrls) => {
              const tableDataClone = JSON.parse(JSON.stringify(tableData));
              for (let index = 0; index < tableDataClone.length; index++) {
                if (tableDataClone[index]["_id"] === selectedProductId) {
                  tableDataClone[index]["imageUrls"] = imageUrls;
                  break;
                }
              }
              setTableData(tableDataClone);
            }}
          />
        )}
      </Stack>
    </AppLayout>
  );
}

export default ExcelReader;
