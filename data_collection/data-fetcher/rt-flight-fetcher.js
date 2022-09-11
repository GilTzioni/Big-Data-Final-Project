const axios = require("axios").default;

const baseUrl = "http://api.aviationstack.com/v1/flights?";    // This API does not support HTTPS requests in the free version
const apiKey = "access_key=0d0bda1fdac780fba7fa8cca3fc92c37";  // Can be reset if needed
const arrivalFilter = "arr_iata=TLV"
const departureFilter = "dep_iata=TLV"

const getFlights = async () => {
  try {

    const arrData = await arrFetcher();
    const depData = await depFetcher();
    const cleanArrData = arrData.data
      .filter(flight => flight.flight_status !== "landed" && flight.flight_status !== "cancelled")
      .map(flight => {
        return {
          flight_iata: flight.flight.iata,
          dep_iata: flight.departure.iata,
          arr_iata: flight.arrival.iata,
          status: flight.flight_status,
          location: flight.live,
          dep_time: {
            scheduled: flight.departure.scheduled,
            estimated: flight.departure.estimated,
            actual: flight.departure.actual,
            timezone: flight.departure.timezone
          },
          arr_time: {
            scheduled: flight.arrival.scheduled,
            estimated: flight.arrival.estimated,
            actual: flight.arrival.actual,
            timezone: flight.arrival.timezone
          }
        }
      })
    const cleanDepData = depData.data
      .filter(flight => flight.flight_status !== "landed" && flight.flight_status !== "cancelled")
      .map(flight => {
        return {
          flight_iata: flight.flight.iata,
          dep_iata: flight.departure.iata,
          arr_iata: flight.arrival.iata,
          status: flight.flight_status,
          location: flight.live,
          dep_time: {
            scheduled: flight.departure.scheduled,
            estimated: flight.departure.estimated,
            actual: flight.departure.actual,
            timezone: flight.departure.timezone
          },
          arr_time: {
            scheduled: flight.arrival.scheduled,
            estimated: flight.arrival.estimated,
            actual: flight.arrival.actual,
            timezone: flight.arrival.timezone
          }
        }
      })
    const allData = { arrivals: cleanArrData, departures: cleanDepData };
    return { data: allData, status: (arrData.status === 200 && depData.status === 200) ? 200 : 400 };

  } catch (error) {
    console.error(error);
  }
}

const arrFetcher = async () => {
  // constructing the flight fetching URL
  const queryString = baseUrl + apiKey + '&' + arrivalFilter;

  try {
    const res = await axios.get(queryString);
    return { data: res.data.data, status: res.status };
  } catch (error) {
    console.error(error);
  }

}

const depFetcher = async () => {
  // constructing the flight fetching URL
  const queryString = baseUrl + apiKey + '&' + departureFilter;

  try {
    const res = await axios.get(queryString);
    console.log(res);
    return { data: res.data.data, status: res.status };
  } catch (error) {
    console.error(error)
  }
}

module.exports = getFlights;
