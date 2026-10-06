// Cuentas de propietarios y asesores: contraseñas con PBKDF2 y sesiones por cookie.
// El token de sesión solo vive en la cookie del navegador; en D1 se guarda su sha256.

const ITERATIONS = 100000; // máximo que admite PBKDF2 en Workers
const SESSION_DAYS = 30;
const COOKIE = 'inmu_s';
const MAX_FAILS = 6; // intentos fallidos por correo en 15 minutos

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)));

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${hex(salt)}$${await pbkdf2(password, salt, ITERATIONS)}`;
}

export async function verifyPassword(password, stored) {
  const [alg, iter, salt, hash] = String(stored || '').split('$');
  if (alg !== 'pbkdf2' || !salt || !hash) return false;
  return safeEqual(await pbkdf2(password, unhex(salt), Number(iter)), hash);
}

async function sha256(s) {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

export function passwordProblem(pw) {
  if (pw.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (pw.length > 200) return 'La contraseña es demasiado larga.';
  return null;
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 120;
}

export async function createSession(db, accountId) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await db.prepare('INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256(token), accountId, expires).run();
  await db.prepare("UPDATE accounts SET last_login_at = datetime('now') WHERE id = ?").bind(accountId).run();
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

function tokenFrom(request) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`));
  return m ? m[1] : null;
}

export async function currentAccount(request, db) {
  const token = tokenFrom(request);
  if (!token) return null;
  const row = await db.prepare(
    `SELECT a.id, a.role, a.status, a.name, a.email, a.whatsapp, a.company, a.created_at
       FROM sessions s JOIN accounts a ON a.id = s.account_id
      WHERE s.token_hash = ? AND s.expires_at > ?`
  ).bind(await sha256(token), new Date().toISOString()).first();
  if (!row || row.status === 'suspendida') return null;
  return row;
}

export async function destroySession(request, db) {
  const token = tokenFrom(request);
  if (token) await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function tooManyAttempts(db, email) {
  const since = new Date(Date.now() - 15 * 60e3).toISOString().replace('T', ' ').slice(0, 19);
  const r = await db.prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE email = ? AND created_at > ?').bind(email, since).first();
  return (r?.n || 0) >= MAX_FAILS;
}

export async function recordFailure(db, email, ip) {
  await db.prepare('INSERT INTO login_attempts (email, ip) VALUES (?, ?)').bind(email, ip || null).run();
}

export async function clearFailures(db, email) {
  await db.prepare('DELETE FROM login_attempts WHERE email = ?').bind(email).run();
}

// Clave temporal legible para que el administrador la entregue por WhatsApp.
export function temporaryPassword() {
  const A = '23456789abcdefghjkmnpqrstuvwxyz';
  const b = crypto.getRandomValues(new Uint8Array(10));
  return [...b].map((x) => A[x % A.length]).join('').replace(/(.{5})/, '$1-');
}
