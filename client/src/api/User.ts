import BASE_URL from "../config";

const signup = async (user: any) => {
  console.log(user);
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const login = async (user: any) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};
const AddLink = async (user: any, data: any) => {
  try {
    console.log("Sending request with data:", data);
    const res = await fetch(BASE_URL + "api/users/addLink", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    // console.log("Response:", json);
    return json;
  } catch (err) {
    console.error("Error adding link:", err);
    throw err; // Rethrow the error to inform the caller of the failure
  }
};

const updateLink1 = async (user: any) => {
  try {
    const res = await fetch(BASE_URL + "api/users/getLinks", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Error getting links:", err);
    throw err;
  }
};

const updatentries = async (user: any, data: any) => {
  try {
    // console.log("Sending request with data:", data);
    const res = await fetch(BASE_URL + "api/users/updateLink", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    // console.log("Response:", json);
    return json;
  } catch (err) {
    console.error("Error updating link:", err);
    throw err; // Rethrow the error to inform the caller of the failure
  }
};

const deleteEntry = async (user: any, data: any) => {
  try {
    const res = await fetch(BASE_URL + "api/users/deleteLink", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    // console.log("Response:", json);
    return json;
  } catch (err) {
    // console.error("Error deleting link:", err);
    throw err; // Rethrow the error to inform the caller of the failure
  }
};

export { signup, login, AddLink, updateLink1, updatentries, deleteEntry };
