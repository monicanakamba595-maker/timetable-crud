require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET all
app.get('/api/timetable', (req, res) => {
  const rows = db.prepare('SELECT * FROM timetable ORDER BY id').all();
  res.json(rows);
});

// GET one
app.get('/api/timetable/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM timetable WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Record not found' });
  res.json(row);
});

// POST create
app.post('/api/timetable', (req, res) => {
  const { course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal } = req.body;
  if (!course_code) return res.status(400).json({ error: 'course_code is required' });
  const result = db.prepare(`
    INSERT INTO timetable (course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal);
  const row = db.prepare('SELECT * FROM timetable WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// PUT update
app.put('/api/timetable/:id', (req, res) => {
  const { course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal } = req.body;
  const result = db.prepare(`
    UPDATE timetable
    SET course_code = ?, course_name = ?, lecturer = ?, day_of_week = ?,
        start_time = ?, end_time = ?, venue = ?, goal = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Record not found' });
  const row = db.prepare('SELECT * FROM timetable WHERE id = ?').get(req.params.id);
  res.json(row);
});

// DELETE
app.delete('/api/timetable/:id', (req, res) => {
  const result = db.prepare('DELETE FROM timetable WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Record not found' });
  res.json({ message: 'Record deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));