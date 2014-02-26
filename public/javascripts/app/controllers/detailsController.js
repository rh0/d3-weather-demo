angular.module('noaaDataApp').controller('WeatherDetailsCtrl', ['$scope', function($scope) {
  $scope.hover = {
    obsTime: '',
    temp : '',
    dew: ''
  };
}]);
