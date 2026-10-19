import multer from "multer";
import { PDF, DOCX } from "../utils/parseResume.js";
import { ApiError } from "../utils/ApiError.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    if (file.mimetype === PDF || file.mimetype === DOCX) return cb(null, true);
    cb(new ApiError(415, "Only PDF and DOCX files are supported"), false);
  },
});