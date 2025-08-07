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
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Facebook,
  RefreshCw,
} from "lucide-react";
import {
  getLinks,
  likeProfile,
  getProfileStats,
  getPublicCustomization,
} from "@/api/User";
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

// Customization interface
interface CustomizationSettings {
  theme: string;
  font: string;
  animation: string;
  backgroundPattern: string;
  darkMode: boolean;
  animationSpeed: number;
}

// Theme configurations
const themes = {
  minimal: {
    background: "bg-gradient-to-br from-gray-50 to-gray-100",
    card: "bg-white/80 backdrop-blur-sm border border-gray-200/50",
    text: "text-gray-900",
    accent: "text-gray-600",
    button: "bg-gray-900 text-white hover:bg-gray-800",
    linkCard:
      "bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white",
  },
  elegant: {
    background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    card: "bg-white/10 backdrop-blur-xl border border-white/20",
    text: "text-white",
    accent: "text-gray-300",
    button: "bg-white/20 text-white border border-white/30 hover:bg-white/30",
    linkCard:
      "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20",
  },
  modern: {
    background: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    card: "bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl",
    text: "text-gray-800",
    accent: "text-gray-600",
    button:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    linkCard:
      "bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white shadow-lg",
  },
  classic: {
    background: "bg-gradient-to-br from-amber-50 to-orange-50",
    card: "bg-white/90 backdrop-blur-sm border border-amber-200/50 shadow-lg",
    text: "text-gray-800",
    accent: "text-gray-600",
    button:
      "bg-amber-800 text-white hover:bg-amber-900 border border-amber-700",
    linkCard:
      "bg-white/90 backdrop-blur-sm border border-amber-200/50 hover:bg-white shadow-md",
  },
};

// Font configurations
const fonts = {
  inter: "font-inter",
  poppins: "font-poppins",
  roboto: "font-roboto",
  playfair: "font-playfair",
  montserrat: "font-montserrat",
  opensans: "font-opensans",
  raleway: "font-raleway",
  nunito: "font-nunito",
  sourcecodepro: "font-sourcecodepro",
  merriweather: "font-merriweather",
  lora: "font-lora",
  noto: "font-noto",
  oswald: "font-oswald",
  monospace: "font-monospace",
};

// Animation configurations
const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, type: "spring", stiffness: 200, damping: 10 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
  flip: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 15 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, type: "spring", stiffness: 150, damping: 12 },
  },
  slideleft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  slideright: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.8, type: "spring", stiffness: 120, damping: 14 },
  },
  elastic: {
    initial: { opacity: 0, scale: 0.1 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1, type: "spring", stiffness: 300, damping: 8 },
  },
};

const backgroundPatterns = {
  none: "",
  gradient: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
  geometric:
    "bg-[radial-gradient(circle_at_25%_25%,rgba(0,0,0,0.02)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.02)_0%,transparent_50%)] bg-[length:60px_60px]",
  organic:
    "bg-[radial-gradient(circle_at_25%_25%,rgba(0,0,0,0.02)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.02)_0%,transparent_50%)] bg-[length:60px_60px]",
  minimal:
    "bg-[linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[length:30px_30px]",
};

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  default: Globe,
};

const getSocialIcon = (url: string) => {
  const domain = url.toLowerCase();
  if (domain.includes("instagram")) return socialIcons.instagram;
  if (domain.includes("twitter") || domain.includes("x.com"))
    return socialIcons.twitter;
  if (domain.includes("youtube")) return socialIcons.youtube;
  if (domain.includes("github")) return socialIcons.github;
  if (domain.includes("linkedin")) return socialIcons.linkedin;
  if (domain.includes("facebook")) return socialIcons.facebook;
  return socialIcons.default;
};

