import express from 'express';
import db from '../db/db.js';
import AddTransaction from './Service/transactionService.js';
import addLog from './Service/logService.js';
import verifyToken from './authentication.js'

const router = express.Router();

router.get('/', (req, res) => {
    const sql = "SELECT * FROM spare_parts_tbl";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

router.post('/', (req, res) => {
    const { empNum,department,supplier, type, item_name, quantity,cost } = req.body;

    if (!department || !type || !item_name || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO spare_parts_tbl (department,supplier, type, item_name, quantity,cost) VALUES (?, ?, ?, ?,?,?)";
    db.query(sql, [department, supplier,type, item_name, quantity,cost], (err,result) => {
        if (err) return res.status(500).json({ error: err.message });
       addLog(empNum,"ADD SPARE PART",`Spare part is added ${item_name}`)
       const insertedId = result.insertId;
       AddTransaction("Add Spare parts",insertedId,item_name,quantity)
        return res.status(201).json({ message: "Spare part added" });
        
    });
});

router.put('/:id', (req, res) => {
    const { empNum,department, supplier,type, item_name, quantity,cost } = req.body;
    const { id } = req.params;

    const sql = "UPDATE spare_parts_tbl SET department=?,supplier=?, type=?, item_name=?, quantity=?, cost=? WHERE id=?";
    db.query(sql, [department, supplier,type, item_name, quantity, cost,id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        addLog(empNum,"Updated Stock",`Quantity of ${item_name} is updated by ${quantity}`)
        AddTransaction("Update Spare parts",id,item_name,quantity)
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

router.get('/stock', verifyToken, (req, res) => {
    const { department } = req.query;

    const sql = `
        SELECT 
            id,
            department,
            supplier,
            type,
            item_name,
            quantity,
            cost
        FROM spare_parts_tbl
        WHERE department = ?
    `;

    db.query(sql, [department], (err, result) => {
        if (err) {
            console.error("Error fetching stock data:", err);
            return res.status(500).json({ message: "Server error" });
        }
        res.json({ stock: result });
    });
});

export default router;