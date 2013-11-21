angular.module('directiveExample', [])
  .controller('Ctrl', function($scope) {
    $scope.format = 'M/d/yy h:mm:ss a';
  })
  .directive('myCurrentTime', function($timeout, dateFilter) {

    function link(scope, element, attrs) {
      var format,
          timeoutId;

      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });

      function scheduleUpdate() {
        timeoutId = $timeout(function() {
          updateTime();
          scheduleUpdate();
        }, 1000);
      }
      scope.$on('$destroy', function() {
        $timeout.cancel(timeoutId);
      });

      scheduleUpdate();
    }


    return {
      link: link
    };
  });
