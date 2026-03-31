"use client"
import {createTheme} from "@mui/material/styles"

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#f59e0b", // 琥珀色 - 温暖的主色调
          light: "#fbbf24", // 亮琥珀
          dark: "#d97706", // 深琥珀
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#8b5cf6", // 紫色 - 点缀色
          light: "#a78bfa",
          dark: "#6d28d9",
        },
        background: {
          default: "#fafafa", // 浅灰背景
          paper: "#ffffff", // 卡片白色背景
        },
        text: {
          primary: "#1f2937", // 深灰文字
          secondary: "#4b5563", // 中灰文字
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#fbbf24", // 亮琥珀
          light: "#fcd34d",
          dark: "#f59e0b",
        },
        secondary: {
          main: "#a78bfa",
          light: "#c4b5fd",
          dark: "#8b5cf6",
        },
        background: {
          default: "#111827", // 深色背景
          paper: "#1f2937", // 深色卡片
        },
        text: {
          primary: "#f9fafb",
          secondary: "#d1d5db",
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "inherit",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          variants: [
            {
              props: {severity: "info"},
              style: {
                backgroundColor: "#60a5fa",
              },
            },
            {
              props: {severity: "success"},
              style: {
                backgroundColor: "#34d399",
              },
            },
            {
              props: {severity: "warning"},
              style: {
                backgroundColor: "#fbbf24",
              },
            },
            {
              props: {severity: "error"},
              style: {
                backgroundColor: "#f87171",
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid",
          borderBottomColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#f59e0b",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
})

export default theme
