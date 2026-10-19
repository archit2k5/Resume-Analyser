import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { resumeParsing } from "../controllers/resume.controller.js";

const router = Router();

router.post("/parse", upload.single("resume"), resumeParsing);

export default router;