const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { parseOrigins, buildCorsOriginHandler } = require("./config/cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const contactRoutes = require("./routes/contact.routes");
const userRoutes = require("./routes/user.routes");
const carouselRoutes = require("./routes/carousel.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
const corsOptions = {
  origin: buildCorsOriginHandler(allowedOrigins),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "department-store-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, _req, res, _next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      message: "Payload too large. Please upload a smaller image file.",
    });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
