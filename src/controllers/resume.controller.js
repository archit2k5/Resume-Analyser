import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseResume } from "../utils/parseResume.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const resumeParsing = asyncHandler(async (req, res, next)=>{
    if (!req.file) {
      throw new ApiError(400, "No file uploaded. Field name must be 'resume'");
    }

    const text = await parseResume(req.file);
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    return res
      .status(200)
      .json(new ApiResponse(200, { hash, length: text.length, text }, "Resume parsed"));

});

export { resumeParsing }
