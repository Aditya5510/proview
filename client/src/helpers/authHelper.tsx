import { useState, useEffect } from "react";

const isLoggedIn = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const useAuth = () => {
  const [user, setUser] = useState(() => isLoggedIn());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(isLoggedIn());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return user;
};

const loginUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("image", user?.profile);

  localStorage.setItem("cover", user?.cover);
};

const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.clear();
};

export { loginUser, isLoggedIn, logoutUser, useAuth };
