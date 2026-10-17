require('dotenv').config();
const Database = require('better-sqlite3');

const db = new Database(process.env.DB_FILE || 'timetable.db');

db.exec(`
CREATE TABLE IF NOT EXISTS timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code VARCHAR(20) NOT NULL,
  course_name VARCHAR(150),
  lecturer VARCHAR(100),
  day_of_week VARCHAR(15),
  start_time VARCHAR(5),
  end_time VARCHAR(5),
  venue VARCHAR(100),
  goal VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM timetable').get().n;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO timetable
    (course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const rows = [
    ['ICT261', 'Advanced Java', 'Mr. E Nyirenda', 'Tuesday', '08:00', '10:00', 'Lab 2', 'Finish Gradle setup and Unit 1 lab'],
    ['ICT251', 'Web Technologies', 'Mr. Banda', 'Monday', '10:00', '12:00', 'Lab 1', 'Complete Node.js activity'],
    ['MAT101', 'Mathematics', 'Dr. Phiri', 'Monday', '08:00', '10:00', 'Room 5', 'Revise differentiation'],
    ['PHY101', 'Physics', 'Dr. Zulu', 'Wednesday', '08:00', '10:00', 'Room 3', 'Practice kinematics problems'],
    ['ICT211', 'Data Structures', 'Mr. Mwale', 'Wednesday', '10:00', '12:00', 'Lab 2', 'Implement linked list'],
    ['COM101', 'Communication Skills', 'Mrs. Tembo', 'Thursday', '08:00', '09:30', 'Room 7', 'Prepare presentation'],
    ['ICT261', 'Advanced Java Lab', 'Mr. E Nyirenda', 'Thursday', '10:00', '12:00', 'Lab 2', 'Finish Mini Lab 1'],
    ['MAT101', 'Mathematics Tutorial', 'Dr. Phiri', 'Friday', '08:00', '09:00', 'Room 5', 'Solve past paper questions'],
    ['PHY101', 'Physics Lab', 'Dr. Zulu', 'Friday', '10:00', '12:00', 'Physics Lab', 'Write lab report'],
    ['ICT251', 'Web Technologies Lab', 'Mr. Banda', 'Friday', '14:00', '16:00', 'Lab 1', 'Deploy CRUD app']
  ];
  const insertMany = db.transaction((list) => list.forEach(r => insert.run(...r)));
  insertMany(rows);
}

module.exports = db;