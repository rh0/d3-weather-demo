angular.module('noaaDataApp').factory('chartData', function($http, $q) {
  return {
    getWeatherData : function(callback) {
      var deferred = $q.defer();
      $http.get('/weather-data').then(function(res) {
        //return res.data;
        for(var i=0; i<res.data.length; i++) {
          //sanity check
          if(!isFinite( res.data[i]["temp_f"] ) || !isFinite( res.data[i]["dewpoint_f"] )) {
            console.log("NAN!");
            console.log(res.data.splice(i,1));
          }
        }
        deferred.resolve(res.data);
      });
      return deferred.promise;
    }
  }
});
