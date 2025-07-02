import express from 'express';
import db from '../db/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    const sql = "SELECT * FROM spare_parts_tbl";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

router.post('/', (req, res) => {
    const { department, type, item_name, quantity } = req.body;

    if (!department || !type || !item_name || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO spare_parts_tbl (department, type, item_name, quantity) VALUES (?, ?, ?, ?)";
    db.query(sql, [department, type, item_name, quantity], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: "Spare part added" });
    });
});

router.put('/:id', (req, res) => {
    const { department, type, item_name, quantity } = req.body;
    const { id } = req.params;

    const sql = "UPDATE spare_parts_tbl SET department=?, type=?, item_name=?, quantity=? WHERE id=?";
    db.query(sql, [department, type, item_name, quantity, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Spare part updated" });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM spare_parts_tbl WHERE id=?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Spare part deleted" });
    });
});

export default router;