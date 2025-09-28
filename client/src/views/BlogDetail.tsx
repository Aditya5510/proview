import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "@/api/Blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/component/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
                  <div
                    className="prose prose-lg md:prose-xl max-w-none dark:prose-invert 
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:leading-relaxed prose-p:mb-8 prose-p:mt-6
                    prose-h1:mb-10 prose-h1:mt-16 prose-h1:text-5xl prose-h1:leading-tight
                    prose-h2:mb-8 prose-h2:mt-12 prose-h2:text-4xl prose-h2:leading-tight
                    prose-h3:mb-6 prose-h3:mt-10 prose-h3:text-3xl prose-h3:leading-tight
                    prose-h4:mb-4 prose-h4:mt-8 prose-h4:text-2xl prose-h4:leading-tight
                    prose-h5:mb-3 prose-h5:mt-6 prose-h5:text-xl prose-h5:leading-tight
                    prose-h6:mb-2 prose-h6:mt-4 prose-h6:text-lg prose-h6:leading-tight
                    prose-ul:mb-8 prose-ul:mt-6 prose-li:mb-3 prose-li:leading-relaxed
                    prose-ol:mb-8 prose-ol:mt-6 prose-li:mb-3 prose-li:leading-relaxed
                    prose-blockquote:mb-8 prose-blockquote:mt-6 prose-blockquote:pl-8 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic
                    prose-code:bg-muted prose-code:px-3 prose-code:py-2 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-lg prose-pre:mb-8 prose-pre:mt-6
                    prose-img:rounded-lg prose-img:shadow-md prose-img:mb-8 prose-img:mt-6
                    prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700 hover:prose-a:decoration-2
                    dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
                    prose-strong:font-semibold prose-strong:text-foreground
                    prose-em:italic prose-em:text-foreground
                    prose-hr:my-8 prose-hr:border-border
                    [&_div[style*='border-left']]:my-8 [&_div[style*='border-left']]:pl-8 [&_div[style*='border-left']]:border-l-4 [&_div[style*='border-left']]:rounded-l-sm"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        div: ({ style, children, ...props }) => {
                          // Check if this is a side color bar div
                          if (style && style.borderLeft && style.paddingLeft) {
                            return (
                              <div
                                style={style}
                                className="my-8 pl-8 border-l-4 rounded-l-sm"
                                {...props}
                              >
                                {children}
                              </div>
                            );
                          }
                          return <div {...props}>{children}</div>;
                        },
                      }}
                    >
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
