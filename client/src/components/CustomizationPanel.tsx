import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Palette,
  Type,
  Sparkles,
  Moon,
  Sun,
  Eye,
  Code,
  Settings,
  Check,
  Copy,
  RotateCcw,
} from "lucide-react";
import { AnimatedGradientText, FloatingCard } from "@/components/ui/aceternity";
import { toast } from "sonner";
import { ThemePreview } from "./ThemePreview";

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

interface Font {
  id: string;
  name: string;
  family: string;
  preview: string;
}

interface Animation {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const themes: Theme[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple black & white design",
    preview: "⚪⚫",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#666666",
      background: "#fafafa",
    },
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated dark theme with subtle accents",
    preview: "🖤💎",
    colors: {
      primary: "#1a1a1a",
      secondary: "#ffffff",
      accent: "#9ca3af",
      background: "#111111",
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with geometric patterns",
    preview: "🔲🔳",
    colors: {
      primary: "#2d2d2d",
      secondary: "#ffffff",
      accent: "#a3a3a3",
      background: "#f8f9fa",
    },
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless black and white with serif fonts",
    preview: "📜🖋️",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#8b8b8b",
      background: "#f5f5f5",
    },
  },
];

const fonts: Font[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "Poppins, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: "Playfair Display, serif",
    preview: "The quick brown fox",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "opensans",
    name: "Open Sans",
    family: "Open Sans, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "Raleway, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "nunito",
    name: "Nunito",
    family: "Nunito, sans-serif",
    preview: "The quick brown fox",
  },
  {
    id: "sourcecodepro",
    name: "Source Code Pro",
    family: "Source Code Pro, monospace",
    preview: "The quick brown fox",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    family: "Merriweather, serif",
    preview: "The quick brown fox",
  },
  {
    id: "monospace",
    name: "Monospace",
    family: "monospace",
    preview: "The quick brown fox",
  },
];

const animations: Animation[] = [
  {
    id: "fade",
    name: "Fade In",
    description: "Smooth fade-in effect",
    preview: "✨",
  },
  {
    id: "slide",
    name: "Slide Up",
    description: "Elements slide up from bottom",
    preview: "⬆️",
  },
  {
    id: "bounce",
    name: "Bounce",
    description: "Playful bounce animation",
    preview: "🎾",
  },
  {
    id: "scale",
    name: "Scale",
    description: "Elements scale in smoothly",
    preview: "🔍",
  },
  {
    id: "flip",
    name: "Flip",
    description: "3D flip animation",
    preview: "🔄",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Zoom in from center",
    preview: "🔎",
  },
  {
    id: "slideleft",
    name: "Slide Left",
    description: "Slide in from right",
    preview: "➡️",
  },
  {
    id: "slideright",
    name: "Slide Right",
    description: "Slide in from left",
    preview: "⬅️",
  },
  {
    id: "rotate",
    name: "Rotate",
    description: "Rotate in smoothly",
    preview: "🔄",
  },
  {
    id: "elastic",
    name: "Elastic",
    description: "Elastic spring effect",
    preview: "🎯",
  },
];

const backgroundPatterns = [
  { id: "none", name: "None", preview: "⬜" },
  { id: "gradient", name: "Gradient", preview: "🌈" },
  { id: "geometric", name: "Geometric", preview: "🔷" },
  { id: "organic", name: "Organic", preview: "🌿" },
  { id: "minimal", name: "Minimal", preview: "⚪" },
];

interface CustomizationSettings {
  theme: string;
  font: string;
  animation: string;
  backgroundPattern: string;
  darkMode: boolean;
  animationSpeed: number;
}

interface CustomizationPanelProps {
  settings: CustomizationSettings;
  onSettingsChange: (settings: CustomizationSettings) => Promise<void>;
  onClose: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const [localSettings, setLocalSettings] =
    useState<CustomizationSettings>(settings);
  const [activeTab, setActiveTab] = useState("themes");

