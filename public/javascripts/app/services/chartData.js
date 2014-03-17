angular.module('noaaDataApp').factory('chartData', function($http, $q) {
  return {
    getWeatherData : function(callback) {
      var promise = $http.get('/weather-data').then(function(res) {
        console.log(res);
        return res.data;
      });
      return promise;
    }
  }
});
