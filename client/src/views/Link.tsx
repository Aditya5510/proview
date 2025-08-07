import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MdDelete, MdDragHandle } from "react-icons/md";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Link as LinkIcon,
  Plus,
  Settings,
  Palette,
  Image as ImageIcon,
  Upload,
  Copy,
  ExternalLink,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/helpers/authHelper";
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

const getPlatformIcon = (url) => {
  const domain = extractCompanyName(url).toLowerCase();
  const iconMap = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
  };

  return iconMap[domain] || Globe;
};

const getPlatformColor = (url) => {
  const domain = extractCompanyName(url).toLowerCase();
  const colorMap = {
    github: "from-gray-700 to-gray-900",
    linkedin: "from-blue-600 to-blue-800",
    twitter: "from-sky-400 to-sky-600",
    instagram: "from-pink-500 to-purple-600 via-orange-500",
    youtube: "from-red-500 to-red-700",
    facebook: "from-blue-500 to-blue-700",
  };

  return colorMap[domain] || "from-gray-500 to-gray-700";
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
  const user = useAuth();

  const fetchLinks = async () => {
    try {
      const data = await updateLink1(user);
      if (Array.isArray(data)) {
        setLinkData(data);
      } else {
        setLinkData([]);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      setLinkData([]);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchLinks();
    }
  }, [user?.userId]);

  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const url = formData.get("Url");
    const cname = extractCompanyName(url);

    try {
      const data = await AddLink(user, {
        title: cname,
        url: url,
        description: title,
      });

      if (data.succes) {
        toast.success("Link added successfully!");
        e.target.reset();
        fetchLinks();
      } else {
        toast.error(data.error || "Failed to add link");
      }
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  const updatLinknew = async (title, url, description) => {
    setLoad(true);
    try {
      const response = await updatentries(user, { title, url, description });
      if (response?.success) {
        toast.success("Link updated successfully");
        fetchLinks();
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
        fetchLinks();
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Links
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Add and organize your profile links
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Link</CardTitle>
                <CardDescription>Add a link to your profile</CardDescription>
              </CardHeader>
              <form onSubmit={postData}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="Url">URL</Label>
                    <Input
                      name="Url"
                      type="url"
                      id="Url"
                      placeholder="https://github.com/username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Description</Label>
                    <Input
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Visit my GitHub profile"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <BiLoaderAlt className="animate-spin mr-2 w-4 h-4" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 w-4 h-4" />
                        Add Link
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Links</CardTitle>
                    <CardDescription>
                      {Array.isArray(linkData) ? linkData.length : 0} links in
                      your profile
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!Array.isArray(linkData) || linkData.length === 0 ? (
                  <div className="text-center py-12">
                    <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No links yet</h3>
                    <p className="text-muted-foreground">
                      Add your first link to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {linkData.map((link, index) => {
                      const IconComponent = getPlatformIcon(link.url);
                      const extractDomain = (url) => {
                        try {
                          return new URL(url).hostname.replace("www.", "");
                        } catch {
                          return "Invalid URL";
                        }
                      };

                      return (
                        <div
                          key={link._id || index}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm truncate">
                                  {link.title}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate">
                                  {link.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {extractDomain(link.url)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(link.url);
                                  toast.success("Link copied!");
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <FaEdit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Link</DialogTitle>
                                    <DialogDescription>
                                      Update your link information
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-url-${index}`}>
                                        URL
                                      </Label>
                                      <Input
                                        id={`edit-url-${index}`}
                                        defaultValue={link?.url}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-title-${index}`}>
                                        Description
                                      </Label>
                                      <Input
                                        id={`edit-title-${index}`}
                                        defaultValue={link?.description}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        const urlInput =
                                          document.getElementById(
                                            `edit-url-${index}`
                                          ) as HTMLInputElement;
                                        const titleInput =
                                          document.getElementById(
                                            `edit-title-${index}`
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
                                      {load ? (
                                        <>
                                          <BiLoaderAlt className="animate-spin mr-2 w-4 h-4" />
                                          Updating...
                                        </>
                                      ) : (
                                        "Save Changes"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive"
                                  >
                                    <MdDelete className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Link
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {link.title}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteLink(link?.title)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {load ? (
                                        <BiLoaderAlt className="animate-spin w-4 h-4" />
                                      ) : (
                                        "Delete"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>{user.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={localStorage.getItem("image")}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2"
                  />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(share_link);
                    toast.success("Profile link copied!");
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Profile Link
                </Button>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your profile appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Profile Picture</Label>
                  <form onSubmit={(e) => handleImageUpload(e, updateImage)}>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={uploadLoader || !selectedImage}
                      >
                        {uploadLoader ? (
                          <BiLoaderAlt className="animate-spin w-4 h-4" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                <Separator />

                <div>
                  <Label>Theme Color</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["red", "blue", "green", "purple", "black"].map(
                      (color) => (
                        <Button
                          key={color}
                          variant={
                            selectedColor === color ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                          className="capitalize flex-1 min-w-0"
                        >
                          {color}
                        </Button>
                      )
                    )}
                  </div>
                  {selectedColor && (
                    <Button
                      onClick={handleColorChange}
                      className="w-full mt-2"
                      disabled={colorUploadLoader}
                    >
                      {colorUploadLoader ? (
                        <BiLoaderAlt className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        "Apply Color"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Link;
