import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import {ProductDetailExcelSheetColumnNames} from '../../constants/index';

function ExcelReader() {
    const [tableData, setTableData] = useState([]);

    const expectedColumns = ["Product Name", "Size", "Style Code", "Color", "Quantity", "Location", "Barcode", "Tag", "Image", "Description", "Collection", "Categories", "MRP"];

    const findMissingColumns = (columns) => {
        return expectedColumns.filter(col => !columns.includes(col));
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
            const columns = jsonData[0]; // Assuming first row is headers

            const missingColumns = findMissingColumns(columns);
            if (missingColumns.length === 0) {
                const data = XLSX.utils.sheet_to_json(worksheet);
                setTableData(data);
            } else {
                toast.error(`Missing columns: ${missingColumns.join(', ')}`);
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <TableContainer component={Paper}>
                <Table>
                <TableHead>
                    <TableRow>
                        {ProductDetailExcelSheetColumnNames.map((header, index) => (
                        <TableCell key={index}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                        {ProductDetailExcelSheetColumnNames.map((header, colIndex) => (
                            <TableCell key={colIndex}>{row[header]}</TableCell>
                        ))}
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <ToastContainer />
        </div>
    );
}

export default ExcelReader;