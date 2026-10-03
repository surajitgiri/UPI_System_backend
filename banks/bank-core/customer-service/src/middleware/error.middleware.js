const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      type: err.name || "internalServerError",
      message: err.message || "Something went wrong",
      details: err.errors || null
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

export default errorMiddleware;