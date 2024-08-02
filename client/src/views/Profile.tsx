import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";
import { getLinks } from "@/api/User";
import { isLoggedIn } from "@/helpers/authHelper";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-y-auto">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileCard
            name={user?.username}
            email={user?.email}
            imageUrl={localStorage.getItem("image")}
            coverUrl={localStorage.getItem("cover")}
          />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
      </div>
    </div>
  );
};

const ProfileCard = ({ name, email, imageUrl, coverUrl }) => {
  return (
    <div className="relative mb-16">
      <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
      <img
        src={coverUrl}
        alt="Cover"
        className="w-full h-64 object-cover rounded-lg shadow-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
        />
        <h2 className="text-3xl font-bold">{name}</h2>
        <p className="text-lg opacity-75">{email}</p>
      </div>
    </div>
  );
};

const LinkCard = ({ link, title, index }) => {
  const colors = [
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-500",
    "from-pink-400 to-rose-500",
    "from-purple-400 to-indigo-500",
  ];

  const iconBackgrounds = [
    "bg-indigo-600",
    "bg-teal-600",
    "bg-orange-600",
    "bg-rose-600",
    "bg-purple-600",
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
      <div className="bg-white bg-opacity-20 px-6 py-2">
        <p className="text-xs text-white font-medium">Click to visit</p>
      </div>
    </motion.a>
  );
};

export default Profile;
