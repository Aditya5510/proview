import {
  AddLink,
  deleteEntry,
  updateImage,
  updateLink1,
  updatentries,
} from "@/api/User";
import { Navbar } from "@/component/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useState } from "react";
import { UploadIcon } from "@radix-ui/react-icons";

const extractCompanyName = (url: string) => {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
  const match = url.match(regex);
  if (match && match[1]) {
    const domain = match[1];
    const parts = domain.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 2];
    }
  }
  return "";
};

const Link = () => {
  const [loading, setLoading] = React.useState(false);
  const [linkData, setLinkData] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState("");
  // const [userData, setUserData] = useState({});

  async function postData(e: any) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const url = formData.get("Url");
    // console.log(title, url);
    // Perform your desired action with the form data

    const cname = extractCompanyName(url as string);
    // console.log(title, url, cname);
    const user = isLoggedIn();
    try {
      const response = await AddLink(user, {
        title: cname,
        url: url,
        description: title,
      });

      if (response?.succes === true) {
        setLoading(false);
        alert("Link added successfully");
        e.target.reset();
      } else if (response.error === "Link already exists") {
        setLoading(false);
        alert("Link already exists");
      }
    } catch (error) {
      console.error("Error adding link:", error);
    }
  }

  React.useEffect(() => {
    const user = isLoggedIn();

    async function fetchData() {
      try {
        // console.log("clicked");
        const response = await updateLink1(user);
        // console.log("Response:", response);

        setLinkData(response);
      } catch (error) {
        console.error("Error adding link:", error);
      }
    }
    fetchData();
  }, [loading, load]);

  const updatLinknew = async (
    title: string,
    url: string,
    description: string
  ) => {
    setLoad(true);
    const user = isLoggedIn();
    // console.log(title, url, description);
    try {
      const response = await updatentries(user, {
        title: title,
        url: url,
        description: description,
      });
      if (response?.success === true) {
        alert("Link updated successfully");
        setLinkData(response?.data);
        setLoad(false);
      } else {
        alert("Error updating link");
      }
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const deleteLink = async (title: string) => {
    const user = isLoggedIn();
    try {
      setLoad(true);
      const response = await deleteEntry(user, {
        title: title,
      });
      if (response?.success === true) {
        alert("Link deleted successfully");
        // setLinkData(response?.data);
        setLoad(false);
      } else {
        alert("Error deleting link");
        setLoad(false);
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    localStorage.removeItem("image");
    // Perform any necessary validation or processing before updating the image
    if (selectedImage) {
      // Perform image upload or update logic here
      // console.log("Selected image:", selectedImage);
      const formData = new FormData();
      formData.append("key", `${import.meta.env.VITE_IMGBB_API_KEY}`); // Your IMGBB_API_KEY
      formData.append("image", selectedImage);
      // console.log(formData);

      formData.append("name", selectedImage.name);
      // Example expiration time in seconds

      try {
        // Make the POST request
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        // Parse response as JSON
        const data = await response.json();

        // Check if the upload was successful
        if (data?.status === 200) {
          // console.log("Image uploaded successfully:", data.data.url);
          // Do something with the uploaded image URLse
          localStorage.setItem("image", data.data.url);
          setImage(data?.data?.url);
          console.log(image);
          const res = await updateImage(user, { profile: image });
          if (res.success === true) {
            // setImage(res.data.url);
            // console.log(res);
            setImage(res?.user?.profile);
            alert("Image updated successfully");
          } else {
            alert("Error updating image");
          }
        } else {
          console.error("Image upload failed:", data.error.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }

      setSelectedImage(null);
    } else {
      // console.log("No image selected");
      alert("No image selected");
    }
  };
  const user = isLoggedIn();

  return (
    <>
      <Navbar />
      <div className="w-[100vw] flex justify-center mt-3 ">
        <div className="min-w-[80vw] lg:max-w-[80vw] xs:max-w-[95vw] ">
          <div className="grid grid-cols-12 gap-4  p-1 ">
            <div className="col-span-12 md:col-span-8 ">
              {" "}
              <div className="flex flex-col gap-4">
                <div className="grid items-start gap-7">
                  <div className="flex items-center justify-between px-2"></div>

                  <Card>
                    <form onSubmit={postData}>
                      <CardHeader>
                        <CardTitle>Add a new profile link</CardTitle>
                        <CardDescription>
                          Add a new profile link
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label>Url </Label>
                            <Input
                              name="Url"
                              type="url"
                              id="Url"
                              placeholder="https://github.com/Aditya5510"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label> Description </Label>
                            <Input
                              name="title"
                              type="text"
                              id="title"
                              placeholder="Hi ! visit my profile page"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {loading ? (
                          <>
                            {" "}
                            <Button
                              type="submit"
                              className="flex items-center gap-2"
                            >
                              <BiLoaderAlt className="animate-spin" />
                              Adding...
                            </Button>
                          </>
                        ) : (
                          <Button type="submit"> Add this url</Button>
                        )}
                      </CardFooter>
                    </form>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Links</CardTitle>
                    <CardDescription>links</CardDescription>

                    <CardContent>
                      <div>
                        <div>
                          {linkData?.map((link: any, index: number) => (
                            <div
                              key={index}
                              className=" w-full min-w-72 p-3 border border-gray-200 rounded-md   flex flex-col items-center justify-start gap-2  md:flex-row lg:flex-row xl:flex 2xl:flex-row md:justify-between md:items-center mt-1"
                            >
                              <div className="flex flex-col justify-start">
                                <p className="text-lg font-semibold">
                                  {link.title.toUpperCase()}
                                </p>
                                <p className="text-gray-500 " itemType="link">
                                  {link.url}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="link"
                                      className=" text-black-600"
                                    >
                                      <FaEdit className="h-5 w-5" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Link</DialogTitle>
                                      <DialogDescription>
                                        Make changes to your Links here. Click
                                        save when you're done.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Url
                                        </Label>
                                        <Input
                                          id="name1"
                                          // value={link?.url}
                                          className="col-span-3"
                                          defaultValue={link?.url}
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="username"
                                          className="text-right"
                                        >
                                          Title
                                        </Label>
                                        <Input
                                          id="title1"
                                          // value={link?.description}
                                          className="col-span-3"
                                          defaultValue={link?.description}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      {load ? (
                                        <Button>Updating...</Button>
                                      ) : (
                                        <Button
                                          // type="submit"
                                          onClick={() =>
                                            updatLinknew(
                                              link?.title,
                                              document.getElementById("name1")
                                                .value as string,
                                              document.getElementById("title1")
                                                .value as string
                                            )
                                          }
                                        >
                                          Save
                                        </Button>
                                      )}{" "}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="link"
                                      className=" text-red-600"
                                    >
                                      <MdDelete className="h-5 w-5" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this link.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      {load ? (
                                        <Button>
                                          <BiLoaderAlt className="animate-spin" />
                                          Deleting...
                                        </Button>
                                      ) : (
                                        <AlertDialogAction
                                          onClick={() =>
                                            deleteLink(link?.title)
                                          }
                                        >
                                          Delete Link
                                        </AlertDialogAction>
                                      )}
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div className="hidden md:block col-span-4">
              {" "}
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>{user.username}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Card className="max-w-md ">
                      <div className="bg-white shadow-xl rounded-lg py-3">
                        <div className="p-2">
                          <img
                            className="w-32 h-32 rounded-full mx-auto object-cover"
                            src={localStorage.getItem("image")}
                            alt="profile"
                          />

                          <form
                            className="flex gap-1 justify-center mt-3"
                            onSubmit={handleSubmit}
                          >
                            <label
                              htmlFor="file"
                              className="text-center text-black-600 border border-1-black p-[0.5px] rounded-md pr-1 pl-1 cursor-pointer"
                            >
                              Upload
                            </label>
                            <input
                              type="file"
                              className="hidden"
                              id="file"
                              name="file"
                              onChange={handleImageChange}
                            />
                            <Button className="h-[25px] w-[70px]" type="submit">
                              Change
                            </Button>
                          </form>
                        </div>
                        <CardContent>
                          <div className="p-2">
                            <h2 className="text-center text-xl font-bold">
                              {user.username}
                            </h2>

                            <div className="text-center my-3">
                              <a
                                className="text-xs  hover:underline hover:text-black-600"
                                href="mailto:"
                              >
                                {user.email}
                              </a>
                            </div>

                            <div className="text-center my-3">
                              <Button variant={"link"}>
                                Share your Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Link;
