import { getLinks } from "@/api/User";
import { Navbar } from "@/component/Navbar";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { Button } from "@/components/ui/button";
import { BiLoader, BiShare } from "react-icons/bi";

interface UserDetails {
  colour: string;
  Links: {
    _id: string;
    url: string;
    title: string;
  }[];
}

const DashBoard = () => {
  const user = isLoggedIn();
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    const getallLinks = () => {
      setLoad(true);
      getLinks(user?.userId).then((data) => {
        setUserDetails(data);
        setLoad(false);
      });
    };
    getallLinks();
  }, []);

  const share_link = `https://proview-six.vercel.app/data/${user?.userId}`;

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-fixed bg-cover bg-blur overflow-y-auto glassmorphism" // Apply glassmorphism class
        style={{
          backgroundImage: `url(${localStorage.getItem("cover")})`,
        }}
      >
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[100vw]">
            <div className="relative">
              <div className="absolute inset-0 bg-black opacity-60"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center pt-20">
                <div className="text-white text-center mt-[50rem]">
                  <div>
                    <ProfileCard
                      email={user.email}
                      name={user.username}
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
      </div>
    </>
  );
};


const ProfileCard = ({ name, email, imageUrl, color }) => {
  return (
    <div className={`shadow-lg rounded-lg p-4 relative gap-2 flex flex-col mb-9 bg-opacity-25 backdrop-filter backdrop-blur-md backdrop-filter bg-${color}-400 bg-opacity-50 border border-${color}-500`}>
      <img
        src={imageUrl}
        alt="Profile"
        className="w-60 h-60 mx-auto rounded-lg"
      />
      <h3 className="font-semibold text-3xl text-white">{name}</h3>
      <p className="text-sm text-white mb-1">{email}</p>
      <Button className="absolute top-2 right-2">
        <BiShare className="text-blue" />
      </Button>
    </div>
  );
};


const LinkCard = ({ link, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-1 w-full max-w-[40vh] text-wrap transition duration-300 ease-in-out transform hover:scale-105">
      <h4 className="text-black text-[20px] font-semibold hover:text-blue-500">
        {title.toUpperCase()}
      </h4>
      <a href={link} className="text-blue-400 text-sm hover:text-blue-600 hover:underline">
        {link}
      </a>
    </div>
  );
};


export default DashBoard;
