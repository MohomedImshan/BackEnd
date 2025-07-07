import express from 'express';
const router = express.Router();

// Example dummy notifications
router.get('/', (req, res) => {
  const notifications = [
    { id: 1, message: "New request submitted", time: "2 mins ago" },
    { id: 2, message: "Spare part added", time: "10 mins ago" }
  ];
  res.json(notifications);
});

export default router;
