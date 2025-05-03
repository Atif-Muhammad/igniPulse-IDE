import { FileCode2, Download, Rocket } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useTheme } from "../context/ThemeContext";

function NavBar({ openFile, handleDownload }) {
  // Add this inside your component
  const { darkTheme } = useTheme();
  const navBtnText = [
    {
      text: "Open Script",
      icon: <FileCode2 className="text-white" size={18} />,
      action: openFile,
    },
    {
      text: "Save Script",
      icon: <Download className="text-white" size={18} />,
      action: handleDownload,
    },
  ];
  return (
    <div
      className={`w-full lg:h-[10%] md:h-[10%] h-[8%] rounded-xl border-2 border-sky-700 overflow-hidden flex flex-row items-center justify-center lg:px-3 py-2 md:px-2 px-2 ${
        darkTheme ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div className="w-full md:w-1/2 flex items-center  md:justify-start gap-x-1 px-1">
        <Rocket
          className={`text-blue-600 ${
            darkTheme ? "text-blue-200" : "text-blue-600"
          }`}
          size={28}
        />
        <p
          className={`text-xl font-black ${
            darkTheme ? "text-white" : "text-black"
          }`}
        >
          igniUp
        </p>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-end gap-x-2">
        {navBtnText?.map((btn, index) => (
          <Button
            key={index}
            classNames="cursor-pointer flex items-center justify-center lg:gap-x-2 md:gap-x-2 gap-x-1 py-2  text-white font-semibold bg-[#2E60EB] lg:px-4 md:px-4 px-2 hover:bg-[#1f4bc6e0] rounded-lg text-sm md:text-base py-1"
            action={btn.action}
            text={btn.text}
            icon={btn.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default NavBar;
