const isLoggedIn = () => {
  const userString = localStorage.getItem("user");
  // console.log("User string from localStorage:", userString);
  return userString ? JSON.parse(userString) : null;
};
const loginUser = (user: string) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.clear();
};

export { loginUser, isLoggedIn, logoutUser };
