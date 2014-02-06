angular.module('graphTest', [])
  .factory('chartData', function($http, $q) {
    return {
      getWeatherData : function(callback) {
        $http.get('/weather-data').success(callback);
      }
    }
  })
  .directive('graphLine', function(chartData) {
    return {
      link: function(scope, element, attrs) {
        weatherData = [];
        chartData.getWeatherData(function(d) {
          weatherData = d;
          console.log(d);
        });

        var exponentialFormatter = d3.format(".3g"),
            bisectDate = d3.bisector(function(d) { return d.observation_time; }).left;

        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);
        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(exponentialFormatter);

        var line = d3.svg.line()
            .x(function(d) { return x(d.observation_time); })
            .y(function(d) { return y(d.temp_f); });

        var svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("heght", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(weatherData, function(d) { return d.observation_time; }));
        y.domain(d3.extent(weatherData, function(d) { return d.temp_f; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");

        svg.append("path")
            .datum(weatherData)
            .attr("class", "line")
            .attr("d", line);

        var focus = svg.append("g")
            .attr("class", "line")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .on("mouseover", function() { focus.style("display", null); } )
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(weatherData, x0, 1),
              d0 = weatherData[i -1],
              d1 = weatherData[i],
              d = x0 - d0.observation_time > d1.observation_time - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + x(d.observation_time) + "," + y(d.temp_f) + ")");
          focus.select("text").text(d.observation_time + ", " + exponentialFormatter(d.temp_f));
        }
      }
    };
  });

