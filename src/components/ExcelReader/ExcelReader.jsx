import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { PRODUCT_DETAIL_EXCEL_COLUMN_NAMES } from "../../constants/index";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { capitalizeFirstLetter } from '../../utils/index';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { bulkUploadProducts } from '../../services/constants';

function ExcelReader() {
    const [tableData, setTableData] = useState([]);
    const [imageUploads, setImageUploads] = useState({});
    const [uploadResponse, setUploadResponse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const findMissingColumns = (columns) => {
        return PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.filter(col => !columns.includes(col));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        // Validate file type
        const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a valid Excel file (.xls or .xlsx)');
            return; // Exit the function if file is not an Excel file
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const columns = jsonData[0].map(header => header.toLowerCase());
    
            const missingColumns = findMissingColumns(columns);
            if (missingColumns.length === 0) {
                // Process data to convert keys to lowercase
                const data = XLSX.utils.sheet_to_json(worksheet).map(row => {
                    let newRow = {};
                    Object.keys(row).forEach(key => {
                        newRow[key.toLowerCase()] = row[key];
                    });
                    return newRow;
                });
                setTableData(data);
            } else {
                toast.error(`Missing columns: ${missingColumns.join(', ')}`);
            }
        };
        reader.readAsBinaryString(file);
    };
    

    const handleImageUpload = (rowIndex, event) => {
        console.log(rowIndex, "imageUploads");
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImageUploads(prev => {
                    const newRowImages = prev[rowIndex] ? [...prev[rowIndex], base64String] : [base64String];
                    return { ...prev, [rowIndex]: newRowImages };
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleBulkUpload = async () => {
        try {
            const response = await bulkUploadProducts(tableData);
            setUploadResponse(response); // Set the response data
            setIsModalOpen(true); // Open the modal
            toast.success('Products processed');
        } catch (error) {
            toast.error('Failed to upload products');
            console.error('Upload error:', error);
        }
    };    

    const renderModalContent = () => (
        <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
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
                        {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map((header, index) => (
                            header !== "Image" && <TableCell key={index}>{capitalizeFirstLetter(header)}</TableCell>
                        ))}
                        <TableCell>Upload Image</TableCell> {/* New Column Header */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {PRODUCT_DETAIL_EXCEL_COLUMN_NAMES.map((header, colIndex) => (
                                    header !== "Image" && <TableCell key={colIndex}>{row[header]}</TableCell>
                                ))}
                            <TableCell>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`icon-button-file-${rowIndex}`}
                                    type="file"
                                    multiple
                                    onChange={(e) => handleImageUpload(rowIndex, e)}
                                />
                                <label htmlFor={`icon-button-file-${rowIndex}`}>
                                    <IconButton color="primary" aria-label="upload pictures" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                {imageUploads[rowIndex] && imageUploads[rowIndex].map((imageData, index) => (
                                    <img key={index} src={imageData} alt={`Uploaded ${index}`} style={{ height: '50px', marginRight: '5px' }} />
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <ToastContainer />
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {renderModalContent()}
            </Modal>
        </div>
    );
}

export default ExcelReader;