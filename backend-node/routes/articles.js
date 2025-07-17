const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/articles - Get all articles with optional filters
router.get("/", async (req, res) => {
  try {
    const { status, category, search, limit = 50 } = req.query;

    let query = supabase.from("articles").select("*");

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`,
      );
    }

    // Apply sorting and limit
    query = query
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

// GET /api/articles/:id - Get single article
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Article not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
});

// POST /api/articles - Create new article
router.post("/", async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      date,
      author,
      category,
      readTime,
      image,
      status = "published",
    } = req.body;

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title,
          excerpt,
          content,
          date,
          author,
          category,
          read_time: readTime,
          image,
          status,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Failed to create article" });
  }
});

// PUT /api/articles/:id - Update article
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      date,
      author,
      category,
      readTime,
      image,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        excerpt,
        content,
        date,
        author,
        category,
        read_time: readTime,
        image,
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Article not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
});

// DELETE /api/articles/:id - Delete article
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
});

module.exports = router;
