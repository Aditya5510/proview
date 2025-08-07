import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./views/DashBoard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import PrivateRoute from "./helpers/PrivateRoute";
import Link from "./views/Link";
import AuthCallback from "./views/AuthCallback";

import { Toaster } from "@/components/ui/sonner";
import Profile from "./views/Profile";
import { ThemeProvider } from "@/contexts/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashBoard />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/Link",
    element: (
      <PrivateRoute>
        <Link />
      </PrivateRoute>
    ),
  },
  {
    path: "/data/:id",
    element: <Profile />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
