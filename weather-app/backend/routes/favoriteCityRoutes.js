const express = require("express");
const FavoriteCity = require("../models/Favoritecities");

const router = express.Router();

// Get favorite cities for a user
router.get("/:email", async (req, res) => {
  try {
    const favorites = await FavoriteCity.find({ userEmail: req.params.email });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a favorite city
router.post("/", async (req, res) => {
    console.log("I am being called")
  const { userEmail, cityName } = req.body;
  try {
    const favorite = new FavoriteCity({ userEmail, cityName });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a favorite city
router.delete("/", async (req, res) => {
    console.log("mujhe bulaaya")
  const { userEmail, cityName } = req.body;
  try {
    await FavoriteCity.findOneAndDelete({ userEmail, cityName });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
