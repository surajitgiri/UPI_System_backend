const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || err.statuscode || 500;

    res.status(statusCode).json({
        success: false,
        error: err.name || "Error",
        message: err.message || "Internal Server Error",
        details: err.error || err.errors || null,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
    });
};

export default errorMiddleware;
