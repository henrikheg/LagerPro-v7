import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import twilio from "twilio";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// database
const dbFile = path.join(process.cwd(), "inventory-server", "database", "lagerpro.db");
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = await open({ filename: dbFile, driver: sqlite3.Database });

// tabeller
await db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, password TEXT);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name TEXT, qty INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS projects(id INTEGER PRIMARY KEY, name TEXT);
`);
const admin = await db.get("SELECT * FROM users WHERE username=?", ["admin"]);
if (!admin)
  await db.run("INSERT INTO users(username,password) VALUES (?,?)", [
    process.env.ADMIN_USER || "admin",
    process.env.ADMIN_PASS || "lagerpro123"
  ]);

// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const u = await db.get("SELECT * FROM users WHERE username=?", [username]);
  if (!u || password !== u.password)
    return res.status(401).json({ error: "Feil brukernavn eller passord" });
  const token = jwt.sign({ id: u.id, username }, process.env.JWT_SECRET || "dev", {
    expiresIn: "12h"
  });
  res.json({ token });
});

// produkter
app.get("/api/products", async (_req, res) => {
  res.json(await db.all("SELECT * FROM products"));
});
app.post("/api/products", async (req, res) => {
  const { name, qty } = req.body;
  await db.run("INSERT INTO products(name,qty) VALUES (?,?)", [name, qty || 0]);
  res.json({ ok: true });
  if (qty <= 2) await sendLowStockSMS(name, qty);
});

// prosjekter
app.get("/api/projects", async (_req, res) =>
  res.json(await db.all("SELECT * FROM projects"))
);
app.post("/api/projects", async (req, res) => {
  const { name } = req.body;
  const r = await db.run("INSERT INTO projects(name) VALUES (?)", [name]);
  res.json({ id: r.lastID, name });
});

// kalkulasjon
app.post("/api/calc/materials", (req, res) => {
  const { length, width, height, density } = req.body;
  const volume = Number(length) * Number(width) * Number(height);
  const mass = volume * Number(density);
  res.json({ volume, mass });
});

// pdf-rapport
app.get("/api/projects/:id/report/pdf", async (req, res) => {
  const p = await db.get("SELECT * FROM projects WHERE id=?", [req.params.id]);
  if (!p) return res.status(404).json({ error: "Prosjekt ikke funnet" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="prosjekt_${p.id}.pdf"`);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);
  doc.fontSize(18).text("LagerPro – Prosjektrapport");
  doc.moveDown().fontSize(12).text(`Prosjekt: ${p.name}`);
  doc.text(`Generert: ${new Date().toLocaleString("no-NO")}`);
  doc.end();
});

// e-postrapport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
app.post("/api/projects/:id/report/email", async (req, res) => {
  const p = await db.get("SELECT * FROM projects WHERE id=?", [req.params.id]);
  if (!p) return res.status(404).json({ error: "Prosjekt ikke funnet" });
  const text = `Prosjektrapport for: ${p.name}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO || process.env.SMTP_USER,
    subject: "LagerPro Prosjektrapport",
    text
  });
  res.json({ ok: true });
});

// sms-varsel
const smsClient =
  process.env.TWILIO_ACCOUNT_SID &&
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
async function sendLowStockSMS(name, qty) {
  if (!smsClient) return;
  const msg = `LagerPro: Lav beholdning av ${name} (${qty} igjen).`;
  await smsClient.messages.create({
    body: msg,
    from: process.env.TWILIO_FROM,
    to: "+47XXXXXXXX"
  });
}

// test
app.get("/api/ping", (_req, res) =>
  res.json({ ok: true, version: "7.4.0", name: "LagerPro – Henrik Edition" })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server på port ${PORT}`));
