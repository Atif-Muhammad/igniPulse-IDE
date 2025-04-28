import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function TableLayout({ tables }) {
  const [tabIsOpen, setTabIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTabIsOpen(false);
      }
    }

    if (tabIsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tabIsOpen]);

  return (
    <>
      {tables.length > 0 && (
        <div className="relative z-20" ref={dropdownRef}>
          <div
            className="text-sm font-semibold text-white text-center cursor-pointer bg-gray-800 h-1/2 px-2 py-2 rounded-md shadow-md select-none"
            onClick={() => setTabIsOpen(!tabIsOpen)}
          >
            Tables
          </div>

          {tabIsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute -left-40 z-10 mt-2 w-[30vw] bg-gray-800 rounded-lg shadow-md overflow-hidden"
              style={{ height: "30vh" }}
            >
              <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {tables.map((table, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-[#0072C6] text-white break-words text-sm text-center p-2 rounded-md shadow-md"
                    >
                      {table[Object.keys(table)]}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}

export default TableLayout;
