import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Search,
  Filter,
} from "lucide-react";
import { db, type Promo } from "@/services/database";
import { ImageUpload } from "@/components/ui/image-upload";

export default function PromoManagement() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
    originalPrice: "",
    discountPrice: "",
    image: "",
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = () => {
    const allPromos = db.getAllPromos();
    setPromos(allPromos);
  };

  const filteredPromos = promos.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPromo) {
      // Update existing promo
      db.updatePromo(editingPromo.id, {
        ...formData,
        status: "active" as const,
      });
    } else {
      // Add new promo
      db.createPromo({
        ...formData,
        status: "active",
        image: formData.image || "/placeholder.svg",
      });
    }

    loadPromos();
    setIsDialogOpen(false);
    setEditingPromo(null);
    setFormData({
      title: "",
      description: "",
      discount: "",
      validUntil: "",
      originalPrice: "",
      discountPrice: "",
      image: "",
    });
  };

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      discount: promo.discount,
      validUntil: promo.validUntil,
      originalPrice: promo.originalPrice || "",
      discountPrice: promo.discountPrice,
      image: promo.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus promo ini?")) {
      db.deletePromo(id);
      loadPromos();
    }
  };

  const getStatusBadge = (status: Promo["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "expired":
        return <Badge variant="destructive">Berakhir</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Terjadwal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Promo</h1>
          <p className="text-muted-foreground">
            Kelola promo dan penawaran spesial
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-automotive-blue hover:bg-automotive-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Promo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Edit Promo" : "Tambah Promo Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Promo</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Masukkan judul promo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Diskon</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    placeholder="30% / Gratis / Hemat 50rb"
                    required
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
                  placeholder="Jelaskan detail promo"
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                label="Gambar Promo"
                placeholder="Upload gambar promo"
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Berlaku Sampai</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Harga Asli</Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="Rp 100.000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Harga Promo</Label>
                  <Input
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
                    placeholder="Rp 70.000"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-automotive-blue hover:bg-automotive-blue-dark"
                >
                  {editingPromo ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari promo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promo Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Promo ({filteredPromos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Promo</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Berlaku Sampai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{promo.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {promo.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-automotive-red text-white"
                    >
                      {promo.discount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-automotive-blue">
                        {promo.discountPrice}
                      </div>
                      {promo.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {promo.originalPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(promo.validUntil).toLocaleDateString("id-ID")}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(promo.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(promo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
