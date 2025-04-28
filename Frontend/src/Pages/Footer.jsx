import React from 'react'
import { motion } from "framer-motion";
function Footer() {
  return (
    <footer className="text-center w-full absolute bottom-0">
        <motion.p
          className="text-gray-400 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          © 2025 Ignipulse. Empowering IT education and innovation, one line of
          code at a time.
        </motion.p>
      </footer>
  )
}

export default Footer