import {
  Copy,
  ClipboardCheck,
  Moon,
  Sun,
  CheckCheckIcon,
  HomeIcon,
} from "lucide-react";
import { React, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

function LeftMenu({ handleCopy, handlePaste, pasteDone, copyDone }) {
  const { darkTheme, toggleTheme } = useTheme();

  return (
    <>
      <div
        className={`border-2 w-full md:w-16  h-13 md:h-full rounded-lg overflow-hidden flex md:flex-col items-center justify-center lg:py-2 md:py-2 py-7 lg:px-0 md:px-0 px-2 gap-y-0 gap-x-2 md:gap-y-3 ${
          darkTheme
            ? "border-blue-500 bg-gray-800"
            : "border-sky-700 bg-gray-100"
        }`}
      >
        {/* Home Button */}
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-y-1 cursor-pointer"
          data-aos="fade-up"
        >
          <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
            <HomeIcon className="text-white" size={16} />
          </div>
          <p
            className={`text-sm select-none hidden md:block ${
              darkTheme ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Home
          </p>
        </NavLink>

        {/* Copy Button */}
        <div
          className="flex flex-col items-center justify-center gap-y-1 cursor-pointer"
          onClick={handleCopy}
        >
          <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
            {copyDone ? (
              <CheckCheckIcon className="text-white" size={16} />
            ) : (
              <Copy className="text-white" size={16} />
            )}
          </div>
          <p
            className={`text-sm  select-none hidden md:block ${
              darkTheme ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {copyDone ? "Copied" : "Copy"}
          </p>
        </div>

        {/* Paste Button */}
        <div
          className="flex flex-col items-center justify-center gap-y-1 cursor-pointer"
          onClick={handlePaste}
        >
          <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
            {pasteDone ? (
              <CheckCheckIcon className="text-white" size={16} />
            ) : (
              <ClipboardCheck className="text-white" size={18} />
            )}
          </div>
          <p
            className={`text-sm select-none hidden md:block ${
              darkTheme ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {pasteDone ? "Pasted" : "Paste"}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex  items-center justify-center gap-x-2 lg:mt-auto md:mt-auto ml-auto lg:ml-0 md:ml-0">
          {/* Theme Toggle */}
          <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer">
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
            <p
              className={`text-sm select-none hidden md:block ${
                darkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {darkTheme ? "Light" : "Dark"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftMenu;
