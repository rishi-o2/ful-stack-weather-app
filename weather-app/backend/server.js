const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/favorites", require("./routes/favoriteCityRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
