import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Share2,
  Facebook,
  Twitter,
  Copy,
  Instagram,
  Music,
} from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

export default function SocialShare({
  title,
  description,
  url,
  hashtags = [],
}: SocialShareProps) {
  const fullUrl = `${window.location.origin}${url}`;
  const hashtagStr = hashtags.map((tag) => `#${tag}`).join(" ");
  const shareText = `${title}\n\n${description}\n\n${hashtagStr}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${shareText}\n\n${fullUrl}`,
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      fullUrl,
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(fullUrl)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
    tiktok: `https://www.tiktok.com/`, // TikTok doesn't support direct sharing via URL
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${fullUrl}`);
      toast.success("Link berhasil disalin!");
    } catch (err) {
      toast.error("Gagal menyalin link");
    }
  };

  const handleInstagramShare = () => {
    toast.info(
      "Untuk berbagi di Instagram, silakan salin teks dan bagikan manual di Stories atau Feed Anda",
    );
    copyToClipboard();
  };

  const handleTikTokShare = () => {
    toast.info(
      "Untuk berbagi di TikTok, silakan salin teks dan bagikan manual di video Anda",
    );
    copyToClipboard();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="h-4 w-4" />
          <h3 className="font-semibold">Bagikan</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* WhatsApp */}
          <Button variant="outline" size="sm" asChild className="justify-start">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </a>
          </Button>

          {/* Facebook */}
          <Button variant="outline" size="sm" asChild className="justify-start">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </a>
          </Button>

          {/* Twitter */}
          <Button variant="outline" size="sm" asChild className="justify-start">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </a>
          </Button>

          {/* Instagram */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstagramShare}
            className="justify-start"
          >
            <Instagram className="h-4 w-4 mr-2 text-pink-600" />
            Instagram
          </Button>

          {/* TikTok */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTikTokShare}
            className="justify-start"
          >
            <Music className="h-4 w-4 mr-2 text-black" />
            TikTok
          </Button>

          {/* Copy Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="justify-start"
          >
            <Copy className="h-4 w-4 mr-2" />
            Salin Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
