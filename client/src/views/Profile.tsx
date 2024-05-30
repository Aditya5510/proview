import { getLinks } from "@/api/User";

import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { useParams } from "react-router-dom";

import { BiLoader } from "react-icons/bi";


interface UserDetails {
    profile: string;
    cover: string;
  colour: string;
  username: string;
  email: string;

  Links: {
    _id: string;
    url: string;
    title: string;
  }[];
}

const Profile = () => {
  const user = isLoggedIn();
  let id = useParams();
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );
  const [load, setLoad] = React.useState(false);

  let extractedId=id.id as string;


  // console.log(extractedId);

  React.useEffect(() => {
    const getallLinks = () => {
      setLoad(true);
      getLinks(extractedId).then((data) => {
        setUserDetails(data);
        // console.log(data);
        localStorage.setItem("cover", data.cover);
        localStorage.setItem("image", data.profile);
        setLoad(false);
      });
    };
    getallLinks();
  }, [extractedId]);




  return (
    <>
       <div
        className="min-h-screen bg-fixed bg-cover bg-blur overflow-y-auto glassmorphism"
        style={{
          backgroundImage: `url(${localStorage.getItem("cover")})`,
        }}
      >
         <div className="min-h-screen bg-fixed bg-cover bg-blur overflow-y-auto glassmorphism" style={{ backgroundImage: `url(${localStorage.getItem("cover")})` }}>
        <div className="relative">
          <div className="flex flex-col justify-center items-center pt-20">
            <div className="text-white text-center mt-[0rem] max-w-screen-lg mx-auto">
                  <div>
                    <ProfileCard
                      email={user?.email}
                      name={user?.username}
                      imageUrl={localStorage.getItem("image")}
                      color={userDetails?.colour}
                    
                    />
                  </div>
                  {load ? (
                    <div className="flex flex-col space-y-3">
                      <BiLoader className="animate-spin h-10 w-10 mx-auto text-white" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4 mb-3">
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
        </div>
  
    </>
  );
};

const ProfileCard = ({ name, email, imageUrl, color }) => {
  return (
    <div
      className={`shadow-lg rounded-lg p-4 relative gap-2 flex flex-col mb-9 bg-opacity-25 backdrop-filter backdrop-blur-md backdrop-filter bg-${color}-400 bg-opacity-50 border border-${color}-500`}
    >
      <img
        src={imageUrl}
        alt="Profile"
        className="w-60 h-60 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
      />
         <h3 className="font-semibold text-3xl text-black">{name}</h3>
      <p className="text-sm text-black mb-1">{email}</p>
   
    </div>
  );
};

const LinkCard = ({ link, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-1 w-full max-w-[40vh] text-wrap transition duration-300 ease-in-out transform hover:scale-105">
      <h4 className="text-black text-[20px] font-semibold hover:text-blue-500">
        {title.toUpperCase()}
      </h4>
      <a
        href={link}
        className="text-black text-sm hover:text-blue-600 hover:underline"
      >
        {link}
      </a>
    </div>
  )
};

export default Profile;
