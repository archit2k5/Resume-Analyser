import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileHash: { type: String, required: true, unique: true },
    originalName: String,
    source: { type: String, default: "upload" }, // later: webhook, email...
    rawText: { type: String, select: false }, // hidden from queries by default
    status: {
      type: String,
      enum: ["parsed", "extracted", "failed"],
      default: "parsed",
      index: true,
    },
    error: String,
    profile: { type: Object }, // already validated by zod before saving
  },
  { timestamps: true }
);

// used by the hard filter in a later step
resumeSchema.index({ "profile.skills": 1 });
resumeSchema.index({ "profile.totalExperienceYears": 1 });

resumeSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.rawText;
    delete ret.__v;
    return ret;
  },
});

export const Resume = mongoose.model("Resume", resumeSchema);