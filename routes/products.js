// routes/products.js
const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// Create product
router.post("/", async (req, res) => {
  try {
    const {
      product_name,
      description,
      price = 0,
      stock = 0,
      category_id = null,
      image_url = "",
    } = req.body;
    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO products (product_name, description, price, stock, category_id, image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [product_name, description, price, stock, category_id, image_url]
    );
    res.status(201).json({ message: "Created", id: result.insertId });
  } catch (err) {
    console.error("POST /api/products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get list (search + filters + pagination)
router.get("/", async (req, res) => {
  try {
    const { q, page = 1, limit = 10, minPrice, maxPrice, category } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const pool = await getPool();

    let where = [];
    let params = [];

    if (q) {
      where.push("(product_name LIKE ? OR description LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (minPrice) {
      where.push("price >= ?");
      params.push(minPrice);
    }
    if (maxPrice) {
      where.push("price <= ?");
      params.push(maxPrice);
    }
    if (category) {
      where.push("category_id = ?");
      params.push(category);
    }

    const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

    // total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // data
    const [rows] = await pool.execute(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      data: rows,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get one
router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE product_id = ?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { product_name, description, price, stock, category_id, image_url } =
      req.body;
    const pool = await getPool();
    const [result] = await pool.execute(
      `UPDATE products SET product_name=?, description=?, price=?, stock=?, category_id=?, image_url=?, updated_at=NOW() WHERE product_id=?`,
      [
        product_name,
        description,
        price,
        stock,
        category_id,
        image_url,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("PUT /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const [result] = await pool.execute(
      "DELETE FROM products WHERE product_id=?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
