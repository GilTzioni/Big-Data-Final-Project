const redis = require('ioredis');

const conn = {
    port: 6379,
    host: "127.0.0.1",
    db: 0,
    password: "b6fchcdikmyaC0d0BDAEfrr0MrvsLquX"
};

const redisDb = new redis(conn);
module.exports = redisDb;