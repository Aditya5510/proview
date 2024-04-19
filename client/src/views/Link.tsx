import {
  AddLink,
  deleteEntry,
  updateColor,
  updateImage,
  updateImage1,
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Console } from "console";

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
  // const [image, setImage] = useState("");
  const [uploadLoader, setUploadLoader] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorUploadLoader, setcolorUploadLoader] = useState(false);
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
    // try {
    // const request = ;

    toast.promise(
      AddLink(user, {
        title: cname,
        url: url,
        description: title,
      }),
      {
        loading: "Adding Link!",
        error: (e) => {
          return "Unable to add link";
        },
        success: "Successfully Added Link",
        finally: () => {
          setLoading(false);
        },
      }
    );
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
    title: any | null,
    url: any | null,
    description: any | null
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
        toast.success("Link updated successfully", {
          duration: 5000,
        });

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
        toast.success("Link deleted successfully", {
          duration: 5000,
        });
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

const handleSubmit2 = async (e: any) => {
  e.preventDefault();
  if (selectedImage) {

    const formData = new FormData();
    formData.append("key", `${import.meta.env.VITE_IMGBB_API_KEY}`); 
    formData.append("image", selectedImage);
    formData.append("name", selectedImage.name as any);
  

    try {
      // Make the POST request
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        // console.log(res);
        const data = await res.json();

        if (data?.status === 200) {
          localStorage.setItem("cover", data.data.url as any);

          const res = await updateImage1(user, {cover :data?.data?.url });
          if (res.success === true) {
            toast.success("cover image changed", {
              duration: 5000,
            });
            
          } else {
         
            alert("Error updating image");
          }
        }
      });
    } catch (error: any) {
    
      console.error("Error uploading image:", error.message);
    }

    setSelectedImage(null);
  } else {
    setUploadLoader(false);

    toast.error("No image selected");
  }
  
}



  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUploadLoader(true);
    // localStorage.removeItem("image");
    // Perform any necessary validation or processing before updating the image
    if (selectedImage) {
      // Perform image upload or update logic here
      // console.log("Selected image:", selectedImage);
      const formData = new FormData();
      formData.append("key", `${import.meta.env.VITE_IMGBB_API_KEY}`); // Your IMGBB_API_KEY
      formData.append("image", selectedImage);
      // console.log(formData);

      formData.append("name", selectedImage.name as any);
      // Example expiration time in seconds

      try {
        // Make the POST request
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        }).then(async (res) => {
          // console.log(res);
          const data = await res.json();

          if (data?.status === 200) {
            localStorage.setItem("image", data.data.url as any);

            const res = await updateImage(user, { profile: data?.data?.url });
            if (res.success === true) {
              toast.success("Profile changed", {
                duration: 5000,
              });
              setUploadLoader(false);
            } else {
              setUploadLoader(false);
              alert("Error updating image");
            }
          }
        });
      } catch (error: any) {
        setUploadLoader(false);
        console.error("Error uploading image:", error.message);
      }

      setSelectedImage(null);
    } else {
      setUploadLoader(false);

      toast.error("No image selected");
    }
  };
  const user = isLoggedIn();
  const handleSubmit1 = async () => {
    setcolorUploadLoader(true);
    // console.log("Selected color:", selectedColor);
    // Here you can perform further actions with the selected color
    const data = {
      color: selectedColor,
    };

    try {
      await updateColor(user, data).then((data) => {
        toast.success("color added ", {
          duration: 1000,
        });
        setcolorUploadLoader(false);
      });
    } catch (err) {}
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
  };

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
                  <Card className="max-w-md  block sm:hidden">
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
                          {
                            <Button className="h-[25px] w-[70px]" type="submit">
                              {uploadLoader ? (
                                <BiLoaderAlt className="animate-spin" />
                              ) : (
                                "Update"
                              )}
                            </Button>
                          }
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
                            <Button variant={"link"}>Share your Profile</Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>

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
                              disabled
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
                              className=" w-full min-w-56 p-3 border border-gray-200 rounded-md   flex flex-col items-center justify-start gap-5  md:flex-row lg:flex-row xl:flex 2xl:flex-row md:justify-between md:items-center mt-1"
                            >
                              <div className="flex flex-col justify-start text-wrap w-[70%]">
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
                                              (
                                                document.getElementById(
                                                  "name1"
                                                ) as any
                                              ).value as any,
                                              (
                                                document.getElementById(
                                                  "title1"
                                                ) as any
                                              ).value as any
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
            <div className="hidden md:block col-span-4 mt-1">
              {" "}
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>{user.username}</CardDescription>
                  </CardHeader>

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
                          {
                            <Button
                              className="h-[25px] w-[70px]"
                              type="submit"
                              disabled={uploadLoader}
                            >
                              {uploadLoader ? (
                                <BiLoaderAlt className="animate-spin" />
                              ) : (
                                "Update"
                              )}
                            </Button>
                          }
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
                            <Button variant={"link"}>Share your Profile</Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Card>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="underline">
                      Main page Settings
                    </CardTitle>
                  </CardHeader>

                  <div className="bg-white shadow-xl rounded-lg py-3">
                    <h2 className="ml-3 font-bold">Cover Image</h2>
                    <div className="p-2">
                      <img
                        className="w-full h-full rounded mx-auto object-fill"
                        src={localStorage.getItem("cover")}
                        alt="profile"
                      />

                      <form
                        className="flex gap-1 justify-center mt-3"
                        onSubmit={handleSubmit2}
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
                        {
                          <Button
                            className="h-[25px] w-[70px]"
                            type="submit"
                            disabled={uploadLoader}
                          >
                            {uploadLoader ? (
                              <BiLoaderAlt className="animate-spin" />
                            ) : (
                              "Update"
                            )}
                          </Button>
                        }
                      </form>
                    </div>
                    <div className="border border-x-2">
                      <div className="flex flex-col items-center mt-8">
                        <h2 className="text-lg font-semibold mb-4">
                          Select Cover Colour
                        </h2>
                        <div className="flex">
                          <select
                            className="px-4 py-2 border border-black rounded-md mb-4 focus:outline-none focus:border-black"
                            value={selectedColor}
                            onChange={handleColorChange}
                          >
                            <option value="">Select a colour</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="black">Black</option>
                          </select>
                        </div>
                        <CardFooter>
                          <Button
                            onClick={handleSubmit1}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-black transition duration-300"
                          >
                            Submit
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </div>
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