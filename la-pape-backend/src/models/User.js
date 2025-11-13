// src/models/User.js
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // 👇 default a CLIENTE para no fallar si el front no lo envía
    rol: { 
      type: String, 
      enum: ["CLIENTE", "TRABAJADOR", "DUENO"], 
      default: "CLIENTE" 
    },

    isVerified: { type: Boolean, default: false },

    verifyCode: String,
    verifyCodeExpires: Date,
    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
