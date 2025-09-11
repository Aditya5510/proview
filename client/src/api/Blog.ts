import BASE_URL from "../config";

export interface BlogPayload {
  title: string;
  content?: string;
  image?: string;
  videoUrl?: string;
}

export const createBlog = async (user: any, payload: BlogPayload) => {
  if (!user?.token) {
    throw new Error("No authentication token found");
  }

  console.log("Making API call to:", BASE_URL + "api/blogs/create");
  console.log("Token:", user.token);
  console.log("Payload:", payload);

  const res = await fetch(BASE_URL + "api/blogs/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": user.token,
    },
    body: JSON.stringify(payload),
  });

  console.log("Response status:", res.status);
  console.log("Response headers:", res.headers);

  const data = await res.json();
  console.log("Response data:", data);

  return data;
};

export const getMyBlogs = async (user: any) => {
  const res = await fetch(BASE_URL + "api/blogs/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": user.token,
    },
  });
  return res.json();
};

export const deleteBlog = async (user: any, blogId: string) => {
  const res = await fetch(BASE_URL + "api/blogs/delete", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": user.token,
    },
    body: JSON.stringify({ blogId }),
  });
  return res.json();
};

export const getRecentBlogs = async (userId: string) => {
  const res = await fetch(BASE_URL + `api/blogs/recent/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export const getAllBlogs = async (userId: string) => {
  const res = await fetch(BASE_URL + `api/blogs/all/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export const getBlogById = async (blogId: string, user?: any) => {
  const headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Add authentication token if user is logged in
  if (user?.token) {
    headers["x-access-token"] = user.token;
  }

  const res = await fetch(BASE_URL + `api/blogs/one/${blogId}`, {
    method: "GET",
    headers,
  });
  return res.json();
};

export const likeBlog = async (user: any, blogId: string) => {
  if (!user?.token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(BASE_URL + `api/blogs/like/${blogId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": user.token,
    },
  });
  return res.json();
};
