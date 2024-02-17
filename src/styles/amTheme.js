
import { createTheme } from '@mui/material/styles';

const amTheme = createTheme({
    palette: {
        primary: {
            main: '#1976D2',
        },
        secondary: {
            main: '#f50057',
        },
        // Add other palette options as needed
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 450,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    spacing: 8, // Adjust the base spacing unit
});

export default amTheme;
