const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    res.status(err.statuscode || 500).json({
        success: false,
        error: err.name,
        message: err.message,
        details: err.errors || null,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};

export default errorMiddleware;