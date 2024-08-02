import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";
import { getLinks } from "@/api/User";
import { isLoggedIn } from "@/helpers/authHelper";
import { useDayRender } from "react-day-picker";

const Profile = () => {
  const user = isLoggedIn();
  let { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks(id);
        setUserDetails(data);
        // console.log(data);
        localStorage.setItem("cover", data.cover);
        localStorage.setItem("image", data.profile);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-y-auto">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileCard
            name={userDetails?.username}
            email={userDetails?.email}
            imageUrl={localStorage.getItem("image")}
            color={userDetails?.colour}
          />
        </motion.div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-40"
            >
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            >
              {userDetails?.Links?.map((link, index) => (
                <LinkCard
                  key={link._id}
                  link={link.url}
                  title={link.title}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProfileCard = ({ name, email, imageUrl, color }) => {
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
        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
      />
      <h3 className="font-bold text-3xl mt-4 text-white">{name}</h3>
      <p className="text-gray-200 mt-2">{email}</p>
    </motion.div>
  );
};

const LinkCard = ({ link, title, index }) => {
  const colors = [
    "from-blue-400 to-indigo-600",
    "from-green-400 to-teal-600",
    "from-yellow-400 to-orange-600",
    "from-pink-400 to-rose-600",
    "from-purple-400 to-indigo-600",
  ];

  const iconBackgrounds = [
    "bg-indigo-700",
    "bg-teal-700",
    "bg-orange-700",
    "bg-rose-700",
    "bg-purple-700",
  ];

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className={`block rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-2xl bg-gradient-to-r ${
        colors[index % colors.length]
      }`}
    >
      <div className="p-6 flex items-center">
        <div
          className={`w-12 h-12 rounded-full ${
            iconBackgrounds[index % iconBackgrounds.length]
          } flex items-center justify-center mr-4 flex-shrink-0`}
        >
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-white opacity-75 truncate">{link}</p>
        </div>
      </div>
      <div className="bg-black bg-opacity-20 px-6 py-2">
        <p className="text-xs text-white font-medium">Click to visit</p>
      </div>
    </motion.a>
  );
};

export default Profile;
