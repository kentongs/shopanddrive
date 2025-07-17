const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, in_stock, is_promo, search, limit = 50 } = req.query;

    let query = supabase.from("products").select("*");

    if (category) query = query.eq("category", category);
    if (in_stock === "true") query = query.eq("in_stock", true);
    if (is_promo === "true") query = query.eq("is_promo", true);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    query = query
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Product not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      rating = 0,
      reviews = 0,
      image,
      description,
      inStock = true,
      isPromo = false,
    } = req.body;

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category,
          price,
          original_price: originalPrice,
          rating,
          reviews,
          image,
          description,
          in_stock: inStock,
          is_promo: isPromo,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      rating,
      reviews,
      image,
      description,
      inStock,
      isPromo,
    } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        category,
        price,
        original_price: originalPrice,
        rating,
        reviews,
        image,
        description,
        in_stock: inStock,
        is_promo: isPromo,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Product not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
