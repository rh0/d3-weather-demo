angular.module('noaaDataApp').directive('graphLine', function(chartData) {
  return {
    scope: false,
    link: function(scope, element, attrs) {
      chartData.getWeatherData().then(function(weatherData) {

        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            fullWidth = 720,
            fullHeight = 430,
            width = fullWidth - margin.left - margin.right,
            height = fullHeight - margin.top - margin.bottom;

        var dateOut = new Date,
            parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse,
            bisectDate = d3.bisector(function(d) { return parseDate(d.observation_time); }).left;

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
            .interpolate("cardinal")
            .x(function(d) { return x(parseDate( d.observation_time )); })
            .y(function(d) { return y(d.temp_f); });

        var dewLine = d3.svg.line()
            .interpolate("cardinal")
            .x(function(d) { return x(parseDate( d.observation_time )); })
            .y(function(d) { return y(d.dewpoint_f); });

        var svg = d3.select(element[0]).append("svg")
            //.attr("width", width + margin.left + margin.right)
            //.attr("heght", height + margin.top + margin.bottom)
            // Firefox fix.
            //.attr("width", '100%')
            //.attr("height", '100%')
            .attr('viewBox', '0 0 ' + fullWidth + ' ' + fullHeight)
            .attr('preserveAspectRatio', 'xMinYMin meet')
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
            .attr("y1", y(32))
            .attr("x2", width)
            .attr("y2", y(32))
            .attr("stroke", "lightblue");

        svg.append("text")
            .attr("x", width)
            .attr("y", y(32))
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
        var tempFocus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");
        var dewFocus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        tempFocus.append("circle")
            .attr("r", 4.5);
        dewFocus.append("circle")
            .attr("r", 4.5);

        tempFocus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
        dewFocus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() {
              tempFocus.style("display", null);
              dewFocus.style("display", null);
            })
            .on("mouseout", function() {
              tempFocus.style("display", "none");
              dewFocus.style("display", "none");
            })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(weatherData, x0, 1),
              d0 = weatherData[i -1],
              d1 = weatherData[i],
              d = x0 - parseDate( d0.observation_time ) > parseDate( d1.observation_time ) - x0 ? d1 : d0;
          tempFocus.attr("transform", "translate(" + x(parseDate(d.observation_time)) + "," + y(d.temp_f) + ")");
          tempFocus.select("text").text(d.temp_f);
          dewFocus.attr("transform", "translate(" + x(parseDate(d.observation_time)) + "," + y(d.dewpoint_f) + ")");
          dewFocus.select("text").text(d.dewpoint_f);
          scope.$apply(function() {
            scope.hover.temp = d.temp_f;
            scope.hover.dew = d.dewpoint_f;
            dateOut.setTime(Date.parse(d.observation_time));
            scope.hover.obsTime = dateOut.toString();
          });
        }
      });
    }
  };
});

