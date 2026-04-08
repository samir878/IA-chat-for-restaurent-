import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve("reservations.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS table_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS room_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    event_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Check if slot is full (max 60 people per slot)
export function checkConflict(date, time, partySize) {
  const row = db.prepare(`
    SELECT COALESCE(SUM(party_size), 0) as total
    FROM table_reservations
    WHERE date = ? AND time = ?
  `).get(date, time);
  return (row.total + partySize) > 60;
}

export function createTableReservation(data) {
  const stmt = db.prepare(`
    INSERT INTO table_reservations 
    (first_name, last_name, phone, email, date, time, party_size)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.first_name, data.last_name, data.phone,
    data.email, data.date, data.time, data.party_size
  );
  return result.lastInsertRowid;
}

export function createRoomRequest(data) {
  const stmt = db.prepare(`
    INSERT INTO room_requests (first_name, last_name, phone, email, event_type)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.first_name, data.last_name,
    data.phone, data.email, data.event_type
  );
  return result.lastInsertRowid;
}

export function getAllTableReservations() {
  return db.prepare(`SELECT * FROM table_reservations ORDER BY date, time`).all();
}

export function getAllRoomRequests() {
  return db.prepare(`SELECT * FROM room_requests ORDER BY created_at DESC`).all();
}

export default db;