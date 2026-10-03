export const successResponse = (
    res,
    message,
    data = null,
    statuscode = 200
) => {
    return res.status(statuscode).json({
        success: true,
        message,
        data,
    });
};

export const errorResopnse = (
    res,
    message,
    errors = null,
    statuscode = 500
) => {
    return res.status(statuscode).json({
        success: false,
        message,
        errors,
    });
};