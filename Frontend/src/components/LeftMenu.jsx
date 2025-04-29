import {
  Copy,
  ClipboardCheck,
  Moon,
  CheckCheckIcon,
  XIcon,
  MenuIcon,
} from "lucide-react";
import { React, useState } from "react";

function LeftMenu({
  handleCopy,
  handlePaste,
  pasteDone,
  copyDone,
  TableDetail,
  details,
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <>
      <div className="border-2 border-sky-700 w-full md:w-16 h-13 md:h-full rounded-lg overflow-hidden flex md:flex-col items-center justify-center lg:py-2 md:py-2 py-7 lg:px-0 md:px-0 px-2 gap-y-0 gap-x-2 md:gap-y-3">
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
          <p className="text-black lg:text-xs md:text-sm hidden font-thin select-none">
            {copyDone ? <>Copied</> : <>Copy</>}
          </p>
        </div>

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
          <p className="text-black lg:text-xs md:text-sm hidden font-thin select-none">
            {pasteDone ? <>Pasted</> : <>Paste</>}
          </p>
        </div>
        <div className="flex items-center justify-center gap-x-2 lg:mt-auto md:mt-auto ml-auto lg:ml-0 md:ml-0">
          {TableDetail && details && (
            <>
              <div className="md:hidden lg:hidden flex ">
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="text-white bg-sky-700 px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
                >
                  {showTable ? <XIcon size={18} /> : <MenuIcon size={18} />}
                  Table Info
                </button>
              </div>
              <div
                className={`
                  transition-all duration-300 ease-in-out
                  ${showTable ? "block" : "hidden pointer-events-none"}
                  absolute md:relative z-20 bg-white border shadow-lg w-11/12 md:w-[30%] lg:w-[30%] left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 top-1/3
                  rounded-lg md:rounded-none
                `}
              >
                <div className="max-h-80 overflow-auto">
                  {" "}
                  <TableDetail details={details} />
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer">
            <div className="flex items-center justify-center p-3.5 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full">
              <Moon className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftMenu;
