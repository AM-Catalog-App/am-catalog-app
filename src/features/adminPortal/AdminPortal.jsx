import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack } from "@mui/material";
import styles from "./AdminPortal.module.css";
import AMLogo from "../../assets/amLogoLeaf.png";

function AdminPortal() {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      className={styles.AdminPortal}
    >
      <img src={AMLogo} alt="AM Logo" className={styles.AMLogo} />
      <Stack direction="column" alignItems="center" spacing={4}>
        <Typography variant="h1" color="initial">
          Admin Portal
        </Typography>
        <Stack direction="column" spacing={3}>
          <Box className={styles.AdminFeature} onClick={() => navigate('/uploadCatalog')}>
            <Typography variant="body1" color="initial" className={styles.Feature}>
              Upload Catalog
            </Typography>
          </Box>
          <Box className={styles.AdminFeature} onClick={() => navigate('/updateCategory')}>
            <Typography variant="body1" color="initial" className={styles.Feature}>
              Add Category
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default AdminPortal;
