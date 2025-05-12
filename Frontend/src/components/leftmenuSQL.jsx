import {
  Copy,
  ClipboardCheck,
  Moon,
  Sun,
  CheckCheckIcon,
  XIcon,
  MenuIcon,
  HomeIcon,
  RefreshCcw,
} from "lucide-react";
import { React, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";
import config from "../../Config/config";

function LeftMenuSQL({
  handleCopy,
  handlePaste,
  pasteDone,
  copyDone,
  tables,
  getTables,
  views,
  TableDetail,
  setLoadingDB
}) {
  const [showTable, setShowTable] = useState(false);
  const { darkTheme, toggleTheme } = useTheme();

  const handleRefresh = ()=>{
    setLoadingDB(true)
    const unq_id = window.localStorage.unique_id;
    // console.log(unq_id)
    config.refreshTables(unq_id).then(res=>{
      // console.log(res)
      getTables(res.data)
    }).catch(err=>{
      console.log(err)
    }) 
  }

  return (
    <>
      <div
        className={`border-2 w-full lg:w-16 h-13  md:h-16 lg:h-full rounded-lg md:flex-row-reverse overflow-hidden flex lg:flex-col items-center lg:justify-center justify-between lg:py-2  py-7 lg:px-0  px-3 gap-y-0 gap-x-2 lg:gap-y-3 ${
          darkTheme
            ? "border-blue-500 bg-gray-800"
            : "border-sky-700 bg-gray-100"
        }`}
      >
        <div className="flex lg:flex-col justify-between  gap-4 flex-row ">
          {/* Home Button */}
          <NavLink
            to="/"
            className=" flex-col lg:flex hidden items-center justify-center gap-y-1 cursor-pointer"
            data-aos="fade-up"
          >
            <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
              <HomeIcon className="text-white" size={16} />
            </div>
            <p
              className={`text-sm select-none hidden lg:block ${
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
              className={`text-sm  select-none hidden lg:block ${
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
              className={`text-sm select-none hidden lg:block ${
                darkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {pasteDone ? "Pasted" : "Paste"}
            </p>
          </div>

          
          <div
            className="flex flex-col items-center justify-center gap-y-1 cursor-pointer"
            onClick={handleRefresh}
          >
            <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
              <RefreshCcw  className="text-white" size={16} />
            </div>
            <p
              className={`text-sm select-none hidden lg:block ${
                darkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
            </p>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="flex  items-center  justify-center gap-x-2 lg:mt-auto  ml-auto lg:ml-0 md:ml-0">
          {(TableDetail && tables && views) && (
            <>
              <div className="md:hidden lg:hidden flex">
                <button
                  onClick={() => setShowTable(!showTable)}
                  className={`px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer ${
                    darkTheme
                      ? "bg-blue-600 text-white"
                      : "bg-sky-700 text-white"
                  }`}
                >
                  Tables
                  {showTable ? <XIcon size={18} /> : <MenuIcon size={18} />}
                </button>
              </div>
              <div
                className={` transition-all duration-300 ease-in-out ${
                  showTable ? "block" : "hidden pointer-events-none"
                } absolute md:relative z-20 border shadow-lg w-11/12 md:w-[30%] lg:w-[30%] left-1/2 md:left- -translate-x-1/2 md:translate-x-0 top-1/3 rounded-lg md:rounded-none ${
                  darkTheme
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Add close button here */}
                <div
                  className={`flex justify-between items-center p-2 border-b ${
                    darkTheme ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`font-semibold ${
                      darkTheme ? "text-white" : "text-black"
                    }`}
                  >
                    Tables
                  </h3>
                  <button
                    onClick={() => setShowTable(false)}
                    className={`p-1 rounded-full ${
                      darkTheme ? "hover:bg-gray-600" : "hover:bg-gray-200"
                    }`}
                  >
                    <XIcon
                      size={18}
                      className={darkTheme ? "text-white" : "text-black"}
                    />
                  </button>
                </div>
                <div className="max-h-80 overflow-auto">
                  <TableDetail tables={tables} views={views} />
                </div>
              </div>
            </>
          )}

          {/* Home Button */}
          <NavLink
            to="/"
            className="flex flex-col  lg:hidden items-center justify-center gap-y-1 cursor-pointer"
            data-aos="fade-up"
          >
            <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
              <HomeIcon className="text-white" size={16} />
            </div>
            <p
              className={`text-sm select-none hidden lg:block ${
                darkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Home
            </p>
          </NavLink>
          {/* Theme Toggle */}
          <div className="flex flex-col items-center justify-center lg:gap-y-1 cursor-pointer">
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
              className={`text-sm select-none hidden lg:block ${
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

export default LeftMenuSQL;
