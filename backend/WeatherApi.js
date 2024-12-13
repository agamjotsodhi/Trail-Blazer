

// base API request, will change after
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY 



fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Toronto?unitGroup=metric&elements=datetime%2Cname%2Caddress%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cpreciptype%2Csnow%2Cwindspeedmean%2Cvisibility%2Cuvindex%2Csevererisk%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon%2Csource&include=days%2Ccurrent%2Calerts%2Cevents%2Cstatsfcst%2Cfcst%2Cobs%2Cremote&key=KQFPKFCQJF4683XQD7QTZGE5S&options=nonulls&contentType=json", {
    "method": "GET",
    "headers": {
    }
    })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });

//   Map icon to external icons