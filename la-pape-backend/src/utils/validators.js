export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
export const isStrongPassword = (v) => typeof v === "string" && v.length >= 8;
export const isValidRole = (v) => ["CLIENTE", "TRABAJADOR", "DUENO"].includes((v || "").toUpperCase());
