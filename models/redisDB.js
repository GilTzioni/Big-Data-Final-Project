const Redis = require('redis');
const db = require('./connectRedis');

const keys = ["landings", "flights","weather","locations"];


redis
    .on("connect", function () {
        console.log("Reciever connected to Redis at: " + process.env.REDIS_URL);
    })
    .on("error", function (err) {
        console.log("Error " + err);
    });