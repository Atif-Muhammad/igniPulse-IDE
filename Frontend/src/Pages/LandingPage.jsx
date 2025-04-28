import { React, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Lightbulb } from "lucide-react";
import py from "../assets/py.svg";
import sql from "../assets/sql.svg";
import pyVid from "../assets/python.webp";
import sqlVid from "../assets/sql.webp";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

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
      {/* Rocket Canvas - Hidden on mobile, visible from md screens up */}
      <div className="hidden md:block md:w-1/5 md:h-1/2 absolute top-3 right-90 z-10  pointer-events-none">
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
            <div className="text-3xl md:text-4xl flex items-center font-black tracking-tighter">
              <Rocket className="text-blue-700" size={40} />
              igniUp
            </div>
            {/* <button className="flex items-center justify-center gap-x-2 bg-[#3960CC] text-white px-4 py-2 rounded-md text-sm tracking-wide">
              About Us{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#3960CC"
                stroke="#ffffff"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rounded-sm bg-white"
              >
                <path d="M6 9h6V5l7 7-7 7v-4H6V9z" />
              </svg>
            </button> */}
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-start justify-between w-full mb-8 md:mb-12">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="font-black text-2xl md:text-3xl">
                Empowering the
              </div>
              <div className="font-black text-4xl md:text-5xl text-[#284cac]">
                Next Generation
              </div>
              <div className="text-base md:text-lg font-extrabold">
                of Innovations through Technology and Hands-on Learning.
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gray-200 w-full md:w-1/2 h-full rounded-sm px-4 py-4 flex flex-col justify-between items-center shadow-lg gap-y-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.3 }}
                >
                  <div className="w-full h-40 sm:h-48 md:h-60 rounded-md mx-auto bg-gray-300/60 overflow-hidden">
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
                  <p className="w-full text-sm md:text-base">{card.desc}</p>
                  <NavLink
                    to={card.link}
                    className="bg-blue-600 text-white text-center w-full py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <p>Get Started</p>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage