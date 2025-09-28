import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/helpers/authHelper";
import { createBlog, getMyBlogs, deleteBlog, BlogPayload } from "@/api/Blog";
import { toast } from "sonner";
import { Navbar } from "@/component/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BiLoaderAlt } from "react-icons/bi";
import {
  Bold,
  Italic,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  ImageIcon,
  Video,
  Save,
  Trash2,
  PenTool,
  Calendar,
  Heart,
  Share2,
  ExternalLink,
  FileText,
  Sparkles,
  Palette,
  Upload,
  X,
  Image as ImageLucide,
} from "lucide-react";

interface BlogForm {
  title: string;
  content: string;
  image: string;
  videoUrl: string;
}

const Blogs: React.FC = () => {
  const user = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<BlogForm>({
    title: "",
    content: "",
    image: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (user) {
      fetchMyBlogs();
    }
  }, [user]);

  const fetchMyBlogs = async () => {
    try {
      const res = await getMyBlogs(user);
      if (res.success) {
        setBlogs(res.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("key", import.meta.env.VITE_IMGBB_API_KEY);
    formData.append("image", file);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data?.status === 200) {
      return data.data.url;
    } else {
      throw new Error("Failed to upload image");
    }
  };

  const insertImageAtCursor = (imageUrl: string, altText: string = "Image") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const imageMarkdown = `![${altText}](${imageUrl})`;
    const newContent =
      form.content.substring(0, start) +
      imageMarkdown +
      form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + imageMarkdown.length,
        start + imageMarkdown.length
      );
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) {
      toast.error("Please drop image files only");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `temp-${Date.now()}-${i}`;

      setUploadingImages((prev) => [...prev, tempId]);

      try {
        const imageUrl = await uploadImageToImgBB(file);
        setUploadedImages((prev) => [...prev, imageUrl]);

        const altText = file.name.split(".")[0];
        insertImageAtCursor(imageUrl, altText);

        toast.success(`Image ${i + 1} uploaded successfully!`);
      } catch (error) {
        toast.error(`Failed to upload image ${i + 1}`);
        console.error("Error uploading image:", error);
      } finally {
        setUploadingImages((prev) => prev.filter((id) => id !== tempId));
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `temp-${Date.now()}-${i}`;

      setUploadingImages((prev) => [...prev, tempId]);

      try {
        const imageUrl = await uploadImageToImgBB(file);
        setUploadedImages((prev) => [...prev, imageUrl]);

        const altText = file.name.split(".")[0];
        insertImageAtCursor(imageUrl, altText);

        toast.success(`Image ${i + 1} uploaded successfully!`);
      } catch (error) {
        toast.error(`Failed to upload image ${i + 1}`);
        console.error("Error uploading image:", error);
      } finally {
        setUploadingImages((prev) => prev.filter((id) => id !== tempId));
      }
    }

    e.target.value = "";
  };

  const insertMarkdown = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);
    const newText = prefix + selectedText + suffix;

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const insertVideoPlaceholder = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const placeholder = selectedText || "Paste your video URL here";
    const newText = `<video controls>\n  <source src="${placeholder}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`;

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + newText.indexOf(placeholder),
        start + newText.indexOf(placeholder) + placeholder.length
      );
    }, 0);
  };

  const insertImagePlaceholder = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const placeholder = selectedText || "Paste your image URL here";
    const newText = `![${placeholder}](image-url)`;

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + newText.indexOf("image-url"),
        start + newText.indexOf("image-url") + 9
      );
    }, 0);
  };

  const insertImageFromUrl = (imageUrl: string, altText: string = "Image") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const imageMarkdown = `![${altText}](${imageUrl})`;
    const newContent =
      form.content.substring(0, start) +
      imageMarkdown +
      form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + imageMarkdown.length,
        start + imageMarkdown.length
      );
    }, 0);
  };

  const insertLinkPlaceholder = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const placeholder = selectedText || "Link text";
    const newText = `[${placeholder}](url)`;

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + newText.indexOf("url"),
        start + newText.indexOf("url") + 3
      );
    }, 0);
  };

  const insertCodeBlockPlaceholder = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    const placeholder = selectedText || "Your code here";
    const newText = `\`\`\`\n${placeholder}\n\`\`\``;

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 4, start + 4 + placeholder.length);
    }, 0);
  };

  const insertSideColor = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);

    if (selectedText) {
      // Wrap selected text with side color bar
      const newText = `<div style="border-left: 4px solid ${backgroundColor}; padding-left: 12px; margin: 8px 0;">${selectedText}</div>`;
      const newContent =
        form.content.substring(0, start) +
        newText +
        form.content.substring(end);

      setForm((prev) => ({ ...prev, content: newContent }));

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + newText.length,
          start + newText.length
        );
      }, 0);
    } else {
      // Insert a placeholder with side color bar
      const newText = `<div style="border-left: 4px solid ${backgroundColor}; padding-left: 12px; margin: 8px 0;">Highlighted text</div>`;
      const newContent =
        form.content.substring(0, start) +
        newText +
        form.content.substring(end);

      setForm((prev) => ({ ...prev, content: newContent }));

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + newText.length - 18, // Select "Highlighted text"
          start + newText.length - 1
        );
      }, 0);
    }
  };

  const submitBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to create a blog");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";

      if (selectedImage) {
        try {
          imageUrl = await uploadImageToImgBB(selectedImage);
        } catch (error) {
          toast.error("Failed to upload cover image");
          console.error("Error uploading cover image:", error);
        }
      }

      const payload: BlogPayload = {
        title: form.title,
        content: form.content,
        image: imageUrl,
        videoUrl: form.videoUrl,
      };

      const res = await createBlog(user, payload);
      if (res.success) {
        toast.success("Blog created successfully!");
        setForm({ title: "", content: "", image: "", videoUrl: "" });
        setSelectedImage(null);
        setUploadedImages([]);
        fetchMyBlogs();
      } else {
        toast.error(res.error || "Failed to create blog");
      }
    } catch (err) {
      toast.error("An error occurred while creating the blog");
      console.error("Error creating blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!user) return;

    try {
      const res = await deleteBlog(user, blogId);
      if (res.success) {
        toast.success("Blog deleted successfully!");
        fetchMyBlogs();
      } else {
        toast.error(res.error || "Failed to delete blog");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the blog");
      console.error("Error deleting blog:", err);
    }
  };

  const wordCount = form.content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Editor */}
          <div className="xl:col-span-3 col-span-1">
            <Card className="shadow-lg border">
              <CardHeader className="pb-4 sm:pb-6 bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-3xl font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 sm:w-8 sm:h-8" />
                      <span className="hidden sm:inline">
                        Create Your Story
                      </span>
                      <span className="sm:hidden">Write</span>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs"
                    >
                      {wordCount} words
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={submitBlog} className="space-y-6 sm:space-y-8">
                  {/* Title */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label
                      htmlFor="title"
                      className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Blog Title</span>
                      <span className="sm:hidden">Title</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="What's your story about?"
                      className="text-base sm:text-xl h-12 sm:h-14 border-2 focus:border-primary rounded-lg sm:rounded-xl px-4 sm:px-5 font-medium"
                      required
                    />
                  </div>

                  {/* Simple Editor */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2">
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Content</span>
                        <span className="sm:hidden">Write</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                          className="flex items-center gap-1 text-xs sm:text-sm px-3 sm:px-4 py-2"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            {showPreview ? "Edit" : "Preview"}
                          </span>
                          <span className="sm:hidden">
                            {showPreview ? "Edit" : "View"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {!showPreview ? (
                      <div className="space-y-5">
                        {/* Formatting Toolbar */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("**", "**")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Bold"
                          >
                            <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("*", "*")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Italic"
                          >
                            <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("`", "`")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Inline Code"
                          >
                            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={insertLinkPlaceholder}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Add Link"
                          >
                            <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={insertCodeBlockPlaceholder}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Add Code Block"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={insertImagePlaceholder}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Add Image"
                          >
                            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={insertVideoPlaceholder}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Add Video (supports YouTube URLs)"
                          >
                            <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) =>
                                setBackgroundColor(e.target.value)
                              }
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded border border-border cursor-pointer"
                              title="Choose side color"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={insertSideColor}
                              className="h-8 sm:h-9 px-2 sm:px-3"
                              title="Apply side color bar"
                            >
                              <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                          <Separator
                            orientation="vertical"
                            className="h-8 sm:h-9 hidden sm:block"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("# ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Heading 1"
                          >
                            <Heading1 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("## ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Heading 2"
                          >
                            <Heading2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("### ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Heading 3"
                          >
                            <Heading3 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Separator
                            orientation="vertical"
                            className="h-8 sm:h-9 hidden sm:block"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("- ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Bullet List"
                          >
                            <List className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("1. ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Numbered List"
                          >
                            <ListOrdered className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertMarkdown("> ", "")}
                            className="h-8 sm:h-9 px-2 sm:px-3"
                            title="Quote"
                          >
                            <Quote className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>

                        {/* Main Textarea with Drag and Drop */}
                        <div
                          className={`relative min-h-[450px] sm:min-h-[550px] border-2 rounded-lg sm:rounded-xl transition-colors ${
                            isDragOver
                              ? "border-primary bg-primary/5"
                              : "border-border focus-within:border-primary"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Textarea
                            value={form.content}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                content: e.target.value,
                              }))
                            }
                            placeholder="Start writing your blog post here...

Writing Tips:
- Use the toolbar buttons for easy formatting
- Drag and drop images directly into this area
- Click 'Add Video' and paste your YouTube URL
- Click 'Add Image' and paste your image URL
- Click 'Add Link' to create clickable links
- Select text and use color picker for side bars"
                            className="min-h-[450px] sm:min-h-[550px] text-base sm:text-base leading-relaxed resize-none border-0 focus:border-0 focus:ring-0 p-4 sm:p-6 bg-transparent"
                            ref={textareaRef}
                          />

                          {/* Drag and Drop Overlay */}
                          {isDragOver && (
                            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                              <div className="text-center">
                                <Upload className="w-12 h-12 mx-auto mb-2 text-primary" />
                                <p className="text-primary font-medium">
                                  Drop images here to upload
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Upload Progress Indicator */}
                          {uploadingImages.length > 0 && (
                            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
                              <div className="flex items-center gap-2 text-sm">
                                <BiLoaderAlt className="w-4 h-4 animate-spin" />
                                <span>
                                  Uploading {uploadingImages.length} image(s)...
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Pro Tips for Image Upload
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>
                              • Drag and drop images directly into the editor
                              above
                            </li>
                            <li>
                              • Use the file input below to select multiple
                              images at once
                            </li>
                            <li>
                              • Click on uploaded images to insert them into
                              your content
                            </li>
                            <li>
                              • Images are automatically uploaded to ImgBB and
                              inserted as markdown
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 min-h-[450px] sm:min-h-[550px] bg-card">
                        <div
                          className="prose prose-sm sm:prose-lg max-w-none dark:prose-invert 
                          prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-4
                          prose-headings:font-bold prose-headings:tracking-tight
                          prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                          prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
                          prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-tight
                          prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:leading-tight
                          prose-h5:text-base prose-h5:mb-2 prose-h5:mt-4 prose-h5:leading-tight
                          prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-3 prose-h6:leading-tight
                          prose-ul:mb-6 prose-ul:mt-4 prose-li:mb-2 prose-li:leading-relaxed
                          prose-ol:mb-6 prose-ol:mt-4 prose-li:mb-2 prose-li:leading-relaxed
                          prose-blockquote:mb-6 prose-blockquote:mt-4 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic
                          prose-code:bg-muted prose-code:px-3 prose-code:py-1.5 prose-code:rounded prose-code:text-sm
                          prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:mb-6 prose-pre:mt-4
                          prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:h-auto prose-img:mb-6 prose-img:mt-4
                          prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700 hover:prose-a:decoration-2
                          dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
                          prose-strong:font-semibold prose-strong:text-foreground
                          prose-em:italic prose-em:text-foreground
                          prose-hr:my-6 prose-hr:border-border
                          [&_div[style*='border-left']]:my-6 [&_div[style*='border-left']]:pl-6 [&_div[style*='border-left']]:border-l-4 [&_div[style*='border-left']]:rounded-l-sm"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              img: ({ src, alt, ...props }) => (
                                <img
                                  src={src}
                                  alt={alt}
                                  className="rounded-lg shadow-md max-w-full h-auto my-4"
                                  loading="lazy"
                                  {...props}
                                />
                              ),
                              // Handle any text content for YouTube URLs
                              text: ({ children }) => {
                                if (typeof children === "string") {
                                  const youtubeRegex =
                                    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                                  const youtubeMatch =
                                    children.match(youtubeRegex);

                                  if (youtubeMatch) {
                                    const videoId = youtubeMatch[1];
                                    return (
                                      <div className="my-4">
                                        <iframe
                                          width="100%"
                                          height="315"
                                          src={`https://www.youtube.com/embed/${videoId}`}
                                          title="YouTube video player"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          className="rounded-lg shadow-md"
                                        />
                                      </div>
                                    );
                                  }
                                }
                                return children;
                              },
                              video: ({ children, ...props }) => {
                                // Extract YouTube URL from source elements
                                let youtubeUrl = "";

                                // Check if children is an array (React elements)
                                if (Array.isArray(children)) {
                                  children.forEach((child) => {
                                    if (
                                      child &&
                                      typeof child === "object" &&
                                      child.props
                                    ) {
                                      // Look for source elements with src attribute
                                      if (
                                        child.props.src &&
                                        typeof child.props.src === "string"
                                      ) {
                                        youtubeUrl = child.props.src;
                                      }
                                    }
                                  });
                                }

                                // Also check if children is a single element
                                if (
                                  children &&
                                  typeof children === "object" &&
                                  children.props
                                ) {
                                  if (
                                    children.props.src &&
                                    typeof children.props.src === "string"
                                  ) {
                                    youtubeUrl = children.props.src;
                                  }
                                }

                                // Check if it's a YouTube URL
                                if (
                                  youtubeUrl &&
                                  (youtubeUrl.includes("youtube.com/watch") ||
                                    youtubeUrl.includes("youtu.be/"))
                                ) {
                                  let videoId = "";

                                  if (
                                    youtubeUrl.includes("youtube.com/watch")
                                  ) {
                                    videoId = youtubeUrl
                                      .split("v=")[1]
                                      ?.split("&")[0];
                                  } else if (youtubeUrl.includes("youtu.be/")) {
                                    videoId = youtubeUrl
                                      .split("youtu.be/")[1]
                                      ?.split("?")[0];
                                  }

                                  if (videoId) {
                                    return (
                                      <div className="my-4">
                                        <iframe
                                          width="100%"
                                          height="315"
                                          src={`https://www.youtube.com/embed/${videoId}`}
                                          title="YouTube video player"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          className="rounded-lg shadow-md"
                                        />
                                      </div>
                                    );
                                  }
                                }

                                // Regular video tag for other sources
                                return (
                                  <video
                                    controls
                                    className="rounded-lg shadow-md max-w-full h-auto my-4"
                                    {...props}
                                  >
                                    {children}
                                  </video>
                                );
                              },
                              p: ({ children, ...props }) => {
                                // Check if paragraph contains YouTube URLs
                                const childrenStr = children?.toString() || "";

                                // More flexible YouTube URL detection
                                const youtubeRegex =
                                  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                                const youtubeMatch =
                                  childrenStr.match(youtubeRegex);

                                if (youtubeMatch) {
                                  const videoId = youtubeMatch[1];
                                  return (
                                    <div className="my-4">
                                      <iframe
                                        width="100%"
                                        height="315"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg shadow-md"
                                      />
                                    </div>
                                  );
                                }

                                return <p {...props}>{children}</p>;
                              },
                              // Handle div elements for YouTube URLs and side color bars
                              div: ({ style, children, ...props }) => {
                                // Check if this is a side color bar div
                                if (
                                  style &&
                                  style.borderLeft &&
                                  style.paddingLeft
                                ) {
                                  return (
                                    <div
                                      style={style}
                                      className="my-6 pl-6 border-l-4 rounded-l-sm"
                                      {...props}
                                    >
                                      {children}
                                    </div>
                                  );
                                }

                                // Check if this div contains a YouTube URL
                                const childrenStr = children?.toString() || "";
                                const youtubeRegex =
                                  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                                const youtubeMatch =
                                  childrenStr.match(youtubeRegex);

                                if (youtubeMatch) {
                                  const videoId = youtubeMatch[1];
                                  return (
                                    <div className="my-4">
                                      <iframe
                                        width="100%"
                                        height="315"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg shadow-md"
                                      />
                                    </div>
                                  );
                                }

                                return <div {...props}>{children}</div>;
                              },
                            }}
                          >
                            {form.content ||
                              "*Start writing to see your preview...*"}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">
                        Cover Image (Optional)
                      </span>
                      <span className="sm:hidden">Image</span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="h-10 sm:h-12 border-2 focus:border-primary rounded-lg sm:rounded-xl px-3 sm:px-4 text-sm sm:text-base"
                    />
                  </div>

                  {/* Multiple Image Upload */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2">
                      <ImageLucide className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">
                        Upload Multiple Images
                      </span>
                      <span className="sm:hidden">Images</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="h-10 sm:h-12 border-2 focus:border-primary rounded-lg sm:rounded-xl px-3 sm:px-4 text-sm sm:text-base flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const fileInput = document.querySelector(
                            'input[type="file"][multiple]'
                          ) as HTMLInputElement;
                          fileInput?.click();
                        }}
                        className="h-10 sm:h-12 px-4 sm:px-5"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Select</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can also drag and drop images directly into the editor
                      above
                    </p>
                  </div>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <Label className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2">
                        <ImageLucide className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Uploaded Images ({uploadedImages.length})</span>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {uploadedImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-24 sm:h-28 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                              onClick={() => {
                                insertImageFromUrl(url, `Image ${index + 1}`);
                                toast.success("Image inserted into editor");
                              }}
                              title="Click to insert into editor"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setUploadedImages((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                                toast.success("Image removed from list");
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 sm:pt-6 border-t border-border/50">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg w-full sm:w-auto min-h-[48px]"
                    >
                      {loading ? (
                        <BiLoaderAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      )}
                      <span className="hidden sm:inline">
                        {loading ? "Publishing..." : "Publish Blog"}
                      </span>
                      <span className="sm:hidden">
                        {loading ? "Publishing..." : "Publish"}
                      </span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - My Blogs */}
          <div className="xl:col-span-1 hidden xl:block">
            <Card className="shadow-lg border sticky top-6 sm:top-8">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  My Blogs
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6">
                {blogs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">
                      No blogs yet. Create your first one!
                    </p>
                  </div>
                ) : (
                  blogs.map((b) => (
                    <Card
                      key={b._id}
                      className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/20"
                    >
                      <div className="space-y-3">
                        <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">
                          {b.title}
                        </h3>
                        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                          {new Date(b.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {b.user?.name && (
                            <span className="ml-2">
                              • By {b.user.name.split(" ")[0]}
                            </span>
                          )}
                        </CardDescription>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{b.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span>{b.likes || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(`/share-blog/${b._id}`, "_blank")
                              }
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Blog</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-muted-foreground">
                                    Are you sure you want to delete "{b.title}"?
                                    This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteBlog(b._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
