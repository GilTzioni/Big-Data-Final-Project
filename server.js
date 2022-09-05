const express = require('express');
const app = express();
const Port = process.env.PORT || 3000;
var server = require('http').createServer(app);

const kafka = require('./models/kafkaConsume');

const controllerRouter = require('./routes/controller'); //controller

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());

app.use('/', controllerRouter);
server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));

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
