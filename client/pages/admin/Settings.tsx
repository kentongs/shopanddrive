import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { db, type Settings as SettingsType } from "@/services/database";
import { ImageUpload } from "@/components/ui/image-upload";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    siteName: "",
    siteDescription: "",
    logo: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    socialMedia: {
      whatsapp: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = db.getSettings();
    setSettings(currentSettings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      db.updateSettings(settings);
      toast.success("Pengaturan berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("socialMedia.")) {
      const socialField = field.split(".")[1];
      setSettings({
        ...settings,
        socialMedia: {
          ...settings.socialMedia,
          [socialField]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan umum website dan informasi kontak
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nama Website</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  placeholder="Shop and Drive Taman Tekno"
                  required
                />
              </div>
              <div className="space-y-2">
                <ImageUpload
                  value={settings.logo}
                  onChange={(value) => handleInputChange("logo", value)}
                  label="Logo Website"
                  placeholder="Upload logo website"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Deskripsi Website</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                placeholder="Deskripsi singkat tentang website"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Nomor Telepon</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="08995555095"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="info@shopanddrive.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan"
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media Sosial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={settings.socialMedia.whatsapp}
                  onChange={(e) =>
                    handleInputChange("socialMedia.whatsapp", e.target.value)
                  }
                  placeholder="628995555095"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: 628995555095 (tanpa tanda +)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook (Opsional)</Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook || ""}
                  onChange={(e) =>
                    handleInputChange("socialMedia.facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/shopanddrive"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram (Opsional)</Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram || ""}
                onChange={(e) =>
                  handleInputChange("socialMedia.instagram", e.target.value)
                }
                placeholder="https://instagram.com/shopanddrive"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-automotive-blue hover:bg-automotive-blue-dark"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
