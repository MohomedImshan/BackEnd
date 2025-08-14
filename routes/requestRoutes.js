// routes/requestRoutes.js
import express from 'express';
import db from '../db/db.js';
const router = express.Router();

// POST: submit request
router.post('/addRequest', (req, res) => {
  
  // const { department, machine_code, type, description,empNum,userName } = req.body;
  const { formData, empNum, userName } = req.body;
  const { department, machine_code, type, description } = formData;

  const sql = 'INSERT INTO requests (department, machine_code, type, description,empNum, employee_name) VALUES (?, ? , ?, ?, ?, ?)';
  db.query(sql, [department, machine_code, type, description, empNum , userName], (err, result) => {
    if (err) {
      console.error('Insert Error:', err);
      return res.status(500).send({ error: 'Insert failed', details: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Request submitted' });
  });
});
// GET: fetch requests
router.get('/allRequests', (req, res) => {
  const sql = 'SELECT * FROM requests ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Select Error:', err);
      return res.status(500).send({ error: 'Select failed', details: err.message });
    }
    res.send(results);
  });
});
//approve , reject
router.put('/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query('UPDATE requests SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});
//update
router.put('/:id', (req, res) => {
  
  const { department, machine_code, type, description,  employee_name } = req.body;
  db.query(`
    UPDATE requests SET department = ?, machine_code = ?, type = ?, description = ?, employee_name = ?
    WHERE id = ?`,
    [department, machine_code, type, description, employee_name, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Request updated successfully' });
    });
});
//delete
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM requests WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Request deleted successfully' });
  });
});


export default router;
