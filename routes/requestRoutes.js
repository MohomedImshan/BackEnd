
import express from "express";
import db from "../db/db.js";
import AddTransaction from "./Service/transactionService.js";

const router = express.Router();


// Add a new request
router.post("/addRequest", (req, res) => {
  const { empNum, department, machine_code, type, description, userName,parts } = req.body;
  if (!empNum || !department || !machine_code || !type ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO requests 
      (empNum, department, machine_code, type, description, userName, parts)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [empNum, department, machine_code, type, description, userName,JSON.stringify(parts)], (err, result) => {

    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Insert failed", details: err.message });
    }
    res.json({ message: "Request added successfully", result });
  });
});

// Add a spare part to a request
// router.post("/addParts", (req, res) => {
//   const { requestId, partName, count } = req.body;
//   if (!requestId || !partName || !count) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   const sql = "INSERT INTO spare_parts (request_id, part_name, count) VALUES (?, ?, ?)";
//   db.query(sql, [requestId, partName, count], (err, result) => {
//     if (err) {
//       console.error("Add Parts Error:", err);
//       return res.status(500).json({ error: "Failed to add spare parts", details: err.message });
//     }
//     res.status(201).json({ message: "Spare part added successfully", result });
//   });
// });

// Get all requests
router.get("/allRequests", async (req, res) => {
  const sql = "SELECT * FROM requests WHERE status='pending' ORDER BY created_at DESC";
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

    let spareParts=[]
    try{
      spareParts=request.parts?JSON.parse(request.parts):[]
    }catch(parseErr){
      console.error("Error parsing parts JSON:",parseErr)
    }
    res.json({...request,spareParts})
  });
});

// Update request fields
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { empNum, department, machine_code, type, description, userName } = req.body;

  const sql = `
    UPDATE requests
    SET empNum = ?, department = ?, machine_code = ?, type = ?, description = ?, userName = ?
    WHERE id = ?
  `;

  db.query(sql, [empNum, department, machine_code, type, description, userName, id], (err, result) => {
    if (err) {
      console.error("Update Error:", err);
      return res.status(500).json({ error: "Update failed", details: err.message });
    }
    res.json({ message: "Request updated", result });
  });
});

// Update status (and approved_date if Approved)
// router.put("/status/:id", async (req, res) =>{
//   const {id} = req.params
//   const {status} = req.body
//   if(!status){
//     return res.status(400).json({message:"Status is required"})

//   }
//   try{
//     const [rows] = await db.query("SELECT * FROM requests WHERE id = ? ",[id])
//     if(rows.length === 0){
//       return res.status(404).json({message:"Request not found"})
//     }
//     const request = rows[0]

//     if(status === "Approved" && request.parts){
//       const parts = JSON.parse(request.parts)

//       for (const part of parts){
//         await db.query("UPDATE spare_parts_tbl SET quantity = quantity - ? WHERE item_name=? and quantity >=?",
//         [part.quantity,part.item_name,part.quantity])
//       }
//     }
  
//   await db.query("UPDATE requests SET status = ? ,approved_date = CURRENT_TIMESTAMP WHERE id=?",
//   [status,id])
//   res.json({message: `Request ${id} updated to ${status}`})
  
//   }catch(err){
//     console.error("Error updating request:", err);
//     res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// });

router.put("/status/:id",async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  db.query("SELECT * FROM requests WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: "Request not found" });

    const request = rows[0];

    if (status === "Approved" && request.parts) {
      let parts;
      try {
        parts = JSON.parse(request.parts);
      } catch (e) {
        return res.status(400).json({ message: "Invalid parts JSON" });
      }

      // Process parts sequentially
      const processPart = (index) => {
        if (index >= parts.length) {
          // All parts processed, update request status
          return db.query(
            "UPDATE requests SET status = ?, approved_date = CURRENT_TIMESTAMP WHERE id = ?",
            [status, id],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              return res.json({ message: `Request ${id} updated to ${status}` });
            }
          );
        }

        const part = parts[index];

        // Check stock
        db.query("SELECT quantity FROM spare_parts_tbl WHERE id = ?", [part.id], (err, stockRows) => {
          if (err) return res.status(500).json({ error: err.message });
          if (stockRows.length === 0) return res.status(404).json({ message: `Part ${part.item_name} not found` });

          const available = stockRows[0].quantity;
          if (available < part.quantity) {
            return res.status(400).json({
              message: `Not enough stock for ${part.item_name}. Available: ${available}, Requested: ${part.quantity}`
            });
          }

          // Deduct stock
          db.query(
            "UPDATE spare_parts_tbl SET quantity = quantity - ? WHERE id = ?",
            [part.quantity, part.id],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });

              // Log transaction
              AddTransaction("Issued", part.id, part.item_name, part.quantity);

              // Next part
              processPart(index + 1);
            }
          );
        });
      };

      processPart(0); // start processing parts
    } else {
      // For non-approved status, just update the request
      db.query(
        "UPDATE requests SET status = ?, approved_date = CURRENT_TIMESTAMP WHERE id = ?",
        [status, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          return res.json({ message: `Request ${id} updated to ${status}` });
        }
      );
    }
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

