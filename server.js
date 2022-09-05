const express = require('express');
const app = express();
const Port = process.env.PORT || 3000;
var server = require('http').createServer(app);
const controllerRouter = require('./routes/controller'); //controller

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());

app.use('/', controllerRouter);
server.listen(Port, () => console.log(`Server B is listening at http://localhost:${Port}`));

