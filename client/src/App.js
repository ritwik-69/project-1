import { CssBaseline,ThemeProvider } from "@mui/material";
import {createTheme} from "@mui/material/styles"
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout"
import Dashboard from "scenes/dashboard"
import Product from "scenes/products"
import { useSelector } from "react-redux";
import Customers from "scenes/customers";

function App() {
  //setting up redux
  const mode = useSelector((state) => state.global.mode);
  // setting up MUI
  const theme = useMemo(() => createTheme(themeSettings(mode),[mode]))
  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* this is so that Layout component has navbar and sidebar always */}
          <Route element={<Layout/>} >
            <Route path="/" element={<Navigate to="/dashboard" replace/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/products" element={<Product/>} />
            <Route path="/customers" element={<Customers />} />

            </Route>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
