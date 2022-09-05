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
  const producer = new Kafka.Producer(kafkaConf);
  
  const topics = [topic];
  const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
  });

  consumer.on("error", (err) => {
    console.log("1");
      console.error(err);
  });

    consumer.on("disconnected", (arg)=> {
    console.log("2");
    process.exit();
  });

  consumer.on('event.error', (err)=> {
    console.error(err);
    process.exit(1);
  });

  consumer.on('event.log', function(log) {
    console.log("3");
    console.log(log);
  });

  consumer.connect();

  module.exports.consumer = consumer;