import { React, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Config from "../../Config/config";

function DatabaseLayout({ dataBases, getTables }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDB, setSelectedDB] = useState(
    dataBases[0] || "Select a Database"
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDBChange = (e) => {
    
    Config.switchDB(e.target.value)
      .then((res) => {
        console.log("first");
        if(res.status ===200){  
          getTables(e.target.value);
          toast.success(`switched to ${e.target.value}`);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleSelect = (database) => {
    setSelectedDB(database);
    handleDBChange({ target: { value: database } });
    setIsOpen(false); 
  };
  useEffect(()=>{

  }, [dataBases.length])

  return (
    <>
      
        {dataBases.length > 0 && <div
          className="px-2 py-1 flex items-center justify-around rounded-lg bg-gray-800 shadow-md relative select-none"
          ref={dropdownRef} 
        >
          <h3 className="text-md px-2 text-center font-semibold text-white">
            Databases
          </h3>

          <div
            className="h-1/2 px-2 py-1 gap-x-2 text-white bg-gray-700 rounded cursor-pointer flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedDB}
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>▼</motion.span>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 top-full left-0 w-full max-h-[50vh] h-fit bg-gray-700 mt-1 rounded shadow-lg overflow-y-auto overflow-x-hidden"
              >
                {dataBases.map((database, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: "#0072C6", scale: 1.05 }}
                    className="px-3 py-2 cursor-pointer text-white"
                    onClick={() => handleSelect(database)}
                  >
                    {database}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>}
     

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default DatabaseLayout;
