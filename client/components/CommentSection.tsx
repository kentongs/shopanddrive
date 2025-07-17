import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Reply,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  LogIn,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { db, type Comment } from "@/services/database";
import { googleAuthService, type GoogleUser } from "@/services/googleAuth";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CommentSectionProps {
  contentId: string;
  contentType: "article" | "promo" | "product";
  contentTitle: string;
}

interface CommentFormData {
  content: string;
  authorName: string;
  authorEmail: string;
}

export default function CommentSection({
  contentId,
  contentType,
  contentTitle,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [formData, setFormData] = useState<CommentFormData>({
    content: "",
    authorName: "",
    authorEmail: "",
  });

  useEffect(() => {
    loadComments();
    setGoogleUser(googleAuthService.getCurrentUser());
  }, [contentId, contentType]);

  const loadComments = useCallback(() => {
    setIsLoading(true);
    const approvedComments = db.getApprovedCommentsByContent(
      contentId,
      contentType,
    );

    // Sort comments: main comments first, then replies nested
    const sortedComments = approvedComments
      .filter((comment) => !comment.parentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((comment) => ({
        ...comment,
        replies: approvedComments
          .filter((reply) => reply.parentId === comment.id)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
      }));

    setComments(sortedComments);
    setIsLoading(false);
  }, [contentId, contentType]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const user = await googleAuthService.signIn();
      if (user) {
        setGoogleUser(user);
        setFormData((prev) => ({
          ...prev,
          authorName: user.name,
          authorEmail: user.email,
        }));
        toast.success(`Berhasil masuk sebagai ${user.name}`);
      }
    } catch (error) {
      toast.error("Gagal masuk dengan Google");
    }
  }, []);

  const handleGoogleSignOut = useCallback(async () => {
    try {
      await googleAuthService.signOut();
      setGoogleUser(null);
      setFormData({
        content: "",
        authorName: "",
        authorEmail: "",
      });
      toast.success("Berhasil keluar");
    } catch (error) {
      toast.error("Gagal keluar");
    }
  }, []);

  // Optimized input handlers
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, content: e.target.value }));
    },
    [],
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, authorName: e.target.value }));
    },
    [],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, authorEmail: e.target.value }));
    },
    [],
  );

  const handleSubmitComment = useCallback(
    async (parentId?: string) => {
      if (!formData.content.trim()) {
        toast.error("Komentar tidak boleh kosong");
        return;
      }

      if (
        !googleUser &&
        (!formData.authorName.trim() || !formData.authorEmail.trim())
      ) {
        toast.error("Nama dan email harus diisi untuk komentar anonim");
        return;
      }

      setIsSubmitting(true);

      try {
        const commentData = {
          contentId,
          contentType,
          authorName: googleUser ? googleUser.name : formData.authorName,
          authorEmail: googleUser ? googleUser.email : formData.authorEmail,
          authorAvatar: googleUser?.picture,
          isGoogleAuth: !!googleUser,
          googleUserId: googleUser?.id,
          content: formData.content,
          parentId,
          status: "pending" as const,
          isRead: false,
        };

        db.createComment(commentData);

        setFormData({
          content: "",
          authorName: googleUser ? googleUser.name : "",
          authorEmail: googleUser ? googleUser.email : "",
        });
        setReplyingTo(null);

        toast.success(
          "Komentar berhasil dikirim dan menunggu persetujuan admin",
        );
        loadComments();
      } catch (error) {
        toast.error("Gagal mengirim komentar");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, googleUser, contentId, contentType],
  );

  const CommentForm = ({ parentId }: { parentId?: string }) => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Google Auth Section */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            {googleUser ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={googleUser.picture} />
                  <AvatarFallback>
                    {googleUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{googleUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {googleUser.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Masuk dengan Google atau komentar sebagai anonim
                </span>
              </div>
            )}

            <Button
              variant={googleUser ? "outline" : "default"}
              size="sm"
              onClick={googleUser ? handleGoogleSignOut : handleGoogleSignIn}
              className="flex items-center space-x-2"
            >
              {googleUser ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Google</span>
                </>
              )}
            </Button>
          </div>

          {/* Anonymous Form */}
          {!googleUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nama Anda"
                value={formData.authorName}
                onChange={handleNameChange}
              />
              <Input
                type="email"
                placeholder="Email Anda"
                value={formData.authorEmail}
                onChange={handleEmailChange}
              />
            </div>
          )}

          {/* Comment Input */}
          <Textarea
            placeholder={
              parentId ? "Tulis balasan Anda..." : "Tulis komentar Anda..."
            }
            value={formData.content}
            onChange={handleContentChange}
            rows={4}
          />

          {/* Submit Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Komentar akan ditampilkan setelah disetujui admin
            </div>

            <div className="flex space-x-2">
              {parentId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Batal
                </Button>
              )}
              <Button
                onClick={() => handleSubmitComment(parentId)}
                disabled={isSubmitting}
                size="sm"
                className="bg-automotive-blue hover:bg-automotive-blue-dark"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? "Mengirim..."
                  : parentId
                    ? "Balas"
                    : "Kirim Komentar"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CommentItem = ({
    comment,
  }: {
    comment: Comment & { replies?: Comment[] };
  }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
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
              <span className="font-medium text-sm">{comment.authorName}</span>
              {comment.isGoogleAuth && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(comment.createdAt), "d MMM yyyy, HH:mm", {
                  locale: id,
                })}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-3">{comment.content}</p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs text-automotive-blue hover:text-automotive-blue-dark"
            >
              <Reply className="h-3 w-3 mr-1" />
              Balas
            </Button>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-4 ml-11">
            <CommentForm parentId={comment.id} />
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 ml-11 space-y-3">
            <Separator />
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex items-start space-x-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={reply.authorAvatar} />
                  <AvatarFallback className="text-xs">
                    {reply.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-xs">
                      {reply.authorName}
                    </span>
                    {reply.isGoogleAuth && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-2 w-2 mr-1" />
                      {format(new Date(reply.createdAt), "d MMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-automotive-blue mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">
            Memuat komentar...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Komentar ({comments.length})</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <CommentForm />

      {comments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
