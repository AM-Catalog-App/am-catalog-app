import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { getAllCategories } from "../../../../services/catalog";
import styles from "./CategoriesTable.module.css";
import UpdateCategoryImage from "../updateCategoryImage/UpdateCategoryImage";

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedCategoryImageUrl, setSelectedCategoryImageUrl] = useState("");
  const [isUpdateCategoryImageOpen, setUpdateCategoryImageOpen] = useState(false);
  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data);
    });
  }, []);
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
      <Table sx={{ minWidth: 650 }} aria-label="category table">
        <TableHead>
          <TableRow>
            <TableCell>Categories</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {category.imageUrl && (
                  <img src={category?.imageUrl} height="220px" width="160px" alt={category?.name} />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedCategoryName(category.name);
                    setSelectedCategoryImageUrl(category.imageUrl);
                    setUpdateCategoryImageOpen(true);
                  }}
                  className={styles.UpdateButton}
                >
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isUpdateCategoryImageOpen && (
        <UpdateCategoryImage
          categoryName={selectedCategoryName}
          open={isUpdateCategoryImageOpen}
          onClose={() => setUpdateCategoryImageOpen(false)}
          imageUrl={selectedCategoryImageUrl}
          onSuccessfulUpload={(imageUrl) => {
            const categoriesClone = JSON.parse(JSON.stringify(categories));
            for (let index = 0; index < categoriesClone.length; index++) {
              if (categoriesClone[index]['name'] === selectedCategoryName) {
                categoriesClone[index]['imageUrl'] = imageUrl;
                break;
              }
            }
            setCategories(categoriesClone);
          }}
        />
      )}
    </TableContainer>
  );
}
