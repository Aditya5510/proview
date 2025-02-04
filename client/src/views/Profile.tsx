import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ExternalLink, ArrowRight, PlusCircle } from "lucide-react";
import { getLinks } from "@/api/User";
import { isLoggedIn } from "@/helpers/authHelper";

const CreateProfileButton = () => {
  const [showMobileButton, setShowMobileButton] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        setShowMobileButton(window.scrollY > 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const buttonContent = (
    <>
      <span className="relative inline-flex items-center gap-2">
        <PlusCircle
          className={`w-5 h-5 transition-transform duration-300 ${
            isHovered ? "rotate-180" : ""
          }`}
        />
        <span className="font-semibold tracking-wide">Create Your Own</span>
        <ArrowRight
          className={`w-5 h-5 transition-all duration-300 ${
            isHovered ? "translate-x-1 scale-110" : ""
          }`}
        />
      </span>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    </>
  );

  return (
    <>
      {/* Desktop Button */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50"
        >
          <motion.button
            onClick={() => navigate("/")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 animate-gradient-x" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-shimmer" />
            </div>
            <div className="relative z-10">{buttonContent}</div>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
          </motion.button>
        </motion.div>
      )}

      {/* Mobile Button */}
      <AnimatePresence>
        {isMobile && showMobileButton && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 inset-x-6 z-50"
          >
            <motion.button
              onClick={() => navigate("/")}
              whileTap={{ scale: 0.95 }}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 text-white px-6 py-3.5 rounded-xl shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 animate-gradient-x" />
              <div className="relative z-10">{buttonContent}</div>
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Add these to your global CSS or tailwind.config.js
const styles = `

`;

const Profile = () => {
  const user = isLoggedIn();
  const { id } = useParams();
  const navigate = useNavigate();
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
            cover={localStorage.getItem("cover")}
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

      <CreateProfileButton />
    </div>
  );
};

const ProfileCard = ({ name, email, imageUrl, color, cover }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 text-center max-w-md mx-auto"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundColor: color }}
      ></div>
      <div className="relative z-10">
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
      </div>
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
