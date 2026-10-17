const db = require('./db');
console.log(db.prepare('SELECT COUNT(*) AS n FROM timetable').get());