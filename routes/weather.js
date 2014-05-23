/**
 * GET weather data
 */
var NoaaData = require('../model/db');

exports.fetchWeather = function(req, res) {
  var q = NoaaData.find({}).limit(200);
  q.exec(function(err, docs) {
    res.send(docs);
  });
}
