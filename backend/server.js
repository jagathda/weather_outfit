require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/authRoute");
const cityRoutes = require("./routes/cityRoute");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
//Initialize passport configuration
passportConfig(passport);

// Define allowed origins
const allowedLinks = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://weather-outfit-frontend.vercel.app",
];

// Define CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedLinks.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

// // Use the CORS middleware with the defined options
//app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
/* app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
}); 
app.use(
  cors({
    origin: "https://weather-outfit-frontend.vercel.app",
  })
); */

// routes
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);

// Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connection error", error);
  });
