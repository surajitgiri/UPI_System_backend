import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import customerHandler from "./customer.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/customer.proto");

export const startGrpcServer = (port = process.env.GRPC_PORT || 50051) => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition);

    const server = new grpc.Server();

    server.addService(
        proto.customer.CustomerService.service,
        {
            CreateCustomer: customerHandler.createCustomer,
            GetCustomers: customerHandler.getCustomers,
            GetCustomerById: customerHandler.getCustomerById,
            UpdateCustomer: customerHandler.updateCustomer,
            DeleteCustomer: customerHandler.deleteCustomer,
        }
    );

    const bindAddress = `0.0.0.0:${port}`;

    server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (err, boundPort) => {
            if (err) {
                console.error("❌ Customer gRPC Server Bind Error:", err);
                return;
            }
            console.log(`✅ Customer gRPC Server Running on port ${boundPort}`);
        }
    );

    return server;
};