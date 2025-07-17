const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/comments
router.get("/", async (req, res) => {
  try {
    const { content_id, content_type, status, unread } = req.query;

    let query = supabase.from("comments").select("*");

    if (content_id && content_type) {
      query = query
        .eq("content_id", content_id)
        .eq("content_type", content_type);
    }
    if (status) query = query.eq("status", status);
    if (unread === "true") query = query.eq("is_read", false);

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// POST /api/comments
router.post("/", async (req, res) => {
  try {
    const {
      contentId,
      contentType,
      authorName,
      authorEmail,
      authorAvatar,
      isGoogleAuth = false,
      googleUserId,
      content,
      parentId,
    } = req.body;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          content_id: contentId,
          content_type: contentType,
          author_name: authorName,
          author_email: authorEmail,
          author_avatar: authorAvatar,
          is_google_auth: isGoogleAuth,
          google_user_id: googleUserId,
          content,
          parent_id: parentId,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

// PUT /api/comments/:id
router.put("/:id", async (req, res) => {
  try {
    const { status, isRead } = req.body;
    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.is_read = isRead;

    const { data, error } = await supabase
      .from("comments")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Comment not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Failed to update comment" });
  }
});

// DELETE /api/comments/:id
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

module.exports = router;
