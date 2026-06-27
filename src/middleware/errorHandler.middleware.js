import logger from "../utils/logger.js";

export const errorHandler = (error, req, res, next) => {
    logger.error(error.message, { stack: error.stack, path: req.path })

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Internal Server Error"
    })
}