var mongoose = require("mongoose");

var noaaSchema = mongoose.Schema({
  location: String,
  station_id: String,
  observation_time: Date,
  temp_f: String,
  dewpoint_f: String
});

module.exports = mongoose.model('NoaaData', noaaSchema);

mongoose.connect('mongodb://127.0.0.1/noaa');
