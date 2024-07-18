import Dashboard from "./pages/Dashboard";
import "./styles.css";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ height: "100%" }}>
        <Dashboard />
      </Container>
    </ThemeProvider>
  );
}