const Profile = () => {
  const user = isLoggedIn();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [customization, setCustomization] = useState<CustomizationSettings>({
    theme: "minimal",
    font: "inter",
    animation: "fade",
    backgroundPattern: "none",
    darkMode: false,
    animationSpeed: 0.5,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [profileStats, setProfileStats] = useState({
    views: 0,
    likes: 0,
    hasLiked: false,
  });
  const [isLiking, setIsLiking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching profile data for user ID:", id);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const [userData, customizationData, statsData] = await Promise.all([
          getLinks(id),
          getPublicCustomization(id),
          getProfileStats(id),
        ]);

        console.log("User data:", userData);
        console.log("Customization data:", customizationData);
        console.log("Stats data:", statsData);

        setUserDetails(userData);
        if (customizationData.success) {
          console.log(
            "Setting customization:",
            customizationData.customization
          );
          setCustomization(customizationData.customization);
        } else {
          console.log("No customization data found, using defaults");
        }
        setProfileStats(statsData);

        localStorage.setItem("cover", userData.cover);
        localStorage.setItem("image", userData.profile);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const [userData, customizationData, statsData] = await Promise.all([
        getLinks(id),
        getPublicCustomization(id),
        getProfileStats(id),
      ]);

      setUserDetails(userData);
      if (customizationData.success) {
        console.log(
          "Refreshed customization:",
          customizationData.customization
        );
        setCustomization(customizationData.customization);
        toast.success("Profile refreshed!");
      }
      setProfileStats(statsData);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast.error("Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentTheme = themes[customization.theme] || themes.minimal;
  const currentFont = fonts[customization.font] || fonts.inter;
  const currentAnimation =
    animations[customization.animation] || animations.fade;
  const currentBackgroundPattern =
    backgroundPatterns[customization.backgroundPattern] || "";

  if (loading) {
    return (
      <div
        className={`min-h-screen ${currentTheme.background} ${currentBackgroundPattern}`}
      >
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        currentTheme.background
      } ${currentBackgroundPattern} ${customization.darkMode ? "dark" : ""}`}
    >
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with stats */}
        <motion.div
          initial={currentAnimation.initial}
          animate={currentAnimation.animate}
          transition={currentAnimation.transition}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className={`${currentTheme.button} text-xs`}
            >
              <Eye className="w-3 h-3 mr-1" />
              {profileStats.views} views
            </Badge>
            <Badge
              variant="secondary"
              className={`${currentTheme.button} text-xs`}
            >
              <Heart className="w-3 h-3 mr-1" />
              {profileStats.likes} likes
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleLikeProfile}
              disabled={isLiking}
              variant="outline"
              size="sm"
              className={`${
                profileStats.hasLiked
                  ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : currentTheme.button
              } text-xs`}
            >
              {isLiking ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Heart
                  className={`w-3 h-3 mr-1 ${
                    profileStats.hasLiked ? "fill-current" : ""
                  }`}
                />
              )}
              {profileStats.likes}
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className={`${currentTheme.button} text-xs`}
            >
              {isRefreshing ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className={`${currentTheme.button} text-xs`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Share
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={currentAnimation.initial}
          animate={currentAnimation.animate}
          transition={{ ...currentAnimation.transition, delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`${currentTheme.card} shadow-xl`}>
            <CardContent className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                  <AvatarImage
                    src={userDetails?.profile || userDetails?.image}
                    alt={userDetails?.username}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold">
                    {userDetails?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`text-2xl font-bold ${currentTheme.text} ${currentFont} mb-2`}
              >
                {userDetails?.username || "Anonymous User"}
              </motion.h1>

              {/* Email */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`text-sm ${currentTheme.accent} ${currentFont} mb-6`}
              >
                {userDetails?.email || "No email provided"}
              </motion.p>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-sm ${currentTheme.accent} ${currentFont} mb-6`}
              >
                Explore my links below to connect with me across different
                platforms.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={`text-xs ${currentTheme.accent} ${currentFont} mb-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <span>Theme: {customization.theme}</span>
                  <span>Font: {customization.font}</span>
                  <span>Animation: {customization.animation}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-3 gap-4"
              >
                <div
                  className={`${currentTheme.linkCard} rounded-lg p-3 text-center`}
                >
                  <div className="text-lg font-bold text-blue-600">
                    {userDetails?.Links?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Links</div>
                </div>
                <div
                  className={`${currentTheme.linkCard} rounded-lg p-3 text-center`}
                >
                  <div className="text-lg font-bold text-green-600">
                    {profileStats.views}
                  </div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                <div
                  className={`${currentTheme.linkCard} rounded-lg p-3 text-center`}
                >
                  <div className="text-lg font-bold text-red-600">
                    {profileStats.likes}
                  </div>
                  <div className="text-xs text-gray-500">Likes</div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={currentAnimation.initial}
          animate={currentAnimation.animate}
          transition={{ ...currentAnimation.transition, delay: 0.2 }}
          className="space-y-4"
        >
          {userDetails?.Links?.length > 0 ? (
            userDetails.Links.map((link, index) => (
              <LinkCard
                key={link._id}
                link={link}
                index={index}
                theme={currentTheme}
                font={currentFont}
                animation={currentAnimation}
                delay={0.3 + index * 0.1}
              />
            ))
          ) : (
            <motion.div
              initial={currentAnimation.initial}
              animate={currentAnimation.animate}
              transition={{ ...currentAnimation.transition, delay: 0.3 }}
            >
              <Card className={`${currentTheme.card} text-center py-12`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Link className="w-8 h-8 text-gray-400" />
                </div>
                <h3
                  className={`text-lg font-semibold ${currentTheme.text} mb-2`}
                >
                  No links yet
                </h3>
                <p className={`text-sm ${currentTheme.accent}`}>
                  This profile doesn't have any links to share.
                </p>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {!user && (
          <motion.div
            initial={currentAnimation.initial}
            animate={currentAnimation.animate}
            transition={{ ...currentAnimation.transition, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={() => navigate("/")}
              className={`${currentTheme.button} w-full`}
            >
              <WandSparkles className="w-4 h-4 mr-2" />
              Create Your Own Profile
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const LinkCard = ({ link, index, theme, font, animation, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const SocialIcon = getSocialIcon(link.url);

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
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={animation.initial}
      animate={animation.animate}
      transition={{ ...animation.transition, delay }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group block ${theme.linkCard} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <SocialIcon className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex-grow min-w-0">
          <h3
            className={`text-lg font-semibold ${theme.text} ${font} mb-1 truncate`}
          >
            {link.title}
          </h3>
          <p className={`text-sm ${theme.accent} ${font} truncate`}>
            {extractDomain(link.url)}
          </p>
          {link.description && (
            <p className={`text-xs ${theme.accent} ${font} mt-1 line-clamp-2`}>
              {link.description}
            </p>
          )}
        </div>

        <motion.div
          animate={{
            x: isHovered ? 5 : 0,
            opacity: isHovered ? 1 : 0.7,
          }}
          transition={{ duration: 0.2 }}
          className={`${theme.accent}`}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.a>
  );
};

export default Profile;
