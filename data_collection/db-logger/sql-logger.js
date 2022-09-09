const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  password: "password",
  user: "root",
  database: "logger"
})

const connect = () => {
  db.connect((error) => {
    if (error) return console.error("Error: " + error.message);
    console.log("Connected!");
  })
}

const logger = (request, response, requested_data) => {
  const sqlQuery = `INSERT INTO
  api_calls (time_pulled, url_used, requested_data, response_status)
  VALUES ("${(new Date()).toISOString().slice(0, 19).replace('T', ' ')}", "${request.path}", "${requested_data}", "${String(response.status)}")`;

  db.query(sqlQuery, (err, result) => {
    if (err) return console.error(err.message);
    console.log(result);
  })
}

module.exports = { connect, logger };