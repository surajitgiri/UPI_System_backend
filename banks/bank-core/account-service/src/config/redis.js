import { createClient } from 'redis';

const redis = createClient({
    username: 'default',
    password: 'ONsktd7Z4PhNlBRL56S6kGfF2rnKqnI9',
    socket: {
        host: 'redis-14265.c10.us-east-1-4.ec2.cloud.redislabs.com',
        port: 14265
    }
});

redis.on("connect", () => {
    console.log("Redis Connecting...");
});

redis.on("ready", () => {
    console.log("Redis Ready");
});

redis.on("end", () => {
    console.log("Redis Connection Closed");
});

redis.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

export default redis;