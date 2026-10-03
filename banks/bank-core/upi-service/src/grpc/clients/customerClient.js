// upi-service/src/grpc/clients/customerClient.js
// gRPC client for customer-service — used to validate userId before creating a VPA

import grpc        from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path        from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../../proto/customer.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs:    String,
    enums:    String,
    defaults: true,
    oneofs:   true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const CUSTOMER_GRPC_ADDRESS = process.env.CUSTOMER_GRPC_ADDRESS || "localhost:50051";

const customerClient = new proto.customer.CustomerService(
    CUSTOMER_GRPC_ADDRESS,
    grpc.credentials.createInsecure()
);

// ─────────────────────────────────────────────
// Promisified helper
// ─────────────────────────────────────────────

export function getCustomerById(customerId) {
    return new Promise((resolve, reject) => {
        customerClient.GetCustomerById({ id: customerId }, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

export default customerClient;
