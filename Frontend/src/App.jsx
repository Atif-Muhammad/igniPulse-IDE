import React from "react";
import "./index.css";
import Sidebar from "./Pages/Sidebar";
import PythonPage from "./Pages/PythonIDE";
import SQLPage from "./Pages/sqlIDETwo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import bg_image from '../public/bg.svg';
import bg_img_2 from '../public/bg-new.svg';
import first from '../public/1.jpeg'
import sec from '../public/2.jpeg'
import bg from '../public/bg-saif.svg'


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/python" element={<PythonPage />} />
            <Route path="/sql" element={<SQLPage />} />
          </Routes>
          
        </div>
      </BrowserRouter>
      
    </>
  );
}

export default App;
