const express = require('express');
const app = express();
const Port = 3000;
var server = require('http').createServer(app);
const io = require("socket.io")(server, {
  allowEIO3: true // false by default
});

const kafka = require('./models/kafkaConsumer');
const redis = require("./models/redisDB");
const controllerRouter = require('./routes/controller');
var bodyParser = require('body-parser')
const { Console } = require('console');

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());

//Socket.io
io.on("connection", async (socket) => {
  //Get data from redis to dashboard
  // let allData = await redis.getAllData();


  //Reset Info Manualiy
  socket.on('resetDB', function () {
    // reset redis
    redis.initDB();
  });

});

//Consumer kafka
kafka.flightConsumer.on("data", async (msg) => {
  let flights = JSON.parse(msg.value);
  console.log(`flight data : ${msg.value}`);

  flights.data.arrivals.forEach(element => {
    redis.setFlight(element.flight_iati, element);
});

 flights.data.departures.forEach(element => {
  redis.setLanding(element.flight_iati, element);
});

// let flightsArray = await redis.getAllFlights();
// let landingArray = await redis.getAllLandings();
let arr = Array.from(["id", "src", "dest"]);
console.log(arr.length);
io.emit("flight", flights.data.departures);
io.emit("landing", flights.data.arrivals);


}).on("error", (err) => {
  console.error(err);
})




app.use('/', controllerRouter);

server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));
