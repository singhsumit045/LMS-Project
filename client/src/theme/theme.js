import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#1976d2",
        dark: "#125ca1",
        light: "#42a5f5",
        contrastText: "#ffffff",
      },

      secondary: {
        main: "#7b1fa2",
        dark: "#4a148c",
        light: "#ba68c8",
        contrastText: "#ffffff",
      },

      background: {
        default: mode === "dark" ? "#121212" : "#f5f7fb",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },

      text: {
        primary: mode === "dark" ? "#ffffff" : "#1f2937",
        secondary: mode === "dark" ? "#bdbdbd" : "#6b7280",
      },

      success: {
        main: "#2e7d32",
      },

      warning: {
        main: "#ed6c02",
      },

      error: {
        main: "#d32f2f",
      },
    },

    typography: {
      fontFamily: "Roboto, Arial, sans-serif",

      h1: {
        fontWeight: 700,
      },

      h2: {
        fontWeight: 700,
      },

      h3: {
        fontWeight: 700,
      },

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      h6: {
        fontWeight: 600,
      },

      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },

    shape: {
      borderRadius: 10,
    },

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 20px",
            fontWeight: 600,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                : "0 4px 20px rgba(0, 0, 0, 0.08)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
    },
  });
};