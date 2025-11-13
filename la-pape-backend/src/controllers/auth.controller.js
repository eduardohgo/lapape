import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendMail, templates } from "../services/email.service.js";
import { random6, hashToken, compareToken, expMinutes } from "../services/token.service.js";
import { isEmail, isStrongPassword, isValidRole } from "../utils/validators.js";

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
}

// Registro con verificación de correo (en modo dev imprime el link en consola)
// src/controllers/auth.controller.js


export async function register(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "El correo ya está registrado" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Generar código de verificación
    const code = random6();
    const verifyCode = await hashToken(code);
    const verifyCodeExpires = expMinutes(10);

    const user = await User.create({
      nombre,
      email,
      passwordHash,
      rol: rol || "CLIENTE",
      verifyCode,
      verifyCodeExpires,
      isVerified: false,
    });

    // Enviar correo
    await sendMail({
      to: email,
      subject: "Verifica tu cuenta | La Pape",
      html: templates.otp(code, "Código de verificación de correo"),
      devLog: `TOKEN VERIFICACIÓN: ${code}`,
    });

    return res.status(201).json({ ok: true, id: user._id, message: "Verifica tu correo para continuar" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
      return res.status(400).json({ error: "Validación", details });
    }
    next(err);
  }
}



// Verificación de correo
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.verifyCode || !user.verifyCodeExpires) {
      return res.status(400).json({ error: "Solicitud inválida" });
    }

    if (new Date() > user.verifyCodeExpires) {
      return res.status(400).json({ error: "Código expirado" });
    }

    const valid = await compareToken(code, user.verifyCode);
    if (!valid) return res.status(400).json({ error: "Código incorrecto" });

    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpires = null;
    await user.save();

    res.json({ ok: true, message: "Correo verificado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al verificar correo" });
  }
};


// Login paso 1: valida password y envía 2FA
export const loginStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });

    // 👇 ESTA ES LA LÍNEA CORRECTA
    if (!user.isVerified) {
      return res.status(403).json({ error: "Verifica tu correo antes de continuar" });
    }

    if (user.twoFAEnabled) {
      const code = random6();
      user.twoFAHash = await hashToken(code);
      user.twoFAExp = expMinutes(10);
      await user.save();

      await sendMail({
        to: email,
        subject: "Código de acceso (2FA) | La Pape",
        html: templates.otp(code, "Tu código de acceso (2FA)"),
        devLog: `CÓDIGO 2FA: ${code}`,
      });

      return res.json({ ok: true, stage: "2fa", email });
    }

    const token = signToken(user);
    res.json({ ok: true, stage: "done", token });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error en login" });
  }
};

// Login paso 2: verifica 2FA y emite JWT
export const loginStep2 = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.twoFAHash || !user.twoFAExp) return res.status(400).json({ error: "Solicitud inválida" });
    if (new Date() > user.twoFAExp) return res.status(400).json({ error: "Código 2FA expirado" });

    const ok = await compareToken(code, user.twoFAHash);
    if (!ok) return res.status(400).json({ error: "Código 2FA incorrecto" });

    user.twoFAHash = null;
    user.twoFAExp = null;
    await user.save();

    const token = signToken(user);
    res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al verificar 2FA" });
  }
};

// Solicitar recuperación de contraseña (envía OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true }); // no exponemos existencia

    const code = random6();
    user.resetOTPHash = await hashToken(code);
    user.resetOTPExp = expMinutes(10);
    await user.save();

    await sendMail({
      to: email,
      subject: "Código para recuperar contraseña | La Pape",
      html: templates.otp(code, "Recupera tu contraseña"),
      devLog: `CÓDIGO RESET: ${code}`,
    });

    res.json({ ok: true, message: "Si el correo existe, se envió un código (o se imprimió en consola)" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al solicitar recuperación" });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!isStrongPassword(newPassword)) return res.status(400).json({ error: "Contraseña mínima 8" });

    const user = await User.findOne({ email });
    if (!user || !user.resetOTPHash || !user.resetOTPExp) return res.status(400).json({ error: "Solicitud inválida" });
    if (new Date() > user.resetOTPExp) return res.status(400).json({ error: "Código expirado" });

    const ok = await compareToken(code, user.resetOTPHash);
    if (!ok) return res.status(400).json({ error: "Código incorrecto" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOTPHash = null;
    user.resetOTPExp = null;
    await user.save();

    res.json({ ok: true, message: "Contraseña actualizada" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al restablecer contraseña" });
  }
};
