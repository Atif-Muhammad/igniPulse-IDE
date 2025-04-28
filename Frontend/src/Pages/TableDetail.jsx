import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function TableDetail({ details }) {
  const [visibleRows, setVisibleRows] = useState({});

  useEffect(() => {}, [details]);

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-50 h-[100%] border-2 border-sky-700 p-1 rounded-lg overflow-hidden">
      {/* Header */}
      <p className="text-[#1E293B] rounded-lg py-3 text-md font-bold text-start px-4 w-full bg-[#E5E7EB] mb-1">
        Tables
      </p>

      {/* Table List */}
      <div className="overflow-auto h-[90%] scrollbar-hide py-1">
        {details.map((detail, index) => (
          <div key={index} className="flex flex-col items-end w-full mb-1">
            {/* Table Name */}
            <div
              className="w-full flex items-center gap-x-2 cursor-pointer select-none py-2 px-3 rounded-md bg-[#0044ff39] hover:bg-[#0044ff51] transition duration-200"
              onClick={() => toggleVisibility(index)}
            >
              {visibleRows[index] ? (
                <Minus size={15} className="text-[#0741df]" />
              ) : (
                <Plus size={15} className="text-[#0741df]" />
              )}
              <p className="text-md text-[#194cd8] tracking-widest font-bold">
                {detail.table}
              </p>
            </div>

            {/* Column Details */}
            {visibleRows[index] &&
              detail.columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="w-[90%] flex items-center gap-x-1 pl-3 overflow-auto py-2 border-l-4 border-[#194cd8] bg-[#E5E7EB] text-gray-500 rounded-r-md mt-1 scrollbar-hide"
                >
                  <span className="font-semibold  text-sm tracking-wide">{col.column}</span>
                  <span className="text-gray-400 text-xs">{`(${col.type})`}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableDetail;
