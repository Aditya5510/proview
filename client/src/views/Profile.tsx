import { getLinks } from "@/api/User";
import { isLoggedIn } from "@/helpers/authHelper";
import React from "react";
import { useParams } from "react-router-dom";
import { BiLoader } from "react-icons/bi";
import { motion } from "framer-motion";

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
  let { id } = useParams();
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    const getallLinks = () => {
      setLoad(true);
      getLinks(id as string).then((data) => {
        setUserDetails(data);
        localStorage.setItem("cover", data.cover);
        localStorage.setItem("image", data.profile);
        setLoad(false);
      });
    };
    getallLinks();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-fixed bg-cover bg-center overflow-y-auto"
      style={{
        backgroundImage: `url(${localStorage.getItem("cover")})`,
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProfileCard
              email={user?.email}
              name={user?.username}
              imageUrl={localStorage.getItem("image")}
              color={userDetails?.colour}
            />
          </motion.div>

          {load ? (
            <div className="flex justify-center items-center h-64">
              <BiLoader className="animate-spin h-16 w-16 text-white" />
            </div>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {userDetails?.Links?.map((link) => (
                <LinkCard key={link._id} link={link.url} title={link.title} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileCard = ({ name, email, imageUrl, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-white bg-opacity-90 shadow-xl rounded-xl p-6 text-center`}
    >
      <motion.img
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        src={imageUrl}
        alt="Profile"
        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
      />
      <h3 className={`font-bold text-2xl mt-4 text-${color}-600`}>{name}</h3>
      <p className="text-gray-600 mt-2">{email}</p>
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
      className="block bg-white bg-opacity-90 rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:shadow-xl"
    >
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        {title.toUpperCase()}
      </h4>
      <p className="text-sm text-blue-600 truncate hover:underline">{link}</p>
    </motion.a>
  );
};

export default Profile;
