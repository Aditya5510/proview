import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleOAuthButton = () => {
  const handleGoogleLogin = () => {
    const backendURL =
      process.env.NODE_ENV === "production"
        ? "https://proview-backend-five.vercel.app"
        : "http://localhost:5000";

    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Continue with Google
    </Button>
  );
};

export default GoogleOAuthButton;
