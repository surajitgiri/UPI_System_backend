import { Router } from "express";

import customerController from "../controllers/customer.controller.js";

import validate from "../middleware/validate.middleware.js";

import customerValidator from "../validators/customer.validator.js";


const router = Router();


/*
|--------------------------------------------------------------------------
| POST /customers
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    validate(customerValidator.createCustomerValidator),
    customerController.createCustomer
);


/*
|--------------------------------------------------------------------------
| GET /customers
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    customerController.getCustomers
);


/*
|--------------------------------------------------------------------------
| GET /customers/:id
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    validate(customerValidator.customerIdValidator),
    customerController.getCustomerById
);


/*
|--------------------------------------------------------------------------
| PATCH /customers/:id
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id",
    validate(customerValidator.updateCustomerValidator),
    customerController.updateCustomer
);


/*
|--------------------------------------------------------------------------
| DELETE /customers/:id
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    validate(customerValidator.customerIdValidator),
    customerController.deleteCustomer
);


export default router;