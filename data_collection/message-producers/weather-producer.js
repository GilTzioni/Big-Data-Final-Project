const Kafka = require('node-rdkafka');

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {
    topic: 'weather'
});

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
});


const queueWeather = (data) => {
    const success = stream.write(eventType.toBuffer(data));
    if (success) {
        console.log(`message queued (${JSON.stringify(data)})`);
    } else {
        console.log('Too many messages in the queue already..');
    }
}

module.exports = queueWeather;
