const express = require('express');
const app = express();
const port = 3001;

const getFlights = require('./data-fetcher/rt-flight-fetcher');
const getWeather = require('./data-fetcher/weather-fetcher');

const db = require('./db-logger/sql-logger');
const logger = require('./middleware/console-logger');

const queueFlight = require('./message-producers/flight-producer'); 

const cors = require('cors');


db.connect();

app.use(cors());
app.use(logger);

app.get('/', (req, res) => {
  res.send("Fetcher base");
})

app.get('/flights', (req, res) => {
  getFlights()
    .then(response => {
      res.json(response);
      // queueFlight(response);
      try {
        db.logger(req, response, 'flights');
      } catch (error) {
        console.error(error)
      }
    })
    .catch(error => {
      console.error(error);
    })
})

app.get('/weather', (req, res) => {
  getWeather()
    .then(response => {
      res.json(response);
      try {
        db.logger(req, response, 'weather');
      } catch (error) {
        console.error(error)
      }
    })
    .catch(error => {
      console.error(error);
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
