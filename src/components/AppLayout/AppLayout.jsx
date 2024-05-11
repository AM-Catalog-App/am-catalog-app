import { useState, useRef, useEffect } from "react";
import {
  CssBaseline,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Typography,
  //   Container,
  //   List,
  //   ListItemButton,
  //   ListItemAvatar,
  //   ListItemText,
  //   Avatar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import colors from "../../styles/colors";
import { useNavigate, useLocation } from "react-router-dom";

function AppLayout({ children }) {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: colors.white,
          height: "100%",
          marginBottom: "50px",
        }}
      >
        {children}
      </Box>
      <FixedBottomNavigation />
    </>
  );
}

export default AppLayout;

export function FixedBottomNavigation() {
  const location = useLocation();

  const [value, setValue] = useState("");

  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the current pathname from the location
    let { pathname } = location;
    pathname = pathname.replace("/", "");

    // Set the value based on the pathname
    setValue(pathname === "out-of-stock" ? pathname : "catalog");
  }, [location]);

  const handleNavigate = (pageLink) => {
    navigate(`/${pageLink}`);
  };

  return (
    <Box sx={{ pb: 5 }} ref={ref}>
      <CssBaseline />

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation
          // showLabels
          value={value}
          sx={{
            backgroundColor: colors.white,
          }}
          onChange={(event, newValue) => {
            setValue(newValue);
            handleNavigate(newValue);
          }}
        >
          <BottomNavigationAction
            label={<Typography variant="body2">Catalog</Typography>}
            icon={<HomeIcon />}
            value={"catalog"}
          />
          <BottomNavigationAction
            label={<Typography variant="body2">Customs</Typography>}
            icon={<MenuIcon />}
            value={"out-of-stock"}
          />
          <BottomNavigationAction
            label={<Typography variant="body2">Admin</Typography>}
            icon={<AccountCircleIcon />}
            value={"admin"}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
