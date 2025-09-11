import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, likeBlog } from "@/api/Blog";
import { useAuth } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Heart,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  ExternalLink,
  Twitter,
  Facebook,
  Linkedin,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ShareBlog: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const user = useAuth();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        const res = await getBlogById(blogId, user);
        if (res.success) {
          setBlog(res.blog);
          setViews(res.blog.views || 0);
          setLikes(res.blog.likes || 0);
          setIsLiked(res.blog.likedBy?.includes(user?.userId) || false);
        } else {
          toast.error(res.error || "Failed to load blog.");
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "Check out this blog";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  const handleLike = async () => {
    console.log("User:", user); // Debug log
    console.log("BlogId:", blogId); // Debug log

    if (!user) {
      toast.error("Please login to like this blog");
      return;
    }

    try {
      const res = await likeBlog(user, blogId!);
      console.log("Like response:", res); // Debug log
      if (res.success) {
        setLikes(res.likes);
        setIsLiked(res.liked);
        toast.success(res.liked ? "Thanks for the like! ❤️" : "Like removed");
      } else {
        toast.error(res.error || "Failed to like blog");
      }
    } catch (err) {
      toast.error("An error occurred while liking the blog");
      console.error("Error liking blog:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading your story...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Blog not found
            </h2>
            <Button onClick={() => navigate("/blogs")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/blogs")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{views} views</span>
              </div>
              <Button
                onClick={handleLike}
                variant={isLiked ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {likes}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          {/* Title */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog?.user?.name?.split(" ")[0] || "Author"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{views} views</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {blog.image && (
            <div className="mb-12 overflow-hidden rounded-xl shadow-lg">
              <img
                src={blog.image}
                alt="Blog cover"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Video */}
          {blog.videoUrl && (
            <div className="mt-12 mb-12 p-6 bg-muted rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Related Video
              </h3>
              <a
                href={blog.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Watch Video
              </a>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-16 border-t pt-8">
            <h3 className="text-lg font-semibold mb-6 text-foreground">
              Share this story
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleShare("copy")}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => handleShare("twitter")}
                variant="outline"
                size="sm"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare("facebook")}
                variant="outline"
                size="sm"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={() => handleShare("linkedin")}
                variant="outline"
                size="sm"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ShareBlog;
