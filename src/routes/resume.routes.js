import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { parseResumeFile, extractResumeProfile, uploadResume, getResume } from "../controllers/resume.controller.js";

const router = Router();

router.post("/", upload.single("resume"), uploadResume);
router.get("/:id", getResume);

//temp
router.post("/parse", upload.single("resume"), parseResumeFile);
router.post("/extract", upload.single("resume"), extractResumeProfile);

export default router;