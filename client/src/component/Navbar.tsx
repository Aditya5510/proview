import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdHome } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { LogOut, User, Settings, Menu, X } from "lucide-react";
import { logoutUser } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle, CustomizeButton } from "@/components/ThemeToggle";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, updateSettings } = useTheme();

  function handleLogout() {
    logoutUser();
    navigate("/login");
    setMobileMenuOpen(false);
  }

  return (
    <>
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
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

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <CustomizeButton onClick={() => setShowCustomize(true)} />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t"
              >
                <div className="py-4 space-y-3">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <MobileNavLink
                      to="/"
                      icon={<MdHome className="h-4 w-4" />}
                      text="Dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      to="/link"
                      icon={<FaLink className="h-4 w-4" />}
                      text="Links"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  </div>

                  {/* Mobile User Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <ThemeToggle />
                      <CustomizeButton onClick={() => {
                        setShowCustomize(true);
                        setMobileMenuOpen(false);
                      }} />
                    </div>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Customization Panel */}
      {showCustomize && (
        <CustomizationPanel
          settings={settings}
          onSettingsChange={updateSettings}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </>
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

const MobileNavLink = ({ to, icon, text, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className="w-full justify-start"
      asChild
    >
      <Link to={to} onClick={onClick} className="flex items-center">
        {icon}
        <span className="ml-3">{text}</span>
      </Link>
    </Button>
  );
};

export default Navbar;
