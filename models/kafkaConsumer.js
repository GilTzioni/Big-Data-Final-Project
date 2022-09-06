// https://www.cloudkarafka.com/ 
const Kafka = require("node-rdkafka");
 
const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "jake66n3",
    "sasl.password": "tXn-8ov38rFZtyGcHvsoOtkhP7HSkVpR",
    "debug": "generic,broker,security"
  };
  
  const prefix = "jake66n3-";
  const topic = `${prefix}new`;
  
  const topics = [topic];
  const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
  }); 

  consumer.on("ready", function(arg) {
    console.log(`Consumer ${arg.name} ready - for Redis & Dashboard`);
    consumer.subscribe(topics);
    console.log("Subscribed.");
    //start consuming messages
    consumer.consume();
  });

  consumer.on("data", function(m) {
    console.log("DATA IN DA HOUSe");
  });

  consumer.on("error", (err) => {
    console.log("1");
      console.error(err);
  });

    consumer.on("disconnected", (arg)=> {
      console.log('consumer disconnected. ' + JSON.stringify(arg));
    process.exit();
  });

  consumer.on('event.error', (err)=> {
    console.error(err);
    process.exit(1);
  });

  consumer.on('event.log', function(log) {
      console.log(log);
  });

  
// //starting the consumer
// consumer.connect({}, function(err, d) {
//   console.log(err);
//   console.log(d)
// });
  consumer.connect();

  module.exports.consumer = consumer;