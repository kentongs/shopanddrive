import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Check,
  X,
  Reply,
  MoreHorizontal,
  Eye,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { db, type Comment } from "@/services/database";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => {
    setIsLoading(true);
    const allComments = db.getAllComments();
    setComments(allComments);
    setIsLoading(false);
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      db.approveComment(commentId);
      toast.success("Komentar berhasil disetujui");
      loadComments();
    } catch (error) {
      toast.error("Gagal menyetujui komentar");
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      db.rejectComment(commentId);
      toast.success("Komentar berhasil ditolak");
      loadComments();
    } catch (error) {
      toast.error("Gagal menolak komentar");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      db.deleteComment(commentId);
      toast.success("Komentar berhasil dihapus");
      loadComments();
    } catch (error) {
      toast.error("Gagal menghapus komentar");
    }
  };

  const handleReplyToComment = async (comment: Comment) => {
    if (!replyContent.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    setIsReplying(true);

    try {
      const replyData = {
        contentId: comment.contentId,
        contentType: comment.contentType,
        authorName: "Admin Shop and Drive",
        authorEmail: "admin@shopanddrive.com",
        isGoogleAuth: false,
        content: replyContent,
        parentId: comment.id,
        status: "approved" as const,
        isRead: true,
      };

      db.createComment(replyData);
      setReplyContent("");
      setSelectedComment(null);
      setIsDialogOpen(false);
      toast.success("Balasan berhasil dikirim");
      loadComments();
    } catch (error) {
      toast.error("Gagal mengirim balasan");
    } finally {
      setIsReplying(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedComment(null);
    setReplyContent("");
  };

  const getContentTitle = (comment: Comment) => {
    switch (comment.contentType) {
      case "article":
        const article = db.getArticleById(comment.contentId);
        return article?.title || "Artikel tidak ditemukan";
      case "promo":
        const promo = db.getPromoById(comment.contentId);
        return promo?.title || "Promo tidak ditemukan";
      case "product":
        const product = db.getProductById(comment.contentId);
        return product?.name || "Produk tidak ditemukan";
      default:
        return "Konten tidak ditemukan";
    }
  };

  const getContentUrl = (comment: Comment) => {
    switch (comment.contentType) {
      case "article":
        return `/artikel/${comment.contentId}`;
      case "promo":
        return `/promo/${comment.contentId}`;
      case "product":
        return `/produk/${comment.contentId}`;
      default:
        return "#";
    }
  };

  const getStatusBadge = (status: Comment["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
    }
  };

  const filterComments = (status?: string) => {
    if (!status || status === "all") return comments;
    return comments.filter((comment) => comment.status === status);
  };

  const pendingComments = filterComments("pending");
  const approvedComments = filterComments("approved");
  const rejectedComments = filterComments("rejected");

  const CommentTable = ({ comments }: { comments: Comment[] }) => (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada komentar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.authorAvatar} />
                      <AvatarFallback>
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-sm">
                          {comment.authorName}
                        </span>
                        {comment.isGoogleAuth && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Google
                          </Badge>
                        )}
                        {getStatusBadge(comment.status)}
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "d MMM yyyy, HH:mm",
                            { locale: id },
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {comment.content}
                      </p>

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="capitalize">
                          {comment.contentType}:
                        </span>
                        <Link
                          to={getContentUrl(comment)}
                          className="text-automotive-blue hover:underline flex items-center"
                        >
                          {getContentTitle(comment)}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApproveComment(comment.id)}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Setujui
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRejectComment(comment.id)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Tolak
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedComment(comment);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Balas
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
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
      <div>
        <h1 className="text-3xl font-bold">Manajemen Komentar</h1>
        <p className="text-muted-foreground">
          Kelola komentar pengunjung dan berikan balasan
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Menunggu Persetujuan</p>
                <p className="text-2xl font-bold">{pendingComments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Disetujui</p>
                <p className="text-2xl font-bold">{approvedComments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Ditolak</p>
                <p className="text-2xl font-bold">{rejectedComments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-automotive-blue" />
              <div>
                <p className="text-sm font-medium">Total Komentar</p>
                <p className="text-2xl font-bold">{comments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Menunggu ({pendingComments.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Disetujui ({approvedComments.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Ditolak ({rejectedComments.length})
          </TabsTrigger>
          <TabsTrigger value="all">Semua ({comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <CommentTable comments={pendingComments} />
        </TabsContent>

        <TabsContent value="approved">
          <CommentTable comments={approvedComments} />
        </TabsContent>

        <TabsContent value="rejected">
          <CommentTable comments={rejectedComments} />
        </TabsContent>

        <TabsContent value="all">
          <CommentTable comments={comments} />
        </TabsContent>
      </Tabs>

      {/* Reply Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balas Komentar</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedComment.authorAvatar} />
                    <AvatarFallback className="text-xs">
                      {selectedComment.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {selectedComment.authorName}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {selectedComment.content}
                </p>
              </div>

              <Textarea
                placeholder="Tulis balasan Anda sebagai admin..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isReplying}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => handleReplyToComment(selectedComment)}
                  disabled={isReplying}
                  className="bg-automotive-blue hover:bg-automotive-blue-dark"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isReplying ? "Mengirim..." : "Kirim Balasan"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
