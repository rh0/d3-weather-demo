var mongoose = require("mongoose");

var noaaSchema = mongoose.Schema({
  location: String,
  station_id: String,
  observation_time: Date,
  temp_f: String,
  dewpoint_f: String
});

module.exports = mongoose.model('NoaaData', noaaSchema);

mongoose.connect('mongodb://heroku_app21958260:6p4ho4pf059p2tklur2c2369va@ds027729.mongolab.com:27729/heroku_app21958260');
