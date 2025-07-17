const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Return default settings if none exist
        return res.json({
          site_name: "Shop and Drive Taman Tekno",
          site_description: "Solusi terpercaya untuk kebutuhan otomotif Anda",
          logo: "/placeholder.svg",
          contact_phone: "08995555095",
          contact_email: "info@shopanddrive.com",
          address: "Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan",
          social_whatsapp: "628995555095",
          social_facebook: "",
          social_instagram: "",
        });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// POST/PUT /api/settings
router.post("/", async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      logo,
      contactPhone,
      contactEmail,
      address,
      socialMedia,
    } = req.body;

    // Check if settings exist
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing settings
      result = await supabase
        .from("settings")
        .update({
          site_name: siteName,
          site_description: siteDescription,
          logo,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          address,
          social_whatsapp: socialMedia?.whatsapp,
          social_facebook: socialMedia?.facebook,
          social_instagram: socialMedia?.instagram,
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await supabase
        .from("settings")
        .insert([
          {
            site_name: siteName,
            site_description: siteDescription,
            logo,
            contact_phone: contactPhone,
            contact_email: contactEmail,
            address,
            social_whatsapp: socialMedia?.whatsapp,
            social_facebook: socialMedia?.facebook,
            social_instagram: socialMedia?.instagram,
          },
        ])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json(result.data);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
