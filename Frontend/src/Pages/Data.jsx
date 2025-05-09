import React from "react";
import { useTheme } from "../context/ThemeContext";

const Data = ({ res }) => {
  const { darkTheme } = useTheme();

  return (
    <>
      {res.length > 0 ? (
        <div
          className={`table-container h-full rounded-lg shadow-md flex flex-col ${
            darkTheme ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border-collapse">
              {/* Table Header */}
              <thead
                className={`sticky top-0 z-10 ${
                  darkTheme ? "bg-blue-900" : "bg-[#194cd8]"
                }`}
              >
                <tr>
                  {Object.keys(res[0]).map((key) => (
                    <th
                      key={key}
                      className={`px-3 py-3 text-sm tracking-wider text-left uppercase ${
                        darkTheme ? "text-gray-200" : "text-white"
                      }`}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-auto w-full flex-1 max-h-[calc(100%-3rem)]">
            <table className="w-full table-auto border-collapse">
              <tbody>
                {res.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`transition duration-200 ${
                      darkTheme
                        ? rowIndex % 2 === 0
                          ? "bg-gray-700"
                          : "bg-gray-600"
                        : rowIndex % 2 === 0
                        ? "bg-white"
                        : "bg-gray-200"
                    } hover:${darkTheme ? "bg-gray-500" : "bg-gray-300"}`}
                  >
                    {Object.keys(row).map((key) => (
                      <td
                        key={key}
                        className={`px-4 py-2 text-start text-sm ${
                          darkTheme ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`text-center py-4 ${
            darkTheme ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No data available.
        </div>
      )}
    </>
  );
};

export default Data;
