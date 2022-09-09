const Kafka = require('node-rdkafka');

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {
    topic: 'flights'
});

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
});


const queueFlight = (data) => {
    console.log("Queue Flight");
    stream.producer.flush();
    const success = stream.write(Buffer.from(JSON.stringify(data)));
    if (success) {
        console.log(`message queued (${JSON.stringify(data)})`);
    } else {
        console.log(success);
    }
}

module.exports = queueFlight;