import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AMLogoLeaf from "../../assets/amLogoLeaf.png";
import styles from "./UpdateCategory.module.css";
import CategoriesTable from "./childComponents/updateCategoryTable/CategoriesTable";
import AppLayout from "../AppLayout/AppLayout";

function UpdateCategory() {
  const [inputKey, setInputKey] = useState(Date.now());
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setInputKey(Date.now());
  };
  return (
    <AppLayout>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        className={styles.UploadCatalog}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
        >
          <Typography variant="h1" color="initial">
            Update Category
          </Typography>
          <img src={AMLogoLeaf} alt="AM Logo" className={styles.AMLogoLeaf} />
        </Stack>
        <CategoriesTable />
      </Stack>
    </AppLayout>
  );
}

export default UpdateCategory;
