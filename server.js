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
    const newFlights = JSON.parse(msg.value);

    // **Store the data in Redis and after send to Dashboard */
    if(String(msg.value).includes("topic")) // Details calls
    {   

        io.emit("New_Flights",
        {numflight: newFlights.numflight, flightname: newFlights.flightname, from: newFlights.from});

        redis.setNumFlight(newFlights.numflight);
        redis.setFlightName(newFlights.flightname);
        redis.setFlightFrom(newFlights.from);
    }

    //Get data from redis to dashboard
    let allDataArray = await redis.getAllData();
    
    //Send to front with socket
    io.emit('allData',
    {join: allDataArray[0],service: allDataArray[1], complaint: allDataArray[2] ,
         leave: allDataArray[3], waiting: allDataArray[4]});
});

app.use('/', controllerRouter);
app.use('/', landingsRouter);
app.use('/', flightsRouter);

server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));
