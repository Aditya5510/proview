import { getLinks } from "@/api/User";
import { Navbar } from "@/component/Navbar";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { useParams } from "react-router-dom";
import DEP from "../config";
import { Skeleton } from "@/components/ui/skeleton";
import { BiLoader } from "react-icons/bi";

interface UserDetails {
  Links: {
    _id: string;
    url: string;
    title: string;
  }[];
}

const DashBoard = () => {
  const user = isLoggedIn();
  let id = useParams();
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );
  const [load, setLoad] = React.useState(false);

  let extractedId;

  if (!id || Object.keys(id).length === 0) {
    extractedId = user.userId;
  } else {
    extractedId = id;
  }

  React.useEffect(() => {
    const getallLinks = () => {
      setLoad(true);
      getLinks(extractedId).then((data) => {
        setUserDetails(data);
        // console.log(data);
        setLoad(false);
      });
    };
    getallLinks();
  }, [extractedId]);

  let DEP = "https://proview-six.vercel.app/link/";

  // console.log(extractedId);
  return (
    <>
      {extractedId === user.userId ? <Navbar /> : null}
      <div className="flex justify-center">
        <div className="w-full max-w-[100vw]">
          <div className="relative w-full bg-cover bg-center min-h-screen flex items-center justify-center">
            {/* Background image with blur */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg')",
                filter: "blur(10px)",
              }}
            ></div>
            {/* Overlay text */}
            <div className="absolute  text-white text-1xl font-bold text-center">
              <div>
                <ProfileCard
                  email={user.email}
                  name={user.username}
                  imageUrl={user.profile}
                />
              </div>
              {load ? (
                <>
                  <div className="flex flex-col space-y-3">
                    <BiLoader className="animate-spin h-10 w-10 mx-auto text-black" />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                  {((userDetails?.Links ?? []) as any)?.map((link: any) => (
                    <LinkCard
                      key={link?._id}
                      link={link?.url}
                      title={link?.title}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileCard = ({ name, email, imageUrl }) => {
  return (
    <div className="bg-black shadow-md rounded-lg min-w-60 p-2">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-16 h-16  mx-auto mb-2 rounded-lg"
      />
      <h3 className="font-semibold text-3xl">{name}</h3>
      <p className="text-sm text-slate-800 mb-1 ">{email}</p>
    </div>
  );
};

const LinkCard = ({ link, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-1 w-full max-w-[40vh] ">
      <h4 className=" text-black text-[20px]  font-semibold ">
        {title.toUpperCase()}
      </h4>
      <a href={link} className="text-blue-400 text-sm hover:underline">
        {link}
      </a>
    </div>
  );
};

export default DashBoard;
