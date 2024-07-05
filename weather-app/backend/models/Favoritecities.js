const mongoose = require("mongoose");

const favoriteCitySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  cityName: { type: String, required: true },
});

const FavoriteCity = mongoose.model("FavoriteCity", favoriteCitySchema);

module.exports = FavoriteCity;
