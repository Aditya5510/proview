import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllBlogs } from "@/api/Blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/component/Navbar";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  BookOpen,
  FileText,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogList: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllBlogs(id as string);
        if (res.success) setBlogs(res.blogs || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/blogs")}
              className="bg-white/80 hover:bg-white border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Card
              key={b._id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/share-blog/${b._id}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {b.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(b.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{b.views || 0}</span>
                  </div>
                </CardDescription>
              </CardHeader>

              {b.image && (
                <div className="overflow-hidden">
                  <img
                    src={b.image}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    alt="Blog cover"
                  />
                </div>
              )}

              <CardContent className="space-y-4">
                {b.content && (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {b.content.length > 120
                        ? b.content.substring(0, 120) + "..."
                        : b.content}
                    </ReactMarkdown>
                  </div>
                )}

                {b.videoUrl && (
                  <div className="bg-muted p-2 rounded-lg">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Contains Video
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">
                      {b.likes || 0}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No blogs found
            </h3>
            <p className="text-muted-foreground">
              This user hasn't published any stories yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
