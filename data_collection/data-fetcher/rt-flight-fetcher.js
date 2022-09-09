const axios = require("axios").default;

const baseUrl = "http://airlabs.co/api/v9/schedules?";    // This API does not support HTTPS requests in the free version
const apiKey = "api_key=e078f635-e025-40f6-ad4b-63d6e370604e";  // Can be reset if needed
const arrivalFilter = "arr_iata=TLV"
const departureFilter = "dep_iata=TLV"
const required_fields = "_fields=flight_iata,dep_iata,arr_iata,lat,lng,dir"

const getFlights = async () => {
  try {

    const arrData = await arrFetcher();
    const depData = await depFetcher();
    const allData = { arrivals : arrData.data, departures: depData.data };
    return { data: allData, status: (arrData.status === 200 && depData.status === 200) ? 200 : 400} ;

  } catch (error) {
    console.error(error);
  }
}

const arrFetcher = async () => {
  // constructing the flight fetching URL
  const queryString = baseUrl + apiKey + '&' + arrivalFilter;

  try {
    const res = await axios.get(queryString);
    return { data: res.data.response, status: res.status };
  } catch (error) {
    console.error(error);
  }

}

const depFetcher = async () => {
  // constructing the flight fetching URL
  const queryString = baseUrl + apiKey + '&' + departureFilter;

  try {
    const res = await axios.get(queryString);
    return { data: res.data.response, status: res.status };
  } catch (error) {
    console.error(error)
  }
}

module.exports = getFlights;
