import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { login } from "@/api/User";
import { loginUser } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import { testOAuthConfig } from "@/utils/testOAuth";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Debug OAuth configuration
  React.useEffect(() => {
    testOAuthConfig();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      if (data.error) {
        toast.error(data.error);
      } else {
        loginUser(data);
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Column - Image */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/random?nature&grayscale')",
        }}
      >
        <div className="w-full flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-center"
          >
            Log in to access your personalized dashboard and manage your links.
          </motion.p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-black mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 w-full border-gray-300"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 w-full border-gray-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleOAuthButton text="Continue with Google" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-black hover:text-gray-700"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
