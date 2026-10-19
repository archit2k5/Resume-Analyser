import express from "express";
import cors from "cors";
import multer from "multer";
import { ApiError } from "./utils/ApiError.js";

// Import routes
import resumeRouter from "./routes/resume.routes.js";

const app = express();

// Global Middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || ["http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Routes declaration
app.use("/api/v1/resumes", resumeRouter);

app.use((req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors || [],
            data: err.data || null,
        });
    }

    //if error of different type
    let error = err;

    if (err instanceof multer.MulterError) {
        const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        error = new ApiError(status, err.message);
    } else if (!(err instanceof ApiError)) {
        console.error(err);
        error = new ApiError(500, "Internal server error");
    }

    return res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
        data: null,
    });
});

export { app };
export default app;