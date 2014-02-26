angular.module('noaaDataApp').controller('WeatherDetailsCtrl', ['$scope', function($scope) {
  $scope.greetings = "¿Que tal?";
  $scope.hover = {
    temp : 100,
    dew: 50
  };
}]);
