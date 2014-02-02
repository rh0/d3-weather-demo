/**
 * GET weather data
 */
var NoaaData = require('../model/db');

exports.fetchWeather = function(req, res) {
  NoaaData.find({}, function(err, docs) {
    res.send(docs);
  });
}
