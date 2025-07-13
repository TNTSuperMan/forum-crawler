import { Database } from "bun:sqlite";

export const database = new Database("db");

database.exec(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    topic INTEGER NOT NULL,
    hash INTEGER NOT NULL,
    user TEXT NOT NULL,
    content TEXT NOT NULL
)`)

database.exec(`CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL
)`)
