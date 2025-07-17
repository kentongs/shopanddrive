const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/sponsors - Get all sponsors with optional filters
router.get("/", async (req, res) => {
  try {
    const { active, search, limit = 50 } = req.query;

    let query = supabase.from("sponsors").select("*");

    // Apply filters
    if (active === "true") {
      query = query.eq("is_active", true);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    // Apply sorting and limit
    query = query
      .order("order_index", { ascending: true })
      .order("name", { ascending: true })
      .limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ message: "Failed to fetch sponsors" });
  }
});

// GET /api/sponsors/:id - Get single sponsor
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    res.status(500).json({ message: "Failed to fetch sponsor" });
  }
});

// POST /api/sponsors - Create new sponsor
router.post("/", async (req, res) => {
  try {
    const {
      name,
      logo,
      category,
      website,
      description,
      isActive = true,
      order = 0,
    } = req.body;

    const { data, error } = await supabase
      .from("sponsors")
      .insert([
        {
          name,
          logo,
          category,
          website,
          description,
          is_active: isActive,
          order_index: order,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating sponsor:", error);
    res.status(500).json({ message: "Failed to create sponsor" });
  }
});

// PUT /api/sponsors/:id - Update sponsor
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, category, website, description, isActive, order } =
      req.body;

    const { data, error } = await supabase
      .from("sponsors")
      .update({
        name,
        logo,
        category,
        website,
        description,
        is_active: isActive,
        order_index: order,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    res.status(500).json({ message: "Failed to update sponsor" });
  }
});

// DELETE /api/sponsors/:id - Delete sponsor
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).json({ message: "Failed to delete sponsor" });
  }
});

module.exports = router;
