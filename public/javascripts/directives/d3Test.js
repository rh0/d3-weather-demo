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
        chartData.getWeatherData(function(weatherData) {

          var margin = { top: 20, right: 20, bottom: 30, left: 50 },
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse,
              bisectDate = d3.bisector(function(d) { return d.date; }).left;

          var x = d3.time.scale()
              .range([0, width]);
          var y = d3.scale.linear()
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");
          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

          var tempLine = d3.svg.line()
              .interpolate("basis")
              .x(function(d) { return x(parseDate( d.observation_time )); })
              .y(function(d) { return y(d.temp_f); });

          var dewLine = d3.svg.line()
              .interpolate("basis")
              .x(function(d) { return x(parseDate( d.observation_time )); })
              .y(function(d) { return y(d.dewpoint_f); });

          var svg = d3.select(element[0]).append("svg")
              //.attr("width", width + margin.left + margin.right)
              //.attr("heght", height + margin.top + margin.bottom)
              // Firefox fix.
              .attr("width", window.innerWidth)
              .attr("height", window.innerHeight)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(d3.extent(weatherData, function(d) { return parseDate(d.observation_time); }));
          y.domain([
            d3.min(weatherData, function(d) { return Math.min(d.temp_f, d.dewpoint_f); }),
            d3.max(weatherData, function(d) { return Math.max(d.temp_f, d.dewpoint_f); })
          ]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("x", width)
              .attr("dx", ".71em")
              .style("text-anchor", "end")
              .text("Time (UTC)");


          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Temperature (F)");

          svg.append("line")
              .attr("x1", 0)
              .attr("y1", 32)
              .attr("x2", width)
              .attr("y2", 32)
              .attr("stroke", "lightblue");

          svg.append("text")
              .attr("x", width)
              .attr("y", 32)
              .attr("text-anchor", "end")
              .text("☃")
              .attr("fill", "lightblue")
              .attr("font-size", "45px")
              .attr("font-weight", "bold");



          // Appending Temp Line
          svg.append("path")
              .datum(weatherData)
              .attr("class", "line")
              .style("stroke", "red")
              .attr("d", tempLine);

          // Appending Dew Point Line
          svg.append("path")
              .datum(weatherData)
              .attr("class", "line")
              .style("stroke", "blue")
              .attr("d", dewLine);

          // Hover info
          /*var focus = svg.append("g")
              .attr("class", "focus")
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
            focus.select("text").text(d.temp_f);
          }*/
        });
      }
    };
  });

