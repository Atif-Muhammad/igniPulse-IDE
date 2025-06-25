import React from "react";
import "./index.css";
import Sidebar from "./Pages/Sidebar";
import PythonPage from "./Pages/PythonIDE";
import SQLPage from "./Pages/sqlIDETwo";
import Authentication from "./Pages/authentication/Authentication";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Remove useTheme import
import { useTheme } from "./context/ThemeContext";
import LandingPage from "./Pages/LandingPage";
import bgwhite from "../public/bg-saif.svg";
import bgdark from "../public/bgDark.svg";
import { useQuery } from "@tanstack/react-query";
import config from "../Config/config";
import { Profile } from "./Pages/Profile";

function AppWrapper() {
  // This component will have access to the theme
  const { darkTheme } = useTheme();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await config.me();
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div
      className={`bg-cover bg-no-repeat transition-colors duration-300 ${
        darkTheme ? "bg-gray-900" : "bg-white"
      }`}
      style={{ backgroundImage: `url(${darkTheme ? bgdark : bgwhite})` }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/authentication" element={<Authentication />} />
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
