/*
|--------------------------------------------------------------------------
| Customer Validator
|--------------------------------------------------------------------------
*/

const validateRequired = (value) => {
    return value !== undefined &&
        value !== null &&
        String(value).trim() !== "";
};


/*
|--------------------------------------------------------------------------
| Email Validator
|--------------------------------------------------------------------------
*/

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


/*
|--------------------------------------------------------------------------
| Phone Validator
|--------------------------------------------------------------------------
*/

const isValidPhone = (phone) => {
    return /^[0-9]{10,15}$/.test(String(phone));
};


/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
| POST /api/v1/customers
|--------------------------------------------------------------------------
*/

const createCustomerValidator = async (req) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        city,
        state,
        country,
        pincode,
    } = req.body;

    const errors = [];

    /*
    |--------------------------------------------------------------------------
    | First Name
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(firstName)) {
        errors.push({
            field: "firstName",
            message: "First name is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Last Name
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(lastName)) {
        errors.push({
            field: "lastName",
            message: "Last name is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Email
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(email)) {
        errors.push({
            field: "email",
            message: "Email is required",
        });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Invalid email address",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Phone
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(phone)) {
        errors.push({
            field: "phone",
            message: "Phone number is required",
        });
    } else if (!isValidPhone(phone)) {
        errors.push({
            field: "phone",
            message: "Phone number must contain 10-15 digits",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Date Of Birth
    |--------------------------------------------------------------------------
    */

    if (dateOfBirth !== undefined) {
        const date = new Date(dateOfBirth);

        if (Number.isNaN(date.getTime())) {
            errors.push({
                field: "dateOfBirth",
                message: "Invalid date of birth",
            });
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Address
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(address)) {
        errors.push({
            field: "address",
            message: "Address is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | City
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(city)) {
        errors.push({
            field: "city",
            message: "City is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(state)) {
        errors.push({
            field: "state",
            message: "State is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Country
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(country)) {
        errors.push({
            field: "country",
            message: "Country is required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Pincode
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(pincode)) {
        errors.push({
            field: "pincode",
            message: "Pincode is required",
        });
    }


    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        data: req.body,
    };
};


/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
| PATCH /api/v1/customers/:id
|--------------------------------------------------------------------------
*/

const updateCustomerValidator = async (req) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        city,
        state,
        country,
        pincode,
    } = req.body;

    const errors = [];


    if (firstName !== undefined && !validateRequired(firstName)) {
        errors.push({
            field: "firstName",
            message: "First name cannot be empty",
        });
    }


    if (lastName !== undefined && !validateRequired(lastName)) {
        errors.push({
            field: "lastName",
            message: "Last name cannot be empty",
        });
    }


    if (email !== undefined) {
        if (!validateRequired(email)) {
            errors.push({
                field: "email",
                message: "Email cannot be empty",
            });
        } else if (!isValidEmail(email)) {
            errors.push({
                field: "email",
                message: "Invalid email address",
            });
        }
    }


    if (phone !== undefined) {
        if (!validateRequired(phone)) {
            errors.push({
                field: "phone",
                message: "Phone cannot be empty",
            });
        } else if (!isValidPhone(phone)) {
            errors.push({
                field: "phone",
                message: "Phone number must contain 10-15 digits",
            });
        }
    }


    if (dateOfBirth !== undefined) {
        const date = new Date(dateOfBirth);

        if (Number.isNaN(date.getTime())) {
            errors.push({
                field: "dateOfBirth",
                message: "Invalid date of birth",
            });
        }
    }


    const textFields = [
        "address",
        "city",
        "state",
        "country",
        "pincode",
    ];

    for (const field of textFields) {
        if (
            req.body[field] !== undefined &&
            !validateRequired(req.body[field])
        ) {
            errors.push({
                field,
                message: `${field} cannot be empty`,
            });
        }
    }


    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        data: req.body,
    };
};


/*
|--------------------------------------------------------------------------
| Customer ID Validator
|--------------------------------------------------------------------------
*/

const customerIdValidator = async (req) => {
    const { id } = req.params;

    const errors = [];

    if (!validateRequired(id)) {
        errors.push({
            field: "id",
            message: "Customer ID is required",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


export default {
    createCustomerValidator,
    updateCustomerValidator,
    customerIdValidator,
};