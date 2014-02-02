var http = require("http");
var parseXmlString = require("xml2js").parseString;
var NoaaData = require('../model/db');

var options = {
  hostname: 'http://w1.weather.gov/',
  path: '/xml/current_obs/KATT.xml'
};

exports.fetchNoaaData = function() {
  var noaaData = '';

  http.get("http://w1.weather.gov/xml/current_obs/KATT.xml", function(res) {
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
          var weatherObservation = xmlRes.current_observation;
          NoaaData.create({
            location: weatherObservation.location,
            station_id: weatherObservation.station_id,
            observation_time: weatherObservation.observation_time,
            temp_f: weatherObservation.temp_f,
            dewpoint_f: weatherObservation.dewpoint_f
          }, function(err, small) {
            if(err) return console.log(err);
            console.log("Saved!");
          })
        }
      })
    });
  }).on('error', function(e) {
    console.log('problem with get: ' + e.message);
  });
};

