/*import express from "express";
import db from "../db/db.js";

const router = express.Router();

// requestRoutes.js
router.post("/addRequest", (req, res) => {
  const { empNum, department, machine_code, type, description, userName } = req.body;

  if (!empNum || !department || !machine_code || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
      INSERT INTO requests (empNum, department, machine_code, type, description, employee_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
    `;

  db.query(sql, [empNum, department, machine_code, type, description, userName], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Insert failed", details: err.message });
    }
    res.json({ message: "Request added successfully", result });
  });
});

/**
 * POST /api/requests/addParts
 * Add a spare part to a request
 
router.post("/addParts", async (req, res) => {
  try {
    const { requestId, partName, count } = req.body;
    if (!requestId || !partName || !count) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const sql = `INSERT INTO spare_parts (request_id, part_name, count) VALUES (?, ?, ?)`;
    await db.query(sql, [requestId, partName, count]);
    res.status(201).json({ message: "Spare part added successfully" });
  } catch (err) {
    console.error("Add Parts Error:", err);
    res.status(500).json({ error: "Failed to add spare parts", details: err.message });
  }
});

/**
 * GET /api/requests/allRequests
 * Basic list (kept for compatibility)
 
router.get("/allRequests", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requests ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Select Error:", err);
    res.status(500).json({ error: "Select failed", details: err.message });
  }
});

/**
 * GET /api/requests/:id
 * Return a single request with its spare parts
 
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [[request]] = await db.query("SELECT * FROM requests WHERE id = ?", [id]);
    if (!request) return res.status(404).json({ error: "Request not found" });
    const [parts] = await db.query("SELECT * FROM spare_parts WHERE request_id = ?", [id]);
    res.json({ ...request, spareParts: parts });
  } catch (err) {
    console.error("Fetch request failed:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * PUT /api/requests/:id
 * Update request header fields
 
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { empNum, department, machine_code, type, description, employee_name } = req.body;
    const sql = `
      UPDATE requests
      SET empNum = ?, department = ?, machine_code = ?, type = ?, description = ?, employee_name = ?
      WHERE id = ?
    `;
    await db.query(sql, [empNum, department, machine_code, type, description, employee_name, id]);
    res.json({ message: "Request updated" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

/**
 * PUT /api/requests/status/:id
 * Update status; set approvedDate when Approved
 
router.put("/status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const approved = status === 'Approved' ? new Date() : null;
    await db.query(`UPDATE requests SET status = ?, approvedDate = ? WHERE id = ?`, [status, approved, id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Status update failed", details: err.message });
  }
});

/**
 * DELETE /api/requests/:id
 * Delete request (and parts)
 
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM spare_parts WHERE request_id = ?", [id]);
    await db.query("DELETE FROM requests WHERE id = ?", [id]);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

export default router;
*/
// requestRoutes.js
import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Add a new request
router.post("/addRequest", (req, res) => {
  const { empNum, department, machine_code, type, description, userName } = req.body;
  if (!empNum || !department || !machine_code || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO requests 
      (empNum, department, machine_code, type, description, employee_name, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
  `;

  db.query(sql, [empNum, department, machine_code, type, description, userName], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Insert failed", details: err.message });
    }
    res.json({ message: "Request added successfully", result });
  });
});

// Add a spare part to a request
router.post("/addParts", (req, res) => {
  const { requestId, partName, count } = req.body;
  if (!requestId || !partName || !count) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = "INSERT INTO spare_parts (request_id, part_name, count) VALUES (?, ?, ?)";
  db.query(sql, [requestId, partName, count], (err, result) => {
    if (err) {
      console.error("Add Parts Error:", err);
      return res.status(500).json({ error: "Failed to add spare parts", details: err.message });
    }
    res.status(201).json({ message: "Spare part added successfully", result });
  });
});

// Get all requests
router.get("/allRequests", (req, res) => {
  const sql = "SELECT * FROM requests ORDER BY created_at DESC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Select Error:", err);
      return res.status(500).json({ error: "Select failed", details: err.message });
    }
    res.json(rows);
  });
});

// Get single request with spare parts
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM requests WHERE id = ?", [id], (err, requestRows) => {
    if (err) {
      console.error("Fetch request error:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }

    if (!requestRows || requestRows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requestRows[0];

    db.query("SELECT * FROM spare_parts WHERE request_id = ?", [id], (err2, partsRows) => {
      if (err2) {
        console.error("Fetch parts error:", err2);
        return res.status(500).json({ error: "Database error", details: err2.message });
      }
      res.json({ ...request, spareParts: partsRows || [] });
    });
  });
});

// Update request fields
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { empNum, department, machine_code, type, description, employee_name } = req.body;

  const sql = `
    UPDATE requests
    SET empNum = ?, department = ?, machine_code = ?, type = ?, description = ?, employee_name = ?
    WHERE id = ?
  `;

  db.query(sql, [empNum, department, machine_code, type, description, employee_name, id], (err, result) => {
    if (err) {
      console.error("Update Error:", err);
      return res.status(500).json({ error: "Update failed", details: err.message });
    }
    res.json({ message: "Request updated", result });
  });
});

// Update status (and approved_date if Approved)
router.put("/status/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const approved = status === "Approved" ? new Date() : null;

  const sql = "UPDATE requests SET status = ?, approved_date = ? WHERE id = ?";
  db.query(sql, [status, approved, id], (err, result) => {
    if (err) {
      console.error("Status update error:", err);
      return res.status(500).json({ error: "Status update failed", details: err.message });
    }
    res.json({ message: "Status updated", result });
  });
});

// Delete request and its parts
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM spare_parts WHERE request_id = ?", [id], (err) => {
    if (err) {
      console.error("Delete parts error:", err);
      return res.status(500).json({ error: "Delete failed", details: err.message });
    }

    db.query("DELETE FROM requests WHERE id = ?", [id], (err2, result) => {
      if (err2) {
        console.error("Delete request error:", err2);
        return res.status(500).json({ error: "Delete failed", details: err2.message });
      }

      res.json({ message: "Request deleted successfully", result });
    });
  });
});

export default router;

