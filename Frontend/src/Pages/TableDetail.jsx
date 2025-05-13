import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function TableDetail({ tables = [], views = [] }) {
  const [visibleRows, setVisibleRows] = useState({});
  const [showTables, setShowTables] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const { darkTheme } = useTheme();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sectionToggleStyle = `flex items-center gap-x-2 px-3 py-1 rounded-md cursor-pointer mb-1 ${
    darkTheme
      ? "bg-blue-600 hover:bg-blue-700 text-blue-200"
      : "bg-[#2E60EB] hover:bg-[#1f4bc6e0] text-white"
  }`;

  const sectionHeader = (label, show, toggle) => (
    <div onClick={toggle} className={sectionToggleStyle}>
      {show ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      <p className="text-sm  font-semibold tracking-wide">{label}</p>
    </div>
  );

  const renderDetails = (data, offset = 0) =>
    data.map((detail, index) => (
      <div
        key={index + offset}
        className="flex flex-col items-end w-full mb-1 ms-3"
      >
        <div
          className={`w-full flex items-center gap-x-2 cursor-pointer select-none py-3 px-3 rounded-md hover:bg-opacity-80 transition duration-200 ${
            darkTheme
              ? "bg-blue-900 bg-opacity-40 hover:bg-blue-900"
              : "bg-[#0044ff39] hover:bg-[#0044ff51]"
          }`}
          onClick={() => toggleVisibility(index + offset)}
        >
          <div className="flex-shrink-0">
            {visibleRows[index + offset] ? (
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
          </div>
          <p
            className={`text-sm tracking-widest font-bold truncate overflow-hidden whitespace-nowrap ${
              darkTheme ? "text-blue-300" : "text-[#194cd8]"
            }`}
          >
            {capitalizeFirstLetter(detail.table)}
          </p>
        </div>

        {visibleRows[index + offset] &&
          detail.columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`w-[95%] flex items-center gap-x-1 pl-3 py-2 border-l-4 rounded-r-md mt-1 ${
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
    ));

  return (
    <div
      className={`w-full h-full overflow-auto rounded-lg border-2 px-2 py-1 ${
        darkTheme
          ? "border-blue-500 bg-gray-800 text-gray-200"
          : "border-sky-700 bg-gray-100 text-gray-800"
      }`}
    >
      {/* Tables Section */}
      {sectionHeader("Tables", showTables, () => setShowTables((prev) => !prev))}
      {showTables && renderDetails(tables, 0)}

      {/* Views Section */}
      {sectionHeader("Views", showViews, () => setShowViews((prev) => !prev))}
      {showViews && renderDetails(views, tables.length)}
    </div>
  );
}

export default TableDetail;
