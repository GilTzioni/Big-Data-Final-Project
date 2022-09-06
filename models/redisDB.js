const Redis = require('redis');
const db = require('./connectRedis');
const keys = ["landings", "flights","weather","locations"];

const redisDB = {

    //Init all keys
    initDB: async function() {
        keys.forEach(key => {
            db.set(key, 0);
        });
        console.log('initDB');
    },

    

    getAllData: async function() {
        let allData = [];

        allData.push(await db.get('landings'));
        allData.push(await db.get('flights'));
        allData.push(await db.get('locations'));
        allData.push(await db.get('leave'));
        allData.push(await db.get('weather'));

       
        console.log("Get all data from Redis!");
        return allData;
    },
    
}

module.exports = redisDB;
