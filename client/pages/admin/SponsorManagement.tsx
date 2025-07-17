import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Building2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { db, type Sponsor } from "@/services/database";
import { ImageUpload } from "@/components/ui/image-upload";

const categories = [
  "Oil Partner",
  "Tire Partner",
  "Parts Partner",
  "Technology Partner",
  "Service Partner",
  "Official Dealer",
];

export default function SponsorManagement() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    category: "",
    website: "",
    description: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = () => {
    setIsLoading(true);
    const allSponsors = db.getAllSponsors();
    setSponsors(allSponsors.sort((a, b) => a.order - b.order));
    setIsLoading(false);
  };

  const handleOpenDialog = useCallback(
    (sponsor?: Sponsor) => {
      if (sponsor) {
        setEditingSponsor(sponsor);
        setFormData({
          name: sponsor.name,
          logo: sponsor.logo,
          category: sponsor.category,
          website: sponsor.website || "",
          description: sponsor.description || "",
          isActive: sponsor.isActive,
          order: sponsor.order,
        });
      } else {
        setEditingSponsor(null);
        setFormData({
          name: "",
          logo: "",
          category: "",
          website: "",
          description: "",
          isActive: true,
          order: sponsors.length + 1,
        });
      }
      setIsDialogOpen(true);
    },
    [sponsors.length],
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingSponsor(null);
    setFormData({
      name: "",
      logo: "",
      category: "",
      website: "",
      description: "",
      isActive: true,
      order: 0,
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !formData.name.trim() ||
        !formData.logo.trim() ||
        !formData.category
      ) {
        toast.error("Nama, logo, dan kategori sponsor wajib diisi");
        return;
      }

      try {
        if (editingSponsor) {
          db.updateSponsor(editingSponsor.id, formData);
          toast.success("Sponsor berhasil diperbarui");
        } else {
          db.createSponsor(formData);
          toast.success("Sponsor berhasil ditambahkan");
        }

        loadSponsors();
        handleCloseDialog();
      } catch (error) {
        toast.error("Gagal menyimpan sponsor");
      }
    },
    [formData, editingSponsor, handleCloseDialog],
  );

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus sponsor ini?")) {
      try {
        db.deleteSponsor(id);
        toast.success("Sponsor berhasil dihapus");
        loadSponsors();
      } catch (error) {
        toast.error("Gagal menghapus sponsor");
      }
    }
  }, []);

  const handleToggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        // Optimistic UI update first
        setSponsors((prev) =>
          prev.map((sponsor) =>
            sponsor.id === id ? { ...sponsor, isActive } : sponsor,
          ),
        );

        db.updateSponsor(id, { isActive });
        toast.success(
          `Sponsor berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
        );
      } catch (error) {
        toast.error("Gagal mengubah status sponsor");
        // Revert optimistic update on error
        loadSponsors();
      }
    },
    [],
  );

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const sponsor = sponsors.find((s) => s.id === id);
    if (!sponsor) return;

    const currentIndex = sponsors.findIndex((s) => s.id === id);
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sponsors.length) return;

    const targetSponsor = sponsors[targetIndex];

    try {
      db.updateSponsor(sponsor.id, { order: targetSponsor.order });
      db.updateSponsor(targetSponsor.id, { order: sponsor.order });
      toast.success("Urutan sponsor berhasil diubah");
      loadSponsors();
    } catch (error) {
      toast.error("Gagal mengubah urutan sponsor");
    }
  };

  // Memoized statistics for better performance
  const sponsorStats = useMemo(
    () => ({
      total: sponsors.length,
      active: sponsors.filter((s) => s.isActive).length,
      inactive: sponsors.filter((s) => !s.isActive).length,
      categories: new Set(sponsors.map((s) => s.category)).size,
    }),
    [sponsors],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automotive-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Sponsor</h1>
          <p className="text-muted-foreground">
            Kelola sponsor dan partner bisnis
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-automotive-blue hover:bg-automotive-blue-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSponsor ? "Edit Sponsor" : "Tambah Sponsor Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Sponsor *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nama sponsor"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={formData.logo}
                  onChange={(value) =>
                    setFormData({ ...formData, logo: value })
                  }
                  label="Logo Sponsor *"
                  placeholder="Upload logo sponsor"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Urutan Tampil</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi singkat tentang sponsor"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-automotive-blue hover:bg-automotive-blue-dark"
                >
                  {editingSponsor ? "Perbarui" : "Tambah"} Sponsor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-automotive-blue" />
              <div>
                <p className="text-sm font-medium">Total Sponsor</p>
                <p className="text-2xl font-bold">{sponsorStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Aktif</p>
                <p className="text-2xl font-bold">{sponsorStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Nonaktif</p>
                <p className="text-2xl font-bold">{sponsorStats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-automotive-orange" />
              <div>
                <p className="text-sm font-medium">Kategori</p>
                <p className="text-2xl font-bold">{sponsorStats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sponsors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Sponsor</CardTitle>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Belum ada sponsor. Klik "Tambah Sponsor" untuk memulai.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsors.map((sponsor) => (
                    <TableRow key={sponsor.id}>
                      <TableCell>
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="h-10 w-20 object-contain bg-gray-50 rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sponsor.name}</p>
                          {sponsor.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {sponsor.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sponsor.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {sponsor.website ? (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-automotive-blue hover:underline flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={sponsor.isActive}
                            onCheckedChange={(checked) =>
                              handleToggleActive(sponsor.id, checked)
                            }
                            size="sm"
                          />
                          <Badge
                            variant={sponsor.isActive ? "default" : "secondary"}
                          >
                            {sponsor.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{sponsor.order}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveOrder(sponsor.id, "up")}
                              disabled={sponsor.order === 1}
                              className="h-4 w-4 p-0"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleMoveOrder(sponsor.id, "down")
                              }
                              disabled={sponsor.order === sponsors.length}
                              className="h-4 w-4 p-0"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(sponsor)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(sponsor.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
