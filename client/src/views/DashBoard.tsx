import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLinks } from "@/api/User";
import { Navbar } from "@/component/Navbar";
import { isLoggedIn } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Globe,
  QrCode,
  Settings,
  Plus,
  Share2,
} from "lucide-react";
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface UserDetails {
  colour: string;
  Links: {
    _id: string;
    url: string;
    title: string;
  }[];
}

const shareButtons = [
  { Button: FacebookShareButton, Icon: FacebookIcon, Title: "Facebook" },
  { Button: WhatsappShareButton, Icon: WhatsappIcon, Title: "WhatsApp" },
  { Button: InstapaperShareButton, Icon: InstapaperIcon, Title: "Instapaper" },
];

const QuickActions = ({
  userId,
  linksCount,
}: {
  userId: string;
  linksCount: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Manage your profile and links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => (window.location.href = "/link")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Link
        </Button>

        <QRCodeGenerator
          url={`https://proview-7pk6.vercel.app/data/${userId}`}
          title="Profile QR Code"
          description="Share your profile"
        />

        {linksCount > 0 && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => (window.location.href = "/link")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Links
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const DashBoard = () => {
  const user = isLoggedIn();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks(user?.userId);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [user?.userId]);

  const shareLink = `https://proview-7pk6.vercel.app/data/${user?.userId}`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your profile and links
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <QuickActions
                userId={user?.userId}
                linksCount={userDetails?.Links?.length || 0}
              />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Preview */}
              <ProfileCard
                email={user.email}
                name={user.username}
                imageUrl={localStorage.getItem("image")}
                color={userDetails?.colour}
                shareLink={shareLink}
                cover={localStorage.getItem("cover")}
                linksCount={userDetails?.Links?.length || 0}
              />

              {/* Links Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Links</CardTitle>
                      <CardDescription>
                        {userDetails?.Links?.length || 0} links in your profile
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => (window.location.href = "/link")}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : userDetails?.Links?.length === 0 ? (
                    <div className="text-center py-12">
                      <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No links yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first link to get started
                      </p>
                      <Button onClick={() => (window.location.href = "/link")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Link
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userDetails?.Links?.map((link) => (
                        <LinkCard
                          key={link._id}
                          link={link.url}
                          title={link.title}
                          description={(link as any).description || link.title}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileCard = ({
  name,
  email,
  imageUrl,
  shareLink,
  color,
  cover,
  linksCount,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Preview</CardTitle>
        <CardDescription>How your profile appears to visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Profile Info */}
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="relative">
              <img
                src={imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {linksCount} {linksCount === 1 ? "link" : "links"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <DialogComponent shareLink={shareLink} />
            <CopyToClipboardButton text={shareLink} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const LinkCard = ({ link, title, description }) => {
  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Invalid URL";
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <ExternalLink className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {extractDomain(link)}
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export const DialogComponent = ({ shareLink }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Share Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              Choose how you'd like to share
            </p>
          </div>
          <div className="flex justify-around items-center">
            {shareButtons.map((ShareButton, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <ShareButton.Button url={shareLink}>
                  <ShareButton.Icon size={32} round />
                </ShareButton.Button>
                <p className="text-xs text-muted-foreground">
                  {ShareButton.Title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CopyToClipboardButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

export default DashBoard;
