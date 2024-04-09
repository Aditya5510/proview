import { AddLink, updateLink1, updatentries } from "@/api/User";
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
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { link } from "fs";

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
  }, [loading]);

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
      if (response?.succes === true) {
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
                  <div className="flex items-center justify-between px-2">
                    <div className="grid gap-2">
                      <h1 className="text-3xl font-semibold">Edit Links</h1>
                      <p className="text-gray-500">
                        Add or Remove links from your profile
                      </p>
                    </div>
                  </div>

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
                        <CardContent>
                          {linkData?.map((link: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-4 border border-gray-200 rounded-md mb-2 justify-between"
                            >
                              <div className="flex flex-col justify-center">
                                <p className="text-lg font-semibold">
                                  {link.title.toUpperCase()}
                                </p>
                                <p className="text-gray-500">{link.url}</p>
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
                                          value={link?.url}
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
                                          value={link?.description}
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
                                              link?.description,
                                              link?.url,
                                              link?.description
                                            )
                                          }
                                        >
                                          Save
                                        </Button>
                                      )}{" "}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="link"
                                  className=" text-red-600"
                                >
                                  <MdDelete className="h-5 w-5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </CardContent>
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
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Profile</CardDescription>
                    <CardContent></CardContent>
                  </CardHeader>
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
