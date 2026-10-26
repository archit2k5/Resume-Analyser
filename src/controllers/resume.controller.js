import crypto from "crypto";
import { parseResume } from "../utils/parseResume.js";
import { extractProfile } from "../services/extractProfile.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { ingestResume, getResumeById } from "../services/resume.service.js";

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

export const uploadResume = asyncHandler(async (req, res) => {
  requireFile(req);

  const { resume, duplicate } = await ingestResume(req.file);

  const statusCode = duplicate ? 200 : 201;
  const message = duplicate ? "Resume already exists" : "Resume processed";

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { resume, duplicate }, message));
});

export const getResume = asyncHandler(async (req, res) => {

  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid resume id");
  }
  const resume = await getResumeById(id);
  if (!resume) throw new ApiError(404, "Resume not found");

  return res
  .status(200)
  .json(new ApiResponse(200, { resume }, "Resume fetched"));
});