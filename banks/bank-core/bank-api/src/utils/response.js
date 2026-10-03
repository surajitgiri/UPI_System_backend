// Success Response
export const successResponse = (
    res,
    message = "Request successful",
    data = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};


// Error Response
export const errorResponse = (
    res,
    message = "Something went wrong",
    errors = null,
    statusCode = 500
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};


// Created Response
export const createdResponse = (
    res,
    message = "Resource created successfully",
    data = null
) => {
    return res.status(201).json({
        success: true,
        message,
        data,
    });
};

//  No Content Response
export const noContentResponse = (res) => {
    return res.status(204).send();
}