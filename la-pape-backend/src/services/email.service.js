import nodemailer from "nodemailer";

const hasSMTP =
  process.env.BREVO_SMTP_HOST &&
  process.env.BREVO_SMTP_USER &&
  process.env.BREVO_SMTP_PASS;

let transporter = null;

if (hasSMTP) {
  transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
  console.log("📧 SMTP habilitado (Brevo).");
} else {
  console.log("📭 SMTP NO configurado. MODO DEV: los links/códigos se imprimirán en consola.");
}

export async function sendMail({ to, subject, html, devLog }) {
  if (!hasSMTP) {
    // Modo dev: imprime lo que “enviaríamos”
    console.log("\n----- DEV MAIL -----");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    if (devLog) console.log(devLog);
    console.log("--------------------\n");
    return { messageId: "dev-mail" };
  }

  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

export const templates = {
  verifyEmail: (link) => `
    <h2>Verifica tu correo</h2>
    <p>Gracias por registrarte en <b>La Pape</b>. Haz clic en el enlace para verificar tu cuenta:</p>
    <p><a href="${link}" target="_blank">Verificar mi correo</a></p>
  `,
  otp: (code, title = "Tu código de seguridad") => `
    <h2>${title}</h2>
    <p>Tu código es: <b style="font-size:18px">${code}</b></p>
    <p>Expira en 10 minutos.</p>
  `,
};
