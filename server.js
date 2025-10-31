// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// routes
const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

// Health / root
app.get("/", (req, res) => {
  res.json({ message: "Product API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
