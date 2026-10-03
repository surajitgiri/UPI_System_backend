export const successResponse = (
    res,
    message,
    data = null,
    statusCode = 200
) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export const errorResponse = (
    res,
    message,
    errors = null,
    statusCode = 400
) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors
    })
}