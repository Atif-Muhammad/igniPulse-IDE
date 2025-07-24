import { React, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Rocket, Moon, Sun, User } from "lucide-react";
import py from "../assets/py.svg";
import sql from "../assets/sql.svg";
import HTML from "../assets/HTML.webp";
import pyVid from "../assets/python.webp";
import sqlVid from "../assets/sql.webp";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import { useLoader, useFrame } from "@react-three/fiber";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import DataScience from "../assets/DataScience.webp";
import { useQueryClient } from "@tanstack/react-query";

function Model() {
  const fbx = useLoader(FBXLoader, "/rocket.fbx");
  const ref = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.09); // default slow spin
  const friction = 0.98; // decays swipe spin slowly

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed;
      ref.current.rotation.x = Math.PI / -6;

      // Gradually slow down if spinning from swipe
      if (!isHovered) {
        setRotationSpeed(
          (prev) => Math.sign(prev) * Math.max(Math.abs(prev) * friction, 0.01)
        );
      }
    }
  });

  const handlePointerMove = (e) => {
    if (!isHovered || !ref.current) return;

    const currentX = e.clientX;
    if (lastMouseX !== null) {
      const deltaX = currentX - lastMouseX;
      const speed = deltaX * 0.005; // Sensitivity multiplier
      setRotationSpeed(speed); // Set fast rotation based on swipe
    }
    setLastMouseX(currentX);
  };

  return (
    <group
      ref={ref}
      scale={0.009}
      position={[0, 0, 0]}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => {
        setIsHovered(false);
        setLastMouseX(null);
      }}
      onPointerMove={handlePointerMove}
    >
      <primitive object={fbx} />
    </group>
  );
}

const LandingPage = () => {
  const { darkTheme, toggleTheme } = useTheme();

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"])?.data;
  // console.log(currentUser)

  const cards = [
    {
      id: "gen",
      name: "Python for Beginners",
      desc: "An easy-to-use Python setup for beginners. Write and run your code, build projects, and learn programming basics step by step.",
      link: "/python",
      logo: py,
    },
    {
      id: "sql",
      name: "SQL",
      desc: "A simple tool to learn how to work with databases. Practice writing queries, explore tables, and understand how data is stored and managed.",
      link: "/sql",
      logo: sql,
    },
    {
      id: "ds",
      name: "Python for Data Science",
      desc: "Learn Python for Data Science with ease. Analyze data, visualizations, and build machine learning models using real-world datasets step by step.",
      link: "/python",
      logo: py,
    },
    {
      id: "html",
      name: "HTML",
      desc: "An easy-to-use HTML for beginners. Write and preview your HTML code instantly. Build web pages, experiment with tags, and learn step by step.",
      link: "/html",
      logo: HTML,
    },
  ];

  return (
    <>
      {/* Rocket Canvas */}
      <div className="md:block md:w-1/2   md:h-1/2   h-1/3 absolute lg:top-3 md:top-5 top-28  md:right-20 -right-10  z-10 pointer-events-none">
        <Canvas
          className="absolute inset-0   z-0"
          camera={{ position: [3, -2, 1] }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 3]} intensity={2} />
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 md:py-8">
        <div className="w-full md:w-[90%] lg:w-[70%]">
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-2 md:mb-7">
            <div
              className={`text-3xl md:text-4xl flex items-center font-black tracking-tighter ${
                darkTheme ? "text-white" : "text-black"
              }`}
            >
              <Rocket
                className={`${darkTheme ? "text-blue-400" : "text-blue-700"}`}
                size={40}
              />
              igniUp
            </div>
            <div className="flex relative z-50 gap-4 items-center justify-center">
              <div
                className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full cursor-pointer"
                onClick={toggleTheme}
              >
                {darkTheme ? (
                  <Sun className="text-white" size={16} />
                ) : (
                  <Moon className="text-white" size={16} />
                )}
              </div>
              {currentUser?.id ? (
                <NavLink
                  to="/profile"
                  className={`${
                    darkTheme ? "bg-white" : "bg-black"
                  } p-2 rounded-full`}
                >
                  <User
                    className={`${darkTheme ? "text-black" : "text-white"}`}
                  />
                </NavLink>
              ) : (
                <NavLink
                  to="/authentication"
                  className={`${
                    darkTheme
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                  } px-5 py-2 rounded-full shadow-md font-semibold transition-all duration-300`}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-start justify-between w-full mb-8 md:mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div
                className={`font-black text-2xl md:text-3xl ${
                  darkTheme ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Empowering the
              </div>
              <div
                className={`font-black text-4xl md:text-5xl ${
                  darkTheme ? "text-blue-400" : "text-[#284cac]"
                }`}
              >
                Next Generation
              </div>
              <div
                className={`text-base md:text-lg font-extrabold ${
                  darkTheme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                of Innovations through Technology and Hands-on Learning.
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`h-full flex flex-col justify-between items-center rounded-sm px-4 py-4 shadow-lg gap-y-2 transition-colors duration-300 ${
                    darkTheme
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div
                    className={`w-full h-40 sm:h-48 md:h-60 rounded-md mx-auto overflow-hidden transition-colors duration-300 ${
                      darkTheme ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    {card.id.toLowerCase() === "gen" ? (
                      <img
                        src={pyVid}
                        alt="Python tutorial"
                        className="w-full h-full "
                      />
                    ) : card.id.toLowerCase() === "sql" ? (
                      <img
                        src={sqlVid}
                        alt="SQL tutorial"
                        className="w-full h-full "
                      />
                    ) : card.id.toLowerCase() === "ds" ? (
                      <img
                        src={DataScience}
                        alt="python datascience video"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p>No video available</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-start gap-x-2 w-full">
                    <img
                      src={card.logo}
                      alt={`${card.name} logo`}
                      className="size-8 md:size-10"
                    />
                    <h2 className="text-xl md:text-2xl font-bold">
                      {card.name}
                    </h2>
                  </div>
                  <p
                    className={`w-full text-sm md:text-base ${
                      darkTheme ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {card.desc}
                  </p>
                  <NavLink
                    to={card.link}
                    state={card.id === "ds" ? "ds" : "gen"}
                    className="bg-blue-600 text-white text-center w-full py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <p>Get Started</p>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
