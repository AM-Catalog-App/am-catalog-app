import { useState, useRef } from "react";
import {
  CssBaseline,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
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

function AppLayout({ children }) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: colors.light1,
          height: "100%",
          marginBottom: "50px",
          // paddingLeft: "10px",
          // paddingRight: "10px",
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
  const [value, setValue] = useState(0);
  const ref = useRef(null);

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
          showLabels
          value={value}
          sx={{
            backgroundColor: colors.white,
          }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction icon={<HomeIcon />} />
          <BottomNavigationAction icon={<MenuIcon />} />
          <BottomNavigationAction icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