  const updateSetting = async (
    key: keyof CustomizationSettings,
    value: any
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    await onSettingsChange(newSettings);
  };

  const resetToDefaults = async () => {
    const defaults: CustomizationSettings = {
      theme: "minimal",
      font: "inter",
      animation: "fade",
      backgroundPattern: "none",
      darkMode: false,
      animationSpeed: 0.5,
    };
    setLocalSettings(defaults);
    await onSettingsChange(defaults);
    toast.success("Settings reset to defaults");
  };

  const tabs = [
    { id: "themes", label: "Themes", icon: Palette },
    { id: "fonts", label: "Fonts", icon: Type },
    { id: "animations", label: "Animations", icon: Sparkles },
    { id: "backgrounds", label: "Backgrounds", icon: Eye },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-lg shadow-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <AnimatedGradientText className="text-xl font-bold">
                Customize Your Profile
              </AnimatedGradientText>
              <p className="text-sm text-muted-foreground">
                Make your profile uniquely yours
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30">
            <div className="p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={localSettings.darkMode}
                    onCheckedChange={(checked) =>
                      updateSetting("darkMode", checked)
                    }
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={resetToDefaults}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Theme Preview */}
              <div className="mb-6">
                <ThemePreview />
              </div>
              <AnimatePresence mode="wait">
                {activeTab === "themes" && (
                  <motion.div
                    key="themes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Choose a Theme
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select from our curated collection of beautiful themes
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {themes.map((theme) => (
                        <FloatingCard key={theme.id}>
                          <Card
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                              localSettings.theme === theme.id
                                ? "ring-2 ring-primary"
                                : ""
                            }`}
                            onClick={() => updateSetting("theme", theme.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                  {theme.name}
                                </CardTitle>
                                {localSettings.theme === theme.id && (
                                  <Check className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <CardDescription className="text-xs">
                                {theme.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl">
                                  {theme.preview}
                                </span>
                                <div className="flex space-x-1">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: theme.colors.primary,
                                    }}
                                  />
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: theme.colors.secondary,
                                    }}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FloatingCard>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "fonts" && (
                  <motion.div
                    key="fonts"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Typography</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose the perfect font for your profile
                      </p>
                    </div>

                    <div className="space-y-3">
                      {fonts.map((font) => (
                        <Card
                          key={font.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            localSettings.font === font.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() => updateSetting("font", font.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{font.name}</h4>
                                <p
                                  className="text-sm text-muted-foreground mt-1"
                                  style={{ fontFamily: font.family }}
                                >
                                  {font.preview}
                                </p>
                              </div>
                              {localSettings.font === font.id && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "animations" && (
                  <motion.div
                    key="animations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Animations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add life to your profile with smooth animations
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {animations.map((animation) => (
                        <Card
                          key={animation.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            localSettings.animation === animation.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() =>
                            updateSetting("animation", animation.id)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xl">
                                    {animation.preview}
                                  </span>
                                  <h4 className="font-medium">
                                    {animation.name}
                                  </h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {animation.description}
                                </p>
                              </div>
                              {localSettings.animation === animation.id && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Animation Speed: {localSettings.animationSpeed}s
                      </Label>
                      <Slider
                        value={[localSettings.animationSpeed]}
                        onValueChange={([value]) =>
                          updateSetting("animationSpeed", value)
                        }
                        max={2}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "backgrounds" && (
                  <motion.div
                    key="backgrounds"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Background Patterns
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add subtle patterns to enhance your profile
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {backgroundPatterns.map((pattern) => (
                        <Card
                          key={pattern.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            localSettings.backgroundPattern === pattern.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() =>
                            updateSetting("backgroundPattern", pattern.id)
                          }
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">
                              {pattern.preview}
                            </div>
                            <p className="text-sm font-medium">
                              {pattern.name}
                            </p>
                            {localSettings.backgroundPattern === pattern.id && (
                              <Check className="w-4 h-4 text-primary mx-auto mt-2" />
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
