import { React, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Lightbulb } from "lucide-react";
import py from "../assets/py.svg";
import sql from "../assets/sql.svg";
import pyVid from "../assets/python.webp";
// import rocket_with_tail from "../assets/rocket-tail.png";
// import rocket from "/rocket.fbx";

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
      ref.current.rotation.y += 0.06;
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
      <div className="w-1/5 h-1/2 absolute top-0 right-90 z-10 pointer-events-none">
        {/* The canvas is positioned on the left initially and will be moved to the top-right */}
        <Canvas
          className=" absolute inset-0 z-0"
          camera={{ position: [5, -2, 1] }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 3]} intensity={2} />
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2} // Limit vertical rotation to 90 degrees (X-axis)
            minPolarAngle={Math.PI / 2} // Optionally restrict to tilt range
          />
        </Canvas>
      </div>
      <div className="w-full h-screen grid place-items-center ">
        <div className="w-[70%] h-[90%]py-14">
          <div className="h-10 w-full flex  items-center justify-between px-2">
            <div className="text-4xl flex items-center font-black tracking-tighter">
              <Rocket className="text-blue-700" size={60} />
              igniUp
            </div>
            <button className="flex items-center justify-center gap-x-2 bg-[#3960CC] text-white px-4 py-2 rounded-md text-sm tracking-wide">
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
            </button>
          </div>
          <div className="flex items-center justify-between h-40 w-full px-2 ">
            <div className="flex flex-col items-start justify-center h-full w-1/2">
              <div className="font-black text-3xl">Empowering the</div>
              <div className="font-black text-5xl text-[#284cac]">
                Next Generation
              </div>
              <div className="text-lg font-extrabold">
                of Innovations through Technology and Hands-on Learning.
              </div>
            </div>
          </div>
          <div className="h-100 w-full">
            <div className="flex items-center justify-between w-full h-full px-2 gap-x-4">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 w-1/2 h-full rounded-sm px-2 py-2 flex flex-col justify-between items-center shadow-lg gap-y-1"
                  // initial={{ opacity: 0, y: 50 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.8, delay: idx * 0.3 }}
                >
                  <div className="w-full h-60 rounded-md mx-auto bg-gray-300/60 overflow-hidden">
                    {card.name.toLowerCase() === "python" ? (
                      <img
                      src={pyVid}
                      alt="Description"
                      style={{
                        width: "100%",      
                        height: "100%",     
                        objectFit: "center", 
                      }}
                    />
                    

                      // <video
                      //   src={pyVid}
                      //   autoPlay
                      //   muted
                      //   playsInline
                      //   loop
                      //   onError={(e) => console.error("Video failed to load or play:", e)}
                      //   style={{
                      //     width: "100%",
                      //     height: "100%",
                      //     objectFit: "contain",
                      //   }}
                      // />
                    ) : (
                      <div style={{ width: "100%", height: "100%" }}>
                        {/* Placeholder content when it's not 'python' */}
                        <p>No video available</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-start gap-x-2 w-full px-1">
                    <img
                      src={card.logo}
                      alt={`${card.name} logo`}
                      className=" size-10"
                    />
                    <h2 className="text-2xl font-bold">{card.name}</h2>
                  </div>
                  <p className="px-3">{card.desc}</p>
                  <NavLink
                    to={card.link}
                    className="bg-blue-600 text-white text-center w-full py-1 rounded-md  hover:bg-blue-700 transition"
                  >
                    <p className="leading-8">Get Started</p>
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
