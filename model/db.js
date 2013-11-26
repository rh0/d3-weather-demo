var mongoose = require('mongoose');

var noaaSchema = mongoose.Schema({
  location: String,
  station_id: String,
  observation_time: Date,
  temp_f: Number,
  dewpoint_f: Number
});

mongoose.model('NoaaDb', noaaSchema);

mongoose.connect('mongodb://127.0.0.1/noaa');
