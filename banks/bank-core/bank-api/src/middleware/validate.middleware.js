import AppError from "../errors/AppError.js";

const validate = (validator) => {
    return async (req, res, next) => {
        try {
            const result = await validator(req);

            /*
             * Validator can return:
             *
             * {
             *     valid: false,
             *     errors: [...]
             * }
             */

            if (!result || result.validate === false) {
                throw new AppError(
                    "Validation failed",
                    400,
                    result?.errors || null
                );
            }

            /*
             * If validator returns sanitized data,
             * replace request body with it.
             */
            if (result.data) {
                req.body = result.data;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validate;