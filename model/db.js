var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/noaa');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback() {
  console.log('MongoDB connection status: SUCCESS!');
  var noaaSchema = mongoose.Schema({
    location: String,
    station_id: String,
    observation_time: Date,
    temp_f: Number,
    dewpoint_f: Number
  });

  var NoaaDb = mongoose.model('NoaaDb', noaaSchema);
});
