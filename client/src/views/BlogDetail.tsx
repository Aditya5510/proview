import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "@/api/Blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/component/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogDetail: React.FC = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBlogById(blogId as string);
        if (res.success) setBlog(res.blog);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [blogId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {!loading && blog && (
          <article className="space-y-8">
            {/* Header */}
            <header className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <time dateTime={blog.createdAt}>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <time>
                  {new Date(blog.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </header>

            {/* Featured Image */}
            {blog.image && (
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[300px] md:h-[500px] object-cover"
                />
              </div>
            )}

            {/* Video Link */}
            {blog.videoUrl && (
              <div className="flex justify-center">
                <a
                  href={blog.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6L8 12V6l5.5 2z" />
                  </svg>
                  Watch Video
                </a>
              </div>
            )}

            {/* Content */}
            {blog.content && (
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {blog.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}
          </article>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
