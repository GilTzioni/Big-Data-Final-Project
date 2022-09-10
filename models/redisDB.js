const db = require('./connectRedis');
const keys = ["flight", "landing"];

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
    
    setLanding: async function(key, value){
        try
        {
            await db.set(key, value); // stores the data in the database
        } 
        catch (error)
        {
            console.log(error);
        }
    },

    getAllFlights: async function() 
    {
        let flights = [];
        flights.push(await db.get('flight'));
        console.log("Get all data from Redis!");
        return flights;
    },
    getAllLandings: async function() 
    {
        let landings = [];
        landings.push(await db.get('landing'));
        console.log("Get all data from Redis!");
        return landings;
    },
    
}

module.exports = redisDB;
