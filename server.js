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
  let allData = await redis.getAllData();


  //Reset Info Manualiy
  socket.on('resetDB', function () {
    // reset redis
    redis.initDB();
  });

});

//Consumer kafka
kafka.flightConsumer.on("data", function (data) {
  console.log(`flight data : ${JSON.parse(data.value)}`);
}).on("error", (err) => {
  console.error(err);
})




app.use('/', controllerRouter);

server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));
