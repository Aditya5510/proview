import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "@/helpers/authHelper";
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

        // Add token to user object and use loginUser function
        const userWithToken = { ...user, token };

        loginUser(userWithToken);

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
