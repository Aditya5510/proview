import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./views/DashBoard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import PrivateRoute from "./helpers/PrivateRoute";
import PublicRoute from "./helpers/PublicRoute";
import Link from "./views/Link";
import AuthCallback from "./views/AuthCallback";
import Blogs from "./views/Blogs";
import BlogList from "./views/BlogList";
import BlogDetail from "./views/BlogDetail";
import ShareBlog from "./views/ShareBlog";

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
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/Signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
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
    path: "/blogs",
    element: (
      <PrivateRoute>
        <Blogs />
      </PrivateRoute>
    ),
  },
  {
    path: "/data/:id",
    element: <Profile />,
  },
  {
    path: "/blogs/:id",
    element: <BlogList />,
  },
  {
    path: "/blog/:blogId",
    element: <BlogDetail />,
  },
  {
    path: "/share-blog/:blogId",
    element: <ShareBlog />,
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
