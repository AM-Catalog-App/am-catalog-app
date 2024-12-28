import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CssBaseline,
} from "@mui/material";
import amLogo from "../../assets/amLogo1.png";

import colors from "../../styles/colors";
import { login } from "../../services";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password) {
      const response = await login(username, password);
      if (response.message === "Login Successful" && response.user)
        localStorage.setItem("isAdminLoggedIn", "true");
      handleLoginSuccess();
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isAdminLoggedIn", "true"); // Store login status
    navigate("/admin");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: colors.grey[200], // Optional: add a background color
      }}
    >
      <CssBaseline />
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          backgroundColor: colors.white,
          textAlign: "center",
        }}
      >
        {/* Logo on top of the form */}
        <Box sx={{ mb: 2 }}>
          <img
            src={amLogo}
            alt="Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Box>

        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginForm;
