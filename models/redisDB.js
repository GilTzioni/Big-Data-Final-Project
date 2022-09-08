const Redis = require('redis');
const db = require('./connectRedis');
const keys = ["flight"];

const redisDB = {

    //Init all keys
    initDB: async function() 
    {
        keys.forEach(key => {
            db.set(key, 0);
        });
        console.log('initDB');
    },
    
    setFlight: async function(key, value){
        try
        {
            await db.set(key, value); // stores the data in the database
        } 
        catch (error)
        {
            console.log(error);
        }
    },
    
    getAllData: async function() 
    {
        let allData = [];
        allData.push(await db.get('flight'));
        console.log("Get all data from Redis!");
        return allData;
    },
    
}

module.exports = redisDB;
