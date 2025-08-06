import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdHome } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { LogOut, User, Settings } from "lucide-react";
import { logoutUser } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                P
              </span>
            </div>
            <span className="text-xl font-bold">ProView</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink
              to="/"
              icon={<MdHome className="h-4 w-4" />}
              text="Dashboard"
            />
            <NavLink
              to="/link"
              icon={<FaLink className="h-4 w-4" />}
              text="Links"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavLink = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button variant={isActive ? "default" : "ghost"} size="sm" asChild>
      <Link to={to} className="flex items-center">
        {icon}
        <span className="ml-2 hidden sm:inline">{text}</span>
      </Link>
    </Button>
  );
};

export default Navbar;
