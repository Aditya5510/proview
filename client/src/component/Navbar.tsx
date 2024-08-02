import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdHome } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { logoutUser } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <NavLink to="/" icon={<MdHome className="h-5 w-5" />} text="Home" />
            <NavLink
              to="/link"
              icon={<FaLink className="h-5 w-5" />}
              text="Links"
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <Button
              onClick={handleLogout}
              className="relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="relative z-10">Logout</span>
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                    style={{ mixBlendMode: "overlay" }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                initial={{ x: "100%" }}
                animate={{ x: isHovering ? "0%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

const NavLink = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group">
      <div
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out ${
          isActive ? "text-white" : "text-gray-300 hover:text-white"
        }`}
      >
        {icon}
        <span className="ml-2">{text}</span>
      </div>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
          layoutId="navbar-underline"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </Link>
  );
};

export default Navbar;
