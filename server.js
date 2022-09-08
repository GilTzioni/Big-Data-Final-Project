const express = require('express');
const app = express();
const Port = process.env.PORT || 3000;
var server = require('http').createServer(app);
const io = require("socket.io")(server, {
    allowEIO3: true // false by default
});

const kafka = require('./models/kafkaConsumer');
const redis = require("./models/redisDB");
const controllerRouter = require('./routes/controller'); 
const landingsRouter = require('./routes/landings');
const flightsRouter = require('./routes/flights');

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());


//Socket.io
io.on("connection", async (socket) => {
    //Get data from redis to dashboard
    let allDataArray = await redis.getAllData();
    
    //Move to dashboard - number of calls by topics & number of waiting & number of calls by cities
    io.emit('allData', 
    {});

    //Reset Info Manualiy
    socket.on('resetDB', function () {
        // reset redis
        redis.initDB(); 
    });

});

//Consumer kafka
kafka.consumer.on("data", async (msg) => {
    let newFlight = JSON.parse(msg.value);

    // **Store the data in Redis and after send to Dashboard */
    if(String(msg.value).includes("weather")) // Weather details
    {   
    }
    else
    {
        redis.setTopic("flight",msg.value);
        let allData = await redis.getAllData();//Get data from redis to dashboard    
        io.emit("newFlight",
        {data: JSON.parse(allData[0])}); //Send to front with socket
    }

    
    
app.use('/', controllerRouter);
app.use('/', landingsRouter);
app.use('/', flightsRouter);

server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));
