import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: string;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  delay = 0,
  className = "",
  animation,
}) => {
  const { settings } = useTheme();
  const selectedAnimation = animation || settings.animation;
  const speed = settings.animationSpeed;

  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: speed, delay },
    };

    switch (selectedAnimation) {
      case "fade":
        return {
          ...baseProps,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };

      case "slide":
        return {
          ...baseProps,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        };

      case "bounce":
        return {
          ...baseProps,
          initial: { opacity: 0, scale: 0.3 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: speed * 1.6,
            delay,
            type: "spring",
            stiffness: 200,
            damping: 10,
          },
        };

      case "scale":
        return {
          ...baseProps,
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
        };

      case "flip":
        return {
          ...baseProps,
          initial: { opacity: 0, rotateY: -90 },
          animate: { opacity: 1, rotateY: 0 },
          transition: {
            duration: speed * 1.2,
            delay,
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        };

      case "zoom":
        return {
          ...baseProps,
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: speed * 1.4,
            delay,
            type: "spring",
            stiffness: 150,
            damping: 12,
          },
        };

      case "slideleft":
        return {
          ...baseProps,
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
        };

      case "slideright":
        return {
          ...baseProps,
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
        };

      case "rotate":
        return {
          ...baseProps,
          initial: { opacity: 0, rotate: -180 },
          animate: { opacity: 1, rotate: 0 },
          transition: {
            duration: speed * 1.5,
            delay,
            type: "spring",
            stiffness: 120,
            damping: 14,
          },
        };

      case "elastic":
        return {
          ...baseProps,
          initial: { opacity: 0, scale: 0.1 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: speed * 2,
            delay,
            type: "spring",
            stiffness: 300,
            damping: 8,
          },
        };

      default:
        return baseProps;
    }
  };

  return (
    <motion.div {...getAnimationProps()} className={className}>
      {children}
    </motion.div>
  );
};
