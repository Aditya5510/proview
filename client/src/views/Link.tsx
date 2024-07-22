import { motion } from "framer-motion";
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
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { DialogComponent } from "./DashBoard";

const extractCompanyName = (url) => {
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

const data1 = [
  { Button: FacebookShareButton, Icon: FacebookIcon, Title: "Facebook" },
  { Button: WhatsappShareButton, Icon: WhatsappIcon, Title: "Whatsapp" },
  { Button: InstapaperShareButton, Icon: InstapaperIcon, Title: "Instapaper" },
];

const Link = () => {
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState([]);
  const [load, setLoad] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorUploadLoader, setColorUploadLoader] = useState(false);
  const user = isLoggedIn();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await updateLink1(user);
        setLinkData(response);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    }
    fetchData();
  }, [loading, load]);

  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const url = formData.get("Url");
    const cname = extractCompanyName(url);

    toast.promise(
      AddLink(user, {
        title: cname,
        url: url,
        description: title,
      }),
      {
        loading: "Adding Link!",
        error: "Unable to add link",
        success: "Successfully Added Link",
        finally: () => {
          setLoading(false);
        },
      }
    );
  };

  const updatLinknew = async (title, url, description) => {
    setLoad(true);
    try {
      const response = await updatentries(user, { title, url, description });
      if (response?.success) {
        toast.success("Link updated successfully");
        setLinkData(response?.data);
      } else {
        toast.error("Error updating link");
      }
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Error updating link");
    } finally {
      setLoad(false);
    }
  };

  const deleteLink = async (title) => {
    try {
      setLoad(true);
      const response = await deleteEntry(user, { title });
      if (response?.success) {
        toast.success("Link deleted successfully");
      } else {
        toast.error("Error deleting link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Error deleting link");
    } finally {
      setLoad(false);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async (e, updateFunc) => {
    e.preventDefault();
    setUploadLoader(true);
    if (selectedImage) {
      const formData = new FormData();
      formData.append("key", import.meta.env.VITE_IMGBB_API_KEY);
      formData.append("image", selectedImage);

      try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data?.status === 200) {
          const imageUrl = data.data.url;
          const res = await updateFunc(user, {
            [updateFunc === updateImage ? "profile" : "cover"]: imageUrl,
          });
          if (res.success) {
            toast.success(
              `${
                updateFunc === updateImage ? "Profile" : "Cover"
              } image changed`
            );
            localStorage.setItem(
              updateFunc === updateImage ? "image" : "cover",
              imageUrl
            );
          } else {
            toast.error("Error updating image");
          }
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
        toast.error("Error uploading image");
      } finally {
        setUploadLoader(false);
        setSelectedImage(null);
      }
    } else {
      toast.error("No image selected");
      setUploadLoader(false);
    }
  };

  const handleColorChange = async () => {
    setColorUploadLoader(true);
    try {
      await updateColor(user, { color: selectedColor });
      toast.success("Color added");
    } catch (err) {
      toast.error("Error updating color");
    } finally {
      setColorUploadLoader(false);
    }
  };

  const share_link = `https://proview-7pk6.vercel.app/data/${user?.userId}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
              <form onSubmit={postData}>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Add a new profile link
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter the details for your new link
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="Url">URL</Label>
                    <Input
                      name="Url"
                      type="url"
                      id="Url"
                      placeholder="https://github.com/username"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Description</Label>
                    <Input
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Visit my GitHub profile"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <BiLoaderAlt className="animate-spin mr-2" /> Adding...
                      </>
                    ) : (
                      "Add this URL"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Your Links</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your profile links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div layout className="space-y-4">
                  {linkData?.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-700 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                    >
                      <div className="space-y-2 mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold">
                          {link.title.toUpperCase()}
                        </h3>
                        <p className="text-gray-400 break-all">{link.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FaEdit className="mr-2" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Edit Link</DialogTitle>
                              <DialogDescription>
                                Make changes to your link here.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-url">URL</Label>
                                <Input
                                  id="edit-url"
                                  defaultValue={link?.url}
                                  className="bg-gray-700 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  defaultValue={link?.description}
                                  className="bg-gray-700 text-white"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  const urlInput = document.getElementById(
                                    "edit-url"
                                  ) as HTMLInputElement;
                                  const titleInput = document.getElementById(
                                    "edit-title"
                                  ) as HTMLInputElement;

                                  if (urlInput && titleInput) {
                                    updatLinknew(
                                      link?.title,
                                      urlInput.value,
                                      titleInput.value
                                    );
                                  } else {
                                    toast.error(
                                      "Error: Input fields not found"
                                    );
                                  }
                                }}
                                disabled={load}
                              >
                                {load ? "Updating..." : "Save changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <MdDelete className="mr-2" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this link.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteLink(link?.title)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                {load ? (
                                  <BiLoaderAlt className="animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  {user.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <img
                  src={localStorage.getItem("image")}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <form
                  onSubmit={(e) => handleImageUpload(e, updateImage)}
                  className="w-full"
                >
                  <div className="flex justify-center mb-4">
                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-l-md hover:bg-gray-600"
                    >
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="submit"
                      className="bg-white text-black rounded-r-md hover:bg-gray-200"
                      disabled={uploadLoader}
                    >
                      {uploadLoader ? (
                        <BiLoaderAlt className="animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </form>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-400 mt-2">{user.email}</p>
                <DialogComponent
                  data={data1}
                  shareLink={share_link}
                  text="Share"
                />
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Main Page Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-4">Cover Image</h3>
                <img
                  src={localStorage.getItem("cover")}
                  alt="cover"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <form
                  onSubmit={(e) => handleImageUpload(e, updateImage1)}
                  className="mb-8"
                >
                  <div className="flex justify-center">
                    <label
                      htmlFor="cover-upload"
                      className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-l-md hover:bg-gray-600"
                    >
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="cover-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="submit"
                      className="bg-white text-black rounded-r-md hover:bg-gray-200"
                      disabled={uploadLoader}
                    >
                      {uploadLoader ? (
                        <BiLoaderAlt className="animate-spin" />
                      ) : (
                        "Update Cover"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="space-y-4">
                  <h3 className="font-bold">Select Cover Colour</h3>
                  <select
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    <option value="">Select a colour</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="black">Black</option>
                  </select>
                  <Button
                    onClick={handleColorChange}
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={colorUploadLoader}
                  >
                    {colorUploadLoader ? (
                      <BiLoaderAlt className="animate-spin" />
                    ) : (
                      "Update Colour"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Link;
