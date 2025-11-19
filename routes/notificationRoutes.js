import express from "express";
import db from "../db/db.js";

const router = express.Router();

//getting about notifications
router.get("/", (req, res) => {
  const search = (req.query.search || '').trim();
  let sql = `
    SELECT id, empNum, department, machine_code, type, description,
    userName, status, created_at, approved_date
    FROM requests WHERE status="pending"

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



export default router;
