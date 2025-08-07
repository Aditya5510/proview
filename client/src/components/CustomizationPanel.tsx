import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  Palette,
  Type,
  Sparkles,
  Eye,
  Check,
  RotateCcw,
  X,
} from "lucide-react";
import { AnimatedGradientText } from "@/components/ui/aceternity";

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

const themes = [
  { id: "minimal", name: "Minimal", color: "bg-gray-100" },
  { id: "elegant", name: "Elegant", color: "bg-slate-800" },
  { id: "modern", name: "Modern", color: "bg-blue-50" },
  { id: "classic", name: "Classic", color: "bg-amber-50" },
];

const fonts = [
  { id: "inter", name: "Inter" },
  { id: "poppins", name: "Poppins" },
  { id: "roboto", name: "Roboto" },
  { id: "playfair", name: "Playfair" },
  { id: "montserrat", name: "Montserrat" },
  { id: "opensans", name: "Open Sans" },
  { id: "raleway", name: "Raleway" },
  { id: "nunito", name: "Nunito" },
  { id: "sourcecodepro", name: "Source Code Pro" },
  { id: "merriweather", name: "Merriweather" },
  { id: "lora", name: "Lora" },
  { id: "noto", name: "Noto Sans" },
  { id: "oswald", name: "Oswald" },
  { id: "monospace", name: "Monospace" },
];

const animations = [
  { id: "fade", name: "Fade" },
  { id: "slide", name: "Slide" },
  { id: "bounce", name: "Bounce" },
  { id: "scale", name: "Scale" },
  { id: "flip", name: "Flip" },
  { id: "zoom", name: "Zoom" },
  { id: "slideleft", name: "Slide Left" },
  { id: "slideright", name: "Slide Right" },
  { id: "rotate", name: "Rotate" },
  { id: "elastic", name: "Elastic" },
];

const backgroundPatterns = [
  { id: "none", name: "None" },
  { id: "gradient", name: "Gradient" },
  { id: "geometric", name: "Geometric" },
  { id: "organic", name: "Organic" },
  { id: "minimal", name: "Minimal" },
];

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

  const renderContent = () => (
    <AnimatePresence mode="wait">
      {activeTab === "themes" && (
        <motion.div
          key="themes"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  localSettings.theme === theme.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => updateSetting("theme", theme.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{theme.name}</span>
                    {localSettings.theme === theme.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className={`w-full h-3 rounded mt-3 ${theme.color}`} />
                </CardContent>
              </Card>
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
          className="space-y-3"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {fonts.map((font) => (
              <Card
                key={font.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  localSettings.font === font.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => updateSetting("font", font.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{font.name}</span>
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
          className="space-y-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {animations.map((animation) => (
              <Card
                key={animation.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  localSettings.animation === animation.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => updateSetting("animation", animation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {animation.name}
                    </span>
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
              Speed: {localSettings.animationSpeed}s
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
          className="space-y-3"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {backgroundPatterns.map((pattern) => (
              <Card
                key={pattern.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  localSettings.backgroundPattern === pattern.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => updateSetting("backgroundPattern", pattern.id)}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-sm font-medium">{pattern.name}</span>
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
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-lg shadow-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <AnimatedGradientText className="text-lg font-bold">
                Customize
              </AnimatedGradientText>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-[calc(90vh-120px)]">
          {/* Desktop Sidebar */}
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

          {/* Desktop Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">{renderContent()}</div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="md:hidden max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="p-4">
            {renderContent()}

            {/* Mobile Settings */}
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="dark-mode-mobile"
                  className="text-sm font-medium"
                >
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-mobile"
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
      </motion.div>
    </motion.div>
  );
};
