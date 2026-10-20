import crypto from "crypto";
import { parseResume } from "../utils/parseResume.js";
import { extractProfile } from "../services/extractProfile.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const requireFile = (req) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded. Field name must be 'resume'");
  }
};

export const parseResumeFile = asyncHandler(async (req, res) => {
  requireFile(req);

  const text = await parseResume(req.file);
  const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

  return res
    .status(200)
    .json(new ApiResponse(200, { hash, length: text.length, text }, "Resume parsed"));
});

export const extractResumeProfile = asyncHandler(async (req, res) => {
  requireFile(req);

  const text = await parseResume(req.file);
  const profile = await extractProfile(text);

  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Profile extracted"));
});