import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function TableDetail({ tables = [], views = [] }) {
  const [visibleRows, setVisibleRows] = useState({});

  const [showTables, setShowTables] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const { darkTheme } = useTheme();


  useEffect(() => {}, [tables , views ]);

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sectionToggleStyle = `flex items-center gap-x-2 px-3 py-1.5 rounded-md cursor-pointer mb-1 ${
    darkTheme
      ? "bg-blue-800 hover:bg-blue-900 text-blue-200"
      : "bg-[#dbeafe] hover:bg-[#bfdbfe] text-blue-900"
  }`;

  const sectionHeader = (label, show, toggle) => (
    <div onClick={toggle} className={sectionToggleStyle}>
      {show ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      <p className="text-sm font-semibold tracking-wide">{label}</p>
    </div>
  );

  const renderDetails = (data, offset = 0) =>
    data.map((detail, index) => (
      <div key={index + offset} className="flex flex-col items-end w-full mb-1 ms-4">
        
        <div
          className={`w-full flex items-center gap-x-2 cursor-pointer select-none py-2 px-3 rounded-md hover:bg-opacity-80 transition duration-200 ${
            darkTheme
              ? "bg-blue-900 bg-opacity-40 hover:bg-blue-900"
              : "bg-[#0044ff39] hover:bg-[#0044ff51]"
          }`} 
          onClick={() => toggleVisibility(index + offset)}
        >
          {visibleRows[index + offset] ? (
            <Minus size={15} className={darkTheme ? "text-blue-300" : "text-[#0741df]"} />
          ) : (
            <Plus size={15} className={darkTheme ? "text-blue-300" : "text-[#0741df]"} />
          )}
          <p
            className={`text-sm tracking-widest font-bold ${
              darkTheme ? "text-blue-300" : "text-[#194cd8]"
            }`}
          >
            {detail.table}
          </p>
        </div>

        {/* Columns */}
        {visibleRows[index + offset] &&
          detail.columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`w-[95%] flex items-center gap-x-1 pl-3 overflow-auto py-2 border-l-4 rounded-r-md mt-1 scrollbar-hide ${
                darkTheme
                  ? "border-blue-400 bg-gray-700 text-gray-300"
                  : "border-[#194cd8] bg-[#E5E7EB] text-gray-500"
              }`}
            >
              <span className="font-semibold text-sm tracking-wide">{col.column}</span>
              <span className={`text-xs ${darkTheme ? "text-gray-400" : "text-gray-500"}`}>
                {`(${col.type})`}
              </span>
            </div>
          ))}
      </div>
    ));

  return (
    <div
      className={`w-full h-full border-2 p-2 rounded-lg overflow-auto ${
        darkTheme
          ? "border-blue-500 bg-gray-800 text-gray-200"
          : "border-sky-700 bg-gray-100 text-gray-800"
      }`}
    >
      <div className="overflow-auto max-h-[75vh] scrollbar-hide py-1">
        {/* Tables Section */}
        {sectionHeader("Tables", showTables, () => setShowTables((prev) => !prev))}
        {showTables && renderDetails(tables, 0)}

        {/* Views Section */}
        {sectionHeader("Views", showViews, () => setShowViews((prev) => !prev))}
        {showViews && renderDetails(views, tables.length)}
      </div>

      {/* Show message if no tables exist */}
      {details.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p
            className={`text-lg font-medium ${
              darkTheme ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No tables found
          </p>
        </div>
      ) : (
        <>
          {/* Table List */}
          <div className="overflow-auto max-h-[75vh] scrollbar-hide py-1">
            {details.map((detail, index) => (
              <div key={index} className="flex flex-col items-end w-full mb-1">
                {/* Table Name */}
                <div
                  className={`w-full flex items-center gap-x-2 cursor-pointer select-none py-2 px-3 rounded-md hover:bg-opacity-80 transition duration-200 ${
                    darkTheme
                      ? "bg-blue-900 bg-opacity-40 hover:bg-blue-900"
                      : "bg-[#0044ff39] hover:bg-[#0044ff51]"
                  }`}
                  onClick={() => toggleVisibility(index)}
                >
                  {visibleRows[index] ? (
                    <Minus
                      size={15}
                      className={darkTheme ? "text-blue-300" : "text-[#0741df]"}
                    />
                  ) : (
                    <Plus
                      size={15}
                      className={darkTheme ? "text-blue-300" : "text-[#0741df]"}
                    />
                  )}
                  <p
                    className={`text-md tracking-widest font-bold ${
                      darkTheme ? "text-blue-300" : "text-[#194cd8]"
                    }`}
                  >
                    {detail.table}
                  </p>
                </div>

                {/* Column Details */}
                {visibleRows[index] &&
                  detail.columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-[95%] flex items-center gap-x-1 pl-3 overflow-auto py-2 border-l-4 rounded-r-md mt-1 scrollbar-hide ${
                        darkTheme
                          ? "border-blue-400 bg-gray-700 text-gray-300"
                          : "border-[#194cd8] bg-[#E5E7EB] text-gray-500"
                      }`}
                    >
                      <span className="font-semibold text-sm tracking-wide">
                        {col.column}
                      </span>
                      <span
                        className={`text-xs ${
                          darkTheme ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {`(${col.type})`}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TableDetail;
