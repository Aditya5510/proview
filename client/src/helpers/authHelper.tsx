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
  localStorage.setItem("authToken", user.token);
  localStorage.setItem("image", user?.profile);
  localStorage.setItem("cover", user?.cover);
};

const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.clear();
};

export { loginUser, isLoggedIn, logoutUser, useAuth };
