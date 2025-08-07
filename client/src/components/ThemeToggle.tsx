import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle: React.FC = () => {
  const { settings, updateSettings } = useTheme();

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDarkMode}
        className="relative overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={{ rotate: settings.darkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          {settings.darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export const CustomizeButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="relative overflow-hidden"
      >
        <Palette className="h-4 w-4 mr-2" />
        Customize
      </Button>
    </motion.div>
  );
};
