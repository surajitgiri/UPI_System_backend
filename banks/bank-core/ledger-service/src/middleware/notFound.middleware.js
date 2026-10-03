const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    });
};

export default notFoundMiddleware;
