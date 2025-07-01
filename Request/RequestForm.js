db.connect(err => {
  if (err) console.log('DB Error:', err);
  else console.log(' MySQL Connected');
});

// POST: submit request
app.post('/api/request', (req, res) => {
  const { department, machine_code, type, description, employee_name } = req.body;
  const sql = 'INSERT INTO requests (department, machine_code, type, description, employee_name) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [department, machine_code, type, description, employee_name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, message: 'Request submitted' });
  });
});

// GET: fetch requests
app.get('/api/requests', (req, res) => {
  const sql = 'SELECT * FROM requests ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(8800, () => console.log(' Backend running on http://localhost:8800'));
