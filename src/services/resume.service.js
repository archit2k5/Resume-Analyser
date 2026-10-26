import crypto from "crypto";
import { Resume } from "../models/resume.model.js";
import { parseResume } from "../utils/parseResume.js";
import { extractProfile } from "./extractProfile.js";

export async function ingestResume(file) {
  const fileHash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  // 1. dedup before spending any parsing or LLM work
  const existing = await Resume.findOne({ fileHash });
  if (existing) return { resume: existing, duplicate: true };

  // 2. parse and save
  const text = await parseResume(file);

  let resume;
  try {
    resume = await Resume.create({
      fileHash,
      originalName: file.originalname,
      rawText: text,
      status: "parsed",
    });
  } catch (err) {
    // two identical uploads racing: the unique index catches the loser
    if (err.code === 11000) {
      return { resume: await Resume.findOne({ fileHash }), duplicate: true };
    }
    throw err;
  }

  // 3. extract the profile and record the outcome
  try {
    resume.profile = await extractProfile(text);
    resume.status = "extracted";
    await resume.save();
  } catch (err) {
    resume.status = "failed";
    resume.error = err.message;
    await resume.save();
    throw err;
  }

  return { resume, duplicate: false };
}

export async function getResumeById(id) {
  return Resume.findById(id);
}