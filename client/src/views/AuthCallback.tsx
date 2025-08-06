import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Store authentication data
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Set default image if OAuth provided one
        if (user.image) {
          localStorage.setItem("image", user.image);
        }

        toast.success("Successfully signed in with Google!");
        navigate("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    } else {
      toast.error("Authentication failed. Please try again.");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
