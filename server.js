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


/********fake data**********/
const fakeData = Array.from([
  {
    flight_iata: "5X264",
    dep_iata: "CGN",
    arr_iata: "TLV",
    location: {
      updated: "2022-09-10T05:17:52+00:00",
      latitude: 35.33,
      longitude: 29.75,
      altitude: 10675.6,
      direction: 127.4,
      speed_horizontal: 920.844,
      speed_vertical: 0,
      is_ground: false
    },
    status: "active",
    dep_time: {
      scheduled: "2022-09-10T04:17:00+00:00",
      estimated: "2022-09-10T04:17:00+00:00",
      actual: "2022-09-10T04:18:00+00:00"
    },
    arr_time: {
      scheduled: "2022-09-10T09:24:00+00:00",
      estimated: "2022-09-10T09:24:00+00:00",
      actual: null
    }
  },
  {
    flight_iata: "5X263",
    dep_iata: "TLV",
    arr_iata: "JFK",
    location: {
      updated: "2022-09-10T05:17:52+00:00",
      latitude: 35.33,
      longitude: 29.75,
      altitude: 10675.6,
      direction: 127.4,
      speed_horizontal: 920.844,
      speed_vertical: 0,
      is_ground: false
    },
    status: "scheduled",
    dep_time: {
      scheduled: "2022-09-10T04:22:22+00:00",
      estimated: "2022-09-10T04:22:22+00:00",
      actual: "2022-09-10T04:18:00+00:00"
    },
    arr_time: {
      scheduled: "2022-09-10T09:22:22+00:00",
      estimated: "2022-09-10T09:22:22+00:00",
      actual: null
    }
  },
  {
    flight_iata: "5Y264",
    dep_iata: "LAX",
    arr_iata: "TLV",
    location: null,
    status: "scheduled",
    dep_time: {
      scheduled: "2022-09-10T04:17:00+00:00",
      estimated: "2022-09-10T04:17:00+00:00",
      actual: null
    },
    arr_time: {
      scheduled: "2022-09-10T09:24:00+00:00",
      estimated: "2022-09-10T09:24:00+00:00",
      actual: null
    }
  },
  {
    flight_iata: "2X264",
    dep_iata: "CIA",
    arr_iata: "TLV",
    location: null,
    status: "scheduled",
    dep_time: {
      scheduled: "2022-09-10T04:17:00+00:00",
      estimated: "2022-09-10T04:17:00+00:00",
      actual: null
    },
    arr_time: {
      scheduled: "2022-09-10T09:22:00+00:00",
      estimated: "2022-09-10T09:22:00+00:00",
      actual: null
    }
  },
  {
    flight_iata: "1Z264",
    dep_iata: "ICA",
    arr_iata: "TLV",
    location: null,
    status: "landed",
    dep_time: {
      scheduled: "2022-09-10T04:17:00+00:00",
      estimated: "2022-09-10T04:17:00+00:00",
      actual: "2022-09-10T04:18:00+00:00"
    },
    arr_time: {
      scheduled: "2022-09-10T09:23:35+00:00",
      estimated: "2022-09-10T09:23:35+00:00",
      actual: "2022-09-10T11:18:00+00:00"
    }
  },
  {
    flight_iata: "5X224",
    dep_iata: "BUD",
    arr_iata: "TLV",
    location: {
      updated: "2022-09-10T05:17:52+00:00",
      latitude: 22.33,
      longitude: 30.85,
      altitude: 10675.6,
      direction: 127.4,
      speed_horizontal: 920.844,
      speed_vertical: 0,
      is_ground: false
    },
    status: "active",
    dep_time: {
      scheduled: "2022-09-10T04:23:35+00:00",
      estimated: "2022-09-10T04:23:35+00:00",
      actual: "2022-09-10T04:18:00+00:00"
    },
    arr_time: {
      scheduled: "2022-09-10T09:23:35+00:00",
      estimated: "2022-09-10T09:23:35+00:00",
      actual: null
    }
  },
  {
    flight_iata: "5X212",
    dep_iata: "TLV",
    arr_iata: "VIE",
    location: {
      updated: "2022-09-10T05:17:52+00:00",
      latitude: 32.33,
      longitude: 21.75,
      altitude: 10675.6,
      direction: 127.4,
      speed_horizontal: 920.844,
      speed_vertical: 0,
      is_ground: false
    },
    status: "active",
    dep_time: {
      scheduled: "2022-09-10T04:23:35+00:00",
      estimated: "2022-09-10T04:23:35+00:00",
      actual: "2022-09-10T04:18:00+00:00"
    },
    arr_time: {
      scheduled: "2022-09-10T09:23:35+00:00",
      estimated: "2022-09-10T09:23:35+00:00",
      actual: null
    }
  }
])

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



// //Consumer kafka
kafka.flightConsumer.on("data", async (msg) => {
  let flights = JSON.parse(msg.value);
  console.log("***** Consumer got data *****");

  flights.data.arrivals.forEach(element => {
    redis.setFlight(element.flight_iata, element);
  });

  flights.data.departures.forEach(element => {
    redis.setLanding(element.flight_iata, element);
  });

//   // let flightsArray = await redis.getAllFlights();
//   // let landingArray = await redis.getAllLandings();

  io.emit("flight", flights.data.departures);
  io.emit("landing", flights.data.arrivals);
    //  io.emit("weather", );

}).on("error", (err) => {
  console.error(err);
})




app.use('/', controllerRouter);

server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));
