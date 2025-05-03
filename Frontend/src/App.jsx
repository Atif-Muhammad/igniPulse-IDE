import React from "react";
import "./index.css";
import Sidebar from "./Pages/Sidebar";
import PythonPage from "./Pages/PythonIDE";
import SQLPage from "./Pages/sqlIDETwo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Remove useTheme import
import { useTheme } from "./context/ThemeContext";
import LandingPage from "./Pages/LandingPage";
import bgwhite from "../public/bg-saif.svg";
import bgdark from "../public/bgDark.svg";

function AppWrapper() {
  // This component will have access to the theme
  const { darkTheme } = useTheme();

  return (
    <div
      className={`bg-cover bg-no-repeat transition-colors duration-300 ${
        darkTheme ? "bg-gray-900" : "bg-white"
      }`}
      style={{ backgroundImage: `url(${darkTheme ? bgdark : bgwhite})` }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/python" element={<PythonPage />} />
        <Route path="/sql" element={<SQLPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
