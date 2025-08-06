import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  url,
  title = "Profile QR Code",
  description = "Scan to view profile",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = 512;
      canvas.height = 512;

      img.onload = () => {
        ctx?.drawImage(img, 0, 0, 512, 512);
        const pngFile = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.download = `${title
          .toLowerCase()
          .replace(/\s+/g, "-")}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
      toast.success("QR code downloaded!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription>
            Share your profile with a QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="p-3 border rounded-lg bg-background">
              <QRCodeSVG
                id="qr-code-svg"
                value={url}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
                className="max-w-full h-auto"
              />
            </div>
          </div>

          {/* URL Display */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Profile URL</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono truncate flex-1 min-w-0">{url}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={downloadQR} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    text: description,
                    url: url,
                  });
                } else {
                  handleCopy();
                }
              }}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
