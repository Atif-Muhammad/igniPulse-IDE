import { FileCode2, Download, Rocket } from "lucide-react";
import React from "react";
import Button from "./Button";

function NavBar({ openFile, handleDownload }) {
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
    <div className="w-full h-[10%] rounded-xl bg-gray-100 border-2 border-sky-700 overflow-hidden flex flex-row items-center justify-between px-2">
      <div className="w-1/2 h-full flex items-center justify-start px-5 gap-x-2">
        <Rocket className="text-blue-600" size={22} />{" "}
        <p className="text-lg font-black">igniUp</p>
      </div>
      <div className="w-1/2 h-full flex items-center justify-end gap-x-2">
        {navBtnText?.map((btn, index) => (

          <Button classNames=" cursor-pointer flex items-center justify-center gap-x-2 py-2 text-white font-semibold bg-[#2E60EB] px-4 hover:bg-[#1f4bc6e0] rounded-lg"
          action={btn.action} text={btn.text} icon={btn.icon} /> 
        ))}
      </div>
    </div>
  );
}

export default NavBar;
