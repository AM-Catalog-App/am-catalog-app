
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
        h1: {
            fontWeight: 600,
            fontSize: '2.188rem', // 35px converted to rem
            lineHeight: 1.2,
            letterSpacing: '0.022rem', // 0.8px converted to rem
            '@media (min-width:0px)': { // xs
                fontSize: '1.75rem', // 28px converted to rem
            },
            '@media (min-width:450px)': { // sm
                fontSize: '2rem', // 32px converted to rem
            },
            '@media (min-width:960px)': { // md
                fontSize: '2.188rem', // 35px converted to rem
            },
            '@media (min-width:1280px)': { // lg
                fontSize: '2.375rem', // 38px converted to rem
            },
            '@media (min-width:1920px)': { // xl
                fontSize: '2.625rem', // 42px converted to rem
            },
        },
        // Add other typography variants as needed
    },
    h2: {
        fontWeight: 600,
        fontSize: '1.875rem', // 30px converted to rem
        lineHeight: 1.25,
        letterSpacing: '0.015rem', // 0.6px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '1.5rem', // 24px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '1.75rem', // 28px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1.875rem', // 30px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '2rem', // 32px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '2.25rem', // 36px converted to rem
        },
    },
    h3: {
        fontWeight: 600,
        fontSize: '1.5rem', // 24px converted to rem
        lineHeight: 1.3,
        letterSpacing: '0.01rem', // 0.4px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '1.25rem', // 20px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '1.375rem', // 22px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1.5rem', // 24px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '1.625rem', // 26px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1.75rem', // 28px converted to rem
        },
    },
    h4: {
        fontWeight: 600,
        fontSize: '1.25rem', // 20px converted to rem
        lineHeight: 1.35,
        letterSpacing: '0.008rem', // 0.32px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '1.125rem', // 18px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '1.188rem', // 19px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1.25rem', // 20px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '1.313rem', // 21px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1.375rem', // 22px converted to rem
        },
    },
    h5: {
        fontWeight: 600,
        fontSize: '1.125rem', // 18px converted to rem
        lineHeight: 1.4,
        letterSpacing: '0.006rem', // 0.24px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '1rem', // 16px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '1.063rem', // 17px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1.125rem', // 18px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '1.188rem', // 19px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1.25rem', // 20px converted to rem
        },
    },
    h6: {
        fontWeight: 600,
        fontSize: '1rem', // 16px converted to rem
        lineHeight: 1.45,
        letterSpacing: '0.004rem', // 0.16px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '0.875rem', // 14px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '0.938rem', // 15px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1rem', // 16px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '1.063rem', // 17px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1.125rem', // 18px converted to rem
        },
    },
    body1: {
        fontSize: '1rem', // 16px converted to rem
        lineHeight: 1.5,
        letterSpacing: '0.004rem', // 0.16px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '0.875rem', // 14px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '0.938rem', // 15px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '1rem', // 16px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '1.063rem', // 17px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1.125rem', // 18px converted to rem
        },
    },
    body2: {
        fontSize: '0.875rem', // 14px converted to rem
        lineHeight: 1.6,
        letterSpacing: '0.002rem', // 0.08px converted to rem
        '@media (min-width:0px)': { // xs
            fontSize: '0.75rem', // 12px converted to rem
        },
        '@media (min-width:450px)': { // sm
            fontSize: '0.813rem', // 13px converted to rem
        },
        '@media (min-width:960px)': { // md
            fontSize: '0.875rem', // 14px converted to rem
        },
        '@media (min-width:1280px)': { // lg
            fontSize: '0.938rem', // 15px converted to rem
        },
        '@media (min-width:1920px)': { // xl
            fontSize: '1rem', // 16px converted to rem
        },
    },

    spacing: [0, 4, 8, 16, 32, 64], // Adjust the base spacing unit
});

export default amTheme;
