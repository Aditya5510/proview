import { getLinks } from "@/api/User";
import { Navbar } from "@/component/Navbar";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { Button } from "@/components/ui/button";
import { BiLoader, BiShare } from "react-icons/bi";
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Title } from "@radix-ui/react-dialog";

interface UserDetails {
  colour: string;
  Links: {
    _id: string;
    url: string;
    title: string;
  }[];
}

const data = [
  { Button: FacebookShareButton, Icon: FacebookIcon, Title: "Facebook" },
  { Button: WhatsappShareButton, Icon: WhatsappIcon, Title: "Whatsapp" },
  {Button:InstapaperShareButton,Icon:InstapaperIcon,Title:"Instapaper"}
];
const DashBoard = () => {
  const user = isLoggedIn();
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(null);
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
      <div className="min-h-screen bg-fixed bg-cover bg-blur overflow-y-auto glassmorphism" style={{ backgroundImage: `url(${localStorage.getItem("cover")})` }}>
        <div className="relative">
          <div className="flex flex-col justify-center items-center pt-20">
            <div className="text-white text-center mt-[0rem] max-w-screen-lg mx-auto">
              <ProfileCard
                email={user.email}
                name={user.username}
                imageUrl={localStorage.getItem("image")}
                color={userDetails?.colour}
                shareLink={share_link}
              />
              {load ? (
                <div className="flex flex-col space-y-3">
                  <BiLoader className="animate-spin h-8 w-8 mx-auto text-black" />
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
    </>
  );
};



const ProfileCard = ({ name, email, imageUrl, color, shareLink }) => {
  return (
   <div className="min-w-[30vw] min-h-[auto] shadow-lg rounded-lg p-4 relative gap-2 flex flex-col mb-9 bg-opacity-25 backdrop-filter backdrop-blur-md backdrop-filter bg-${color}-400 bg-opacity-50 border border-${color}-500  ">

      <img
        src={imageUrl}
        alt="Profile"
        className="w-60 h-60 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
      />
      <h3 className="font-semibold text-3xl text-black">{name}</h3>
      <p className="text-sm text-black mb-1">{email}</p>
      <div className="absolute mb-1 ml-1 ">
        
        <DialogComponent data={data} shareLink={shareLink} text=""/>
      </div>
    </div>
  );
};

const LinkCard = ({ link, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-[40vh] text-wrap transition duration-300 ease-in-out transform hover:scale-105">
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
  );
};

export const  DialogComponent = ({ data, shareLink,text}) => {
  return (
    <div className="flex flex-wrap gap-3">
    <Dialog>
      <DialogTrigger className="rounded-md">
        
   {!text ?<BiShare className="bg-black text-white h-6 w-6 p-1 rounded-md"/> : <p className="underline">{text}</p>} 
      </DialogTrigger>
      <DialogContent>
        <div className="flex gap-3">
          {data.map((val, index) => (
            <div
              key={index}
              className="flex-col gap-2 items-center justify-center"
            >
              <val.Button url={shareLink}>
                <val.Icon />
              </val.Button>
              <p>{val.Title}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};



export default DashBoard;
