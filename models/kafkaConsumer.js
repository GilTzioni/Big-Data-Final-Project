const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "big-data-project",
  "metadata.broker.list": "localhost:9092"
};

const topics = {
  flights: 'flights',
  weather: 'weather'
}

const flightConsumer = new Kafka.KafkaConsumer(kafkaConf, {});

const weatherConsumer = new Kafka.KafkaConsumer(kafkaConf, {});

flightConsumer.connect();
weatherConsumer.connect();

flightConsumer.on("ready", function (arg) {
  // setup consumer  
  console.log(`Consumer ${arg.name} ready - for Redis & Dashboard`);
  flightConsumer.subscribe([topics.flights]);
  console.log("Subscribed.");
  
  //start consuming messages
  flightConsumer.consume();

}).on("disconnected", (arg) => {
  console.log('consumer disconnected. ' + JSON.stringify(arg));
  process.exit();
});

weatherConsumer.on("ready", function (arg) {
  // setup consumer  
  console.log(`Consumer ${arg.name} ready - for Redis & Dashboard`);
  weatherConsumer.subscribe([topics.weather]);
  console.log("Subscribed.");

  //start consuming messages
  weatherConsumer.consume();

}).on("data", function (data) {
  console.log(`weather data : ${data}`);
}).on("error", (err) => {
  console.error(err);
}).on("disconnected", (arg) => {
  console.log('consumer disconnected. ' + JSON.stringify(arg));
  process.exit();
});

module.exports.flightConsumer = flightConsumer;
module.exports.weatherConsumer = weatherConsumer;