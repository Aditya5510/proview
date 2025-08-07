import { useState, useEffect } from "react";

const isLoggedIn = () => {
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("authToken");

  if (userString && token) {
    const user = JSON.parse(userString);
    return { ...user, token };
  }
  return null;
};

const useAuth = () => {
  const [user, setUser] = useState(() => isLoggedIn());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(isLoggedIn());
    };

    // Listen for both storage events (from other tabs) and custom auth-change events
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return user;
};

const loginUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("authToken", user.token);
  localStorage.setItem("image", user?.profile);
  localStorage.setItem("cover", user?.cover);

  // Dispatch a custom event to notify the useAuth hook
  window.dispatchEvent(new Event("auth-change"));
};

const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.clear();

  // Dispatch a custom event to notify the useAuth hook
  window.dispatchEvent(new Event("auth-change"));
};

export { loginUser, isLoggedIn, logoutUser, useAuth };
