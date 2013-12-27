var http = require('http');
var parseXmlString = require('xml2js').parseString;
var noaaData = '';

var options = {
  hostname: 'http://w1.weather.gov/',
  path: '/xml/current_obs/KATT.xml'
};

var fetchWeather = http.get("http://w1.weather.gov/xml/current_obs/KATT.xml", function(res) {
  console.log('STATUS: ' + res.statusCode);
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    noaaData += chunk;
  });
  res.on('end', function() {
    parseXmlString(noaaData, function(xmlE, xmlRes) {
      if(xmlE) {
        console.log('There was an error parsing XML: ' + xmlE);
      }
      else {
        noaa.NoaaData.create(xmlRes.current_observation, function(err, small) {
          if(err) return handleError(err);
          console.log("Saved!");
        })
      }
    })
  });
}).on('error', function(e) {
  console.log('problem with get: ' + e.message);
});
