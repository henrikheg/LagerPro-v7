import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// database
const dbFile = path.join(process.cwd(), "inventory-server", "database", "lagerpro.db");
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = await open({ filename: dbFile, driver: sqlite3.Database });

// sørg for at tabellene finnes
await db.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, qty INTEGER DEFAULT 0);
`);
const admin = await db.get("SELECT * FROM users WHERE username=?", ["admin"]);
if (!admin) await db.run("INSERT INTO users (username,password) VALUES (?,?)", ["admin", "lagerpro123"]);

// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const u = await db.get("SELECT * FROM users WHERE username=?", [username]);
  if (!u) return res.status(401).json({ error: "Feil brukernavn" });
  if (password !== u.password) return res.status(401).json({ error: "Feil passord" });
  const token = jwt.sign({ id: u.id, username }, process.env.JWT_SECRET || "dev", { expiresIn: "12h" });
  res.json({ token });
});

// enkle endepunkt for produkter
app.get("/api/products", async (req, res) => {
  res.json(await db.all("SELECT * FROM products"));
});
app.post("/api/products", async (req, res) => {
  const { name, qty } = req.body;
  await db.run("INSERT INTO products (name, qty) VALUES (?,?)", [name, qty || 0]);
  res.json({ ok: true });
});

app.get("/api/ping", (req, res) => res.json({ ok: true, version: "7.3", name: "LagerPro – Henrik Edition" }));

app.listen(4000, () => console.log("Server på http://localhost:4000"));
