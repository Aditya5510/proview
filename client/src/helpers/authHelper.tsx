const isLoggedIn = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
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

export { loginUser, isLoggedIn, logoutUser };
