const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/promos - Get all promos with optional filters
router.get("/", async (req, res) => {
  try {
    const { status, search, limit = 50 } = req.query;

    let query = supabase.from("promos").select("*");

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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
    console.error("Error fetching promos:", error);
    res.status(500).json({ message: "Failed to fetch promos" });
  }
});

// GET /api/promos/:id - Get single promo
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("promos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Promo not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching promo:", error);
    res.status(500).json({ message: "Failed to fetch promo" });
  }
});

// POST /api/promos - Create new promo
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      discount,
      validUntil,
      status = "active",
      image,
      originalPrice,
      discountPrice,
    } = req.body;

    const { data, error } = await supabase
      .from("promos")
      .insert([
        {
          title,
          description,
          discount,
          valid_until: validUntil,
          status,
          image,
          original_price: originalPrice,
          discount_price: discountPrice,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating promo:", error);
    res.status(500).json({ message: "Failed to create promo" });
  }
});

// PUT /api/promos/:id - Update promo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      discount,
      validUntil,
      status,
      image,
      originalPrice,
      discountPrice,
    } = req.body;

    const { data, error } = await supabase
      .from("promos")
      .update({
        title,
        description,
        discount,
        valid_until: validUntil,
        status,
        image,
        original_price: originalPrice,
        discount_price: discountPrice,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Promo not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating promo:", error);
    res.status(500).json({ message: "Failed to update promo" });
  }
});

// DELETE /api/promos/:id - Delete promo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("promos").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.json({ message: "Promo deleted successfully" });
  } catch (error) {
    console.error("Error deleting promo:", error);
    res.status(500).json({ message: "Failed to delete promo" });
  }
});

module.exports = router;
