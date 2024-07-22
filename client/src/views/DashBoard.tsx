import { motion, AnimatePresence } from "framer-motion";
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
  { Button: InstapaperShareButton, Icon: InstapaperIcon, Title: "Instapaper" },
];

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-y-auto"
      >
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileCard
              email={user.email}
              name={user.username}
              imageUrl={localStorage.getItem("image")}
              color={userDetails?.colour}
              shareLink={share_link}
            />
          </motion.div>

          <AnimatePresence>
            {load ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-40"
              >
                <BiLoader className="animate-spin h-12 w-12 text-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
              >
                {userDetails?.Links?.map((link) => (
                  <LinkCard key={link._id} link={link.url} title={link.title} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

const ProfileCard = ({ name, email, imageUrl, color, shareLink }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 relative text-center max-w-md mx-auto"
    >
      <motion.img
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        src={imageUrl}
        alt="Profile"
        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gray-200 shadow-lg"
      />
      <h3 className="font-bold text-2xl mt-4 text-white">{name}</h3>
      <p className="text-gray-300 mt-2">{email}</p>
      <div className="absolute top-4 right-4">
        <DialogComponent data={data} shareLink={shareLink} text="" />
      </div>
    </motion.div>
  );
};

const LinkCard = ({ link, title }) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="block bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:shadow-xl"
    >
      <h4 className="text-lg font-semibold text-white mb-2">
        {title.toUpperCase()}
      </h4>
      <p className="text-sm text-gray-300 truncate hover:underline">{link}</p>
    </motion.a>
  );
};

export const DialogComponent = ({ data, shareLink, text }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 size-9"
        >
          {!text ? <BiShare className="h-4 w-4" /> : text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white">
        <div className="flex justify-around items-center pt-4">
          {data.map((val, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <val.Button url={shareLink}>
                <val.Icon size={32} round />
              </val.Button>
              <p className="text-sm text-gray-300">{val.Title}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashBoard;
