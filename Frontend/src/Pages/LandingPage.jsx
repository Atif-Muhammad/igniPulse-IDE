import { React, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Rocket, Moon, Sun } from "lucide-react";
import py from "../assets/py.svg";
import sql from "../assets/sql.svg";
import pyVid from "../assets/python.webp";
import sqlVid from "../assets/sql.webp";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import { useLoader, useFrame } from "@react-three/fiber";
import { useTheme } from "../context/ThemeContext";

function Model() {
  const fbx = useLoader(FBXLoader, "/rocket.fbx");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.021;
      ref.current.rotation.x = Math.PI / -6;
    }
  });

  return (
    <group ref={ref} scale={0.012} position={[0, 0, 0]}>
      <primitive object={fbx} />
    </group>
  );
}

const LandingPage = () => {
  const { darkTheme, toggleTheme } = useTheme();

  const cards = [
    {
      name: "Python",
      desc: "An easy-to-use Python setup for beginners. Write and run your code, build projects, and learn programming basics step by step.",
      link: "/python",
      logo: py,
    },
    {
      name: "SQL",
      desc: "A simple tool to learn how to work with databases. Practice writing queries, explore tables, and understand how data is stored and managed.",
      link: "/sql",
      logo: sql,
    },
  ];

  return (
    <>
      {/* Rocket Canvas */}
      <div className="md:block md:w-1/5 md:h-1/2 h-1/3 absolute lg:top-3 md:top-3 -top-8 lg:right-90 md:right-90 -right-10 z-10 pointer-events-none">
        <Canvas
          className="absolute inset-0 z-0"
          camera={{ position: [5, -2, 1] }}
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
            <div className="flex gap-4">
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
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`w-full md:w-1/2 h-full rounded-sm px-4 py-4 flex flex-col justify-between items-center shadow-lg gap-y-2 transition-colors duration-300 ${
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
                    {card.name.toLowerCase() === "python" ? (
                      <img
                        src={pyVid}
                        alt="Python tutorial"
                        className="w-full h-full "
                      />
                    ) : card.name.toLowerCase() === "sql" ? (
                      <img
                        src={sqlVid}
                        alt="SQL tutorial"
                        className="w-full h-full "
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
