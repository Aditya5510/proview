import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { ExternalLink, Heart, Eye } from "lucide-react";

export const ThemePreview: React.FC = () => {
  const { settings } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 rounded-lg border bg-card"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Theme Preview</h3>
        <p className="text-sm text-muted-foreground">
          See how your current theme looks
        </p>
      </div>

      <Card className="mb-4">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              JD
            </span>
          </div>
          <CardTitle className="text-xl">John Doe</CardTitle>
          <p className="text-sm text-muted-foreground">Digital Creator</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              1.2k views
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              89 likes
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between hover:scale-105 transition-transform"
          >
            <span>Portfolio Website</span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between hover:scale-105 transition-transform"
          >
            <span>LinkedIn Profile</span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between hover:scale-105 transition-transform"
          >
            <span>Instagram</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="font-medium">Theme</div>
          <div className="text-muted-foreground capitalize">
            {settings.theme}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="font-medium">Font</div>
          <div className="text-muted-foreground capitalize">
            {settings.font}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="font-medium">Animation</div>
          <div className="text-muted-foreground capitalize">
            {settings.animation}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="font-medium">Pattern</div>
          <div className="text-muted-foreground capitalize">
            {settings.backgroundPattern}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
