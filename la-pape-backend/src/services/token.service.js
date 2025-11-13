import bcrypt from "bcrypt";

export function random6() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashToken(plain) {
  return bcrypt.hash(plain, 10);
}

export async function compareToken(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function expMinutes(m = 10) {
  return new Date(Date.now() + m * 60 * 1000);
}
