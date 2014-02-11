angular.module('noaaDataApp').factory('chartData', function($http, $q) {
  return {
    getWeatherData : function(callback) {
      $http.get('/weather-data').success(callback);
    }
  }
});
