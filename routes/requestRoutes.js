// routes/requestRoutes.js
import express from 'express';
import db from '../db/db.js';

const router = express.Router();

// POST: submit request
router.post('/addRequest', (req, res) => {
  const { department, machine_code, type, description, employee_name } = req.body;
  const sql = 'INSERT INTO requests (department, machine_code, type, description, employee_name) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [department, machine_code, type, description, employee_name], (err, result) => {
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
    res.json(results);
  });
});

export default router;
