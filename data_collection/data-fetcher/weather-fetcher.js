const axios = require("axios").default;

const apiKey = "7b1de86f2cc2ac47a24c804fb59f90a2";
const BGAirportLat = "32.00";
const BGAirportLon = "34.88";
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${BGAirportLat}&lon=${BGAirportLon}&APPID=${apiKey}&units=metric`

const getWeather = async () => {
    const response =  await axios.get(baseUrl);
    return {data: response.data, status: response.status};
}

module.exports = getWeather;