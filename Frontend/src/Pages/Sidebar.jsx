import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = ["Python", "SQL"]

  return (
    <div className="relative flex z-10">
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", duration: 1 }}
        className="fixed top-0 left-0 h-full w-60 bg-gray-900 text-white shadow-lg flex"
      >
        {/* Burger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-2 -right-[20%] w-10 h-10 grid place-items-center cursor-pointer bg-gray-800 text-white rounded-md shadow-md"
        >
          {isOpen ? <X/> :<Menu size={24} />}
        </button>

        <nav className="w-full h-full flex flex-col items-center justify-start">
          
            {links.map((link, index)=> (
              <Link key={index} to={`/${link.toLowerCase()}`} onClick={()=> setIsOpen(false)} className="text-lg hover:bg-gray-700 w-full h-[3rem] flex items-center px-2">
                {link}
              </Link>
            ))}
            
          
        </nav>
      </motion.div>
    </div>
  );
}
