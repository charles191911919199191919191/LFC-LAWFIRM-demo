import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { env } from "../config/env.js";

const uploadPath = path.resolve(env.uploadDir);
fs.mkdirSync(uploadPath, { recursive: true });

const allowedTypes = new Map([
  ["application/pdf", [".pdf"]],
  ["image/png", [".png"]],
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["application/msword", [".doc"]],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", [".docx"]]
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    cb(null, `${Date.now()}-${crypto.randomUUID()}-${safeName}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = allowedTypes.get(file.mimetype);
    if (!allowedExtensions || !allowedExtensions.includes(ext)) {
      return cb(new Error("Unsupported document type"));
    }
    cb(null, true);
  }
});
