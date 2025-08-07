import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ExternalLink,
  Sparkles,
  WandSparkles,
  Rocket,
  MoveUp,
  Share2,
  Copy,
  Check,
  Heart,
  Eye,
  Clock,
  Globe,
  Mail,
  User,
  ArrowRight,
  Star,
  Zap,
  Link,
} from "lucide-react";
import { getLinks, likeProfile, getProfileStats } from "@/api/User";
import { isLoggedIn } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AnimatedGradientText,
  FloatingCard,
  SparkleEffect,
  GradientButton,
} from "@/components/ui/aceternity";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
    </div>
  );
};

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          animate={{
            x: [0, Math.random() * window.innerWidth],
            y: [0, Math.random() * window.innerHeight],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: Math.random() * window.innerWidth,
            top: Math.random() * window.innerHeight,
          }}
        />
      ))}
    </div>
  );
};

const CreateProfileButton = () => {
  const [showMobileButton, setShowMobileButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        setShowMobileButton(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed right-6 bottom-6 z-50 hidden lg:block"
      >
        <motion.button
          onClick={() => navigate("/")}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-2xl px-8 py-4 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border border-white/20 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <WandSparkles className="w-6 h-6 text-white" />
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full blur-sm"
                animate={{
                  scale: isHovered ? 1.5 : 1,
                  opacity: isHovered ? 0.8 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <div className="flex flex-col items-start">
              <span className="text-white font-bold text-lg tracking-wide">
                Create Your Own
              </span>
              <span className="text-white/80 text-xs font-medium">
                Start building today
              </span>
            </div>

            <motion.div
              animate={{
                x: isHovered ? 5 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-5 h-5 text-white/90" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed right-4 bottom-4 z-50 hidden md:block lg:hidden"
      >
        <motion.button
          onClick={() => navigate("/")}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-xl px-6 py-3 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border border-white/20 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 flex items-center gap-2">
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              <WandSparkles className="w-5 h-5 text-white" />
            </motion.div>

            <span className="text-white font-semibold text-base">
              Create Profile
            </span>

            <motion.div
              animate={{
                x: isHovered ? 3 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-white/90" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showMobileButton && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            {/* Compact gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-800/90 to-gray-700/85 backdrop-blur-xl" />

            {/* Animated border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 opacity-15 blur-sm" />
              <div className="relative bg-gradient-to-t from-gray-900/90 via-gray-800/85 to-gray-700/80 backdrop-blur-xl py-3 px-4 rounded-t-2xl border-t border-white/10">
                <motion.button
                  onClick={() => navigate("/")}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full max-w-xs mx-auto overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-xl py-3 px-4 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border border-white/20"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <motion.div
                      animate={{
                        rotate: isHovered ? 360 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-base">
                        Create Your Own
                      </span>
                      <span className="text-white/80 text-xs font-medium">
                        Start building today
                      </span>
                    </div>

                    <motion.div
                      animate={{
                        y: isHovered ? -1 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <MoveUp className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Profile = () => {
  const user = isLoggedIn();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [profileStats, setProfileStats] = useState({
    views: 0,
    likes: 0,
    hasLiked: false,
  });
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks(id);
        setUserDetails(data);
        localStorage.setItem("cover", data.cover);
        localStorage.setItem("image", data.profile);

        const stats = await getProfileStats(id);
        setProfileStats(stats);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [id]);

  const handleCopyLink = async () => {
    const profileUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleLikeProfile = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await likeProfile(id);
      if (response.success) {
        setProfileStats((prev) => ({
          ...prev,
          likes: response.likes,
          hasLiked: response.liked,
        }));
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error liking profile:", error);
      toast.error("Failed to like profile");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-y-auto relative">
      <AnimatedBackground />
      <FloatingParticles />

      <div className="container mx-auto px-4 py-8 sm:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                P
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleLikeProfile}
              disabled={isLiking}
              variant="outline"
              size="sm"
              className={`${
                profileStats.hasLiked
                  ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              } backdrop-blur-sm transition-all duration-300`}
            >
              {isLiking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    profileStats.hasLiked ? "fill-current" : ""
                  }`}
                />
              )}
              {profileStats.likes}
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ProfileCard
            name={userDetails?.username}
            email={userDetails?.email}
            imageUrl={userDetails?.profile || userDetails?.image}
            color={userDetails?.colour}
            cover={userDetails?.cover}
            linksCount={userDetails?.Links?.length || 0}
            views={profileStats.views}
            likes={profileStats.likes}
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
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <p className="text-gray-300">Loading profile...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              {userDetails?.Links?.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <AnimatedGradientText className="text-2xl font-bold mb-2">
                      My Links
                    </AnimatedGradientText>
                    <p className="text-gray-300">
                      {userDetails.Links.length} link
                      {userDetails.Links.length !== 1 ? "s" : ""} available
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userDetails.Links.map((link, index) => (
                      <LinkCard
                        key={link._id}
                        link={link.url}
                        title={link.title}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <FloatingCard className="text-center py-12 max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                    <Link className="w-12 h-12 text-gray-400" />
                  </div>
                  <AnimatedGradientText className="text-xl font-semibold mb-2">
                    No links yet
                  </AnimatedGradientText>
                  <p className="text-gray-400">
                    This profile doesn't have any links to share.
                  </p>
                </FloatingCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateProfileButton />
    </div>
  );
};

const ProfileCard = ({
  name,
  email,
  imageUrl,
  color,
  cover,
  linksCount,
  views,
  likes,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl max-w-2xl mx-auto">
      <CardContent className="p-0">
        <div
          className="relative h-48 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400"
          style={{
            background: cover
              ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${cover})`
              : `linear-gradient(135deg, ${
                  color || "#3b82f6"
                } 0%, #06b6d4 50%, #14b8a6 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-4 right-4 flex gap-2">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Eye className="w-3 h-3 mr-1" />
              {views} views
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Heart className="w-3 h-3 mr-1" />
              {likes} likes
            </Badge>
          </div>
        </div>

        <div className="relative px-8 pb-8">
          {/* Avatar */}
          <div className="flex justify-center -mt-16 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage
                  src={imageUrl}
                  alt={name}
                  onLoad={() => setImageLoaded(true)}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl font-bold">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {!imageLoaded && imageUrl && (
                <Skeleton className="absolute inset-0 w-32 h-32 rounded-full" />
              )}

              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {name || "Anonymous User"}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-4 text-gray-300 mb-4"
            >
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{email || "No email provided"}</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div className="flex items-center gap-1">
                <Link className="w-4 h-4" />
                <span className="text-sm">{linksCount} links</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gray-300 text-sm max-w-md mx-auto"
            >
              Explore my links below to connect with me across different
              platforms.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 text-center"
          >
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">
                {linksCount}
              </div>
              <div className="text-xs text-gray-400">Links</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{views}</div>
              <div className="text-xs text-gray-400">Views</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-green-400">{likes}</div>
              <div className="text-xs text-gray-400">Likes</div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

const LinkCard = ({ link, title, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-purple-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
  ];

  const icons = [
    <Globe key="globe" className="w-6 h-6 text-white" />,
    <ExternalLink key="external" className="w-6 h-6 text-white" />,
    <Share2 key="share" className="w-6 h-6 text-white" />,
    <Star key="star" className="w-6 h-6 text-white" />,
    <Zap key="zap" className="w-6 h-6 text-white" />,
    <Rocket key="rocket" className="w-6 h-6 text-white" />,
  ];

  const extractDomain = (url) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch {
      return "link";
    }
  };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${
        colors[index % colors.length]
      } border border-white/20`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0"
          >
            {icons[index % icons.length]}
          </motion.div>

          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {title}
            </h3>
            <p className="text-sm text-white/80 truncate">
              {extractDomain(link)}
            </p>
          </div>

          <motion.div
            animate={{
              x: isHovered ? 5 : 0,
              opacity: isHovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.2 }}
            className="text-white/80"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.a>
  );
};

export default Profile;
