import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { ApiError } from "./ApiError.js";

export const PDF = "application/pdf";
export const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function extractPdf(buffer) {
    const parser = new PDFParse({ data: buffer });
    try {
        const { text } = await parser.getText();
        return text;
    } finally {
        await parser.destroy();
    }
}

async function extractDocx(buffer) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
}

export async function parseResume(file) {
    if (!file?.buffer?.length) {
        throw new ApiError(400, "Uploaded file is empty or missing");
    }

    let raw;
    try {
        if (file.mimetype === PDF) raw = await extractPdf(file.buffer);
        else if (file.mimetype === DOCX) raw = await extractDocx(file.buffer);
        else throw new ApiError(415, "Only PDF and DOCX files are supported");
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(422, `Could not read file: ${err.message}`);
    }

    const text = raw.replace(/\0/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

    if (text.length < 100) {
        throw new ApiError(422, "No readable text found. The file may be scanned or image-based.");
    }
    return text;
}

export default parseResume;