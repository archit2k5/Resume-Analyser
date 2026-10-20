import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  parseResumeFile,
  extractResumeProfile,
} from "../controllers/resume.controller.js";

const router = Router();

router.post("/parse", upload.single("resume"), parseResumeFile);
router.post("/extract", upload.single("resume"), extractResumeProfile);

export default router;