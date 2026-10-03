import "dotenv/config";

/*
|--------------------------------------------------------------------------
| Environment Variables
|--------------------------------------------------------------------------
*/

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: Number(process.env.PORT) || 5005,

    HOST: process.env.HOST || "0.0.0.0",

    JWT_SECRET: process.env.JWT_SECRET,

    /*
    |--------------------------------------------------------------------------
    | gRPC Services
    |--------------------------------------------------------------------------
    */

    GRPC: {
        CUSTOMER: {
            HOST:
                process.env.CUSTOMER_GRPC_HOST ||
                "localhost",

            PORT:
                Number(process.env.CUSTOMER_GRPC_PORT) ||
                50051,
        },

        ACCOUNT: {
            HOST:
                process.env.ACCOUNT_GRPC_HOST ||
                "localhost",

            PORT:
                Number(process.env.ACCOUNT_GRPC_PORT) ||
                50052,
        },

        TRANSACTION: {
            HOST:
                process.env.TRANSACTION_GRPC_HOST ||
                "localhost",

            PORT:
                Number(process.env.TRANSACTION_GRPC_PORT) ||
                50053,
        },

        LEDGER: {
            HOST:
                process.env.LEDGER_GRPC_HOST ||
                "localhost",

            PORT:
                Number(process.env.LEDGER_GRPC_PORT) ||
                50054,
        },
    },
};


/*
|--------------------------------------------------------------------------
| Environment Validation
|--------------------------------------------------------------------------
*/

const validateEnv = () => {
    const errors = [];

    /*
     * JWT secret is required outside of development.
     */

    if (
        env.NODE_ENV !== "development" &&
        !env.JWT_SECRET
    ) {
        errors.push(
            "JWT_SECRET is required in production"
        );
    }


    /*
     * Validate PORT
     */

    if (
        !Number.isInteger(env.PORT) ||
        env.PORT <= 0 ||
        env.PORT > 65535
    ) {
        errors.push(
            "PORT must be a valid port number"
        );
    }


    /*
     * Validate gRPC ports
     */

    const grpcServices = [
        ["CUSTOMER", env.GRPC.CUSTOMER.PORT],
        ["ACCOUNT", env.GRPC.ACCOUNT.PORT],
        ["TRANSACTION", env.GRPC.TRANSACTION.PORT],
        ["LEDGER", env.GRPC.LEDGER.PORT],
    ];

    for (const [service, port] of grpcServices) {
        if (
            !Number.isInteger(port) ||
            port <= 0 ||
            port > 65535
        ) {
            errors.push(
                `${service}_GRPC_PORT must be a valid port number`
            );
        }
    }


    /*
     * Stop application if configuration is invalid.
     */

    if (errors.length > 0) {
        console.error(
            "\nEnvironment configuration errors:"
        );

        errors.forEach((error) => {
            console.error(`- ${error}`);
        });

        process.exit(1);
    }
};


/*
|--------------------------------------------------------------------------
| Validate Environment
|--------------------------------------------------------------------------
*/

validateEnv();


export default env;