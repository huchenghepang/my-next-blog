"use client"
import {createTheme} from "@mui/material/styles"

const theme = createTheme({
  colorSchemes: {light: true, dark: true},
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: {severity: "info"},
              style: {
                backgroundColor: "#60a5fa",
              },
            },
          ],
        },
      },
    },
  },
})

export default theme
