import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode) => {
  const isDark = mode === "dark";

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
        default: isDark ? "#121212" : "#f5f7fb",
        paper: isDark ? "#1e1e1e" : "#ffffff",
      },

      text: {
        primary: isDark ? "#ffffff" : "#1f2937",
        secondary: isDark ? "#bdbdbd" : "#6b7280",
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
      // =========================
      // BUTTON
      // =========================

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
          },
        },
      },

      // =========================
      // CARD
      // =========================

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,

            boxShadow: isDark
              ? "0 4px 20px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px rgba(0, 0, 0, 0.08)",
          },
        },
      },

      // =========================
      // PAPER
      // =========================

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },

      // =========================
      // TEXT FIELD / INPUT
      // =========================

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,

            // Input text
            "& input": {
              color: isDark ? "#ffffff" : "#1f2937",
              caretColor: isDark ? "#ffffff" : "#1976d2",
            },

            // Placeholder
            "& input::placeholder": {
              color: isDark ? "#9e9e9e" : "#6b7280",
              opacity: 1,
            },

            // Normal border
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "#666666"
                : "#c4c4c4",
            },

            // Hover border
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "#bdbdbd"
                : "#555555",
            },

            // Focused border
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
              borderWidth: 2,
            },

            // Disabled
            "&.Mui-disabled input": {
              color: isDark ? "#777777" : "#9e9e9e",
              WebkitTextFillColor: isDark
                ? "#777777"
                : "#9e9e9e",
            },
          },
        },
      },

      // =========================
      // TEXT FIELD LABEL
      // =========================

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? "#bdbdbd" : "#6b7280",

            "&.Mui-focused": {
              color: "#42a5f5",
            },

            "&.Mui-error": {
              color: "#f44336",
            },
          },
        },
      },

      // =========================
      // HELPER TEXT
      // =========================

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: isDark ? "#bdbdbd" : "#6b7280",

            "&.Mui-error": {
              color: "#f44336",
            },
          },
        },
      },

      // =========================
      // INPUT ADORNMENT
      // =========================

      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: isDark ? "#bdbdbd" : "#6b7280",
          },
        },
      },

      // =========================
      // ICON BUTTON
      // =========================

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDark ? "#ffffff" : "#424242",
          },
        },
      },

      // =========================
      // APP BAR
      // =========================

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          },
        },
      },

      // =========================
      // CHIP
      // =========================

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },

      // =========================
      // SELECT
      // =========================

      MuiSelect: {
        styleOverrides: {
          select: {
            color: isDark ? "#ffffff" : "#1f2937",
          },

          icon: {
            color: isDark ? "#bdbdbd" : "#6b7280",
          },
        },
      },
    },
  });
};