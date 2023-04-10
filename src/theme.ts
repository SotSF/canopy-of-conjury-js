import { createTheme } from "@mui/material/styles";
import { grey, blue } from "@mui/material/colors";

// Taken from @mui/material/styles/shadows (shadows[3])
const boxShadow = `
  0px 3px 3px -2px rgba(0,0,0,0.2),
  0px 3px 4px 0px rgba(0,0,0,0.14),
  0px 1px 8px 0px rgba(0,0,0,0.12)`.trim();

export default createTheme({
  palette: {
    primary: grey,
    secondary: blue,
    mode: "dark",
  },

  /** Material UI overrides */
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow,
        },
        // raised: {
        //   boxShadow: shadows[11],
        // },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: grey[800],
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          alignItems: "center",
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          minHeight: "16px",
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
        },
      },
    },
  },
});
