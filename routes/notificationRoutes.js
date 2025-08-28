
// notificationRoutes.js
import express from "express";
import db from "../db/db.js";

const router = express.Router();

/**
 * GET /api/notifications?search=
 * Returns requests with optional search across multiple columns
 */
router.get("/", (req, res) => {
  const search = (req.query.search || '').trim();
  let sql = `
    SELECT id, empNum, department, machine_code, type, description,
    userName, status, created_at, approved_date
    FROM requests
  `;

  const params = [];

  if (search) {
    sql += ` WHERE CONCAT_WS(' ', empNum, department, machine_code, type, description, userName, status) LIKE ?`;
    params.push(`%${search}%`);
  }

  sql += ` ORDER BY created_at DESC`;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }

    // Ensure we always send an array
    res.json(Array.isArray(rows) ? rows : []);
  });
});

/**
 * GET /api/notifications/:id
 * Returns a single request with its spare parts
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM requests WHERE id = ?", [id], (err, requestRows) => {
    if (err) {
      console.error("Error fetching request:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }

    if (!requestRows || requestRows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requestRows[0];

    db.query("SELECT * FROM spare_parts WHERE request_id = ?", [id], (err2, partsRows) => {
      if (err2) {
        console.error("Error fetching spare parts:", err2);
        return res.status(500).json({ error: "Database error", details: err2.message });
      }

      res.json({ ...request, spareParts: partsRows || [] });
    });
  });
});

export default router;
