window.onload = function() {

  var minimumWages = "http://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+COL+CRI+LTU+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"
  var waste = "http://stats.oecd.org/SDMX-JSON/data/WSECTOR/AUS+AUT+BEL+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+COL+LTU.TOTAL_S+RES+TOTAL+01-03+01+05-09+10-33+10-12+13-15+16+17-18+19+20-22+23+24-33+24+24-25+25-28+26-30+29-33+31-33+35+36-39+41-43+45-98+INTENSITY+INT_CAPITA+INT_GDP+INT_CONS/all?startTime=1990&endTime=2015&dimensionAtObservation=allDimensions"

  d3.queue()
    .defer(d3.request, minimumWages)
    .defer(d3.request, waste)
    .awaitAll(doFunction);
};

// functienaam veranderen
function doFunction(error, response) {
  if (error) throw error;
  dictMinWage = []
  minWage = JSON.parse(response[0].responseText)
  for (var country = 0; country < 25; country++){
      observation = country + ":" + 4 + ":0:0"
      dictMinWage.push({
        "Country" : minWage.structure.dimensions.observation[0].values[country]["name"],
        "Wage" : minWage.dataSets[0].observations[observation][0]
      })
  }

  dictTotWaste = []
  totWaste = JSON.parse(response[1].responseText)
  for (var country = 0; country < 31; country++){
      observation = country + ":17:" + 2
      if (totWaste.dataSets[0].observations[observation] != undefined){
        dictTotWaste.push({
          "Country": totWaste.structure.dimensions.observation[0].values[country]["name"],
          "Waste": totWaste.dataSets[0].observations[observation][0]
        })
    }
  }

  dictMinWage.forEach(function(d){
    var CountryK = d.Country;
    dictTotWaste.forEach(function(e) {
      if (e.Country === CountryK){
        d["Waste"] = e.Waste
      }
    })
  })

  dictMinWageTotWaste = []
  for(var dict = 0; dict < dictMinWage.length; dict++){
    if(dictMinWage[dict]["Waste"] != undefined){
      dictMinWageTotWaste.push({
        "country" : dictMinWage[dict]["Country"],
        "Wage" : dictMinWage[dict]["Wage"],
        "Waste" : dictMinWage[dict]["Waste"]
      })
    }
  }

  console.log(dictMinWageTotWaste)

  var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([80, width]);

  var y = d3.scale.linear()
      .range([height, 10]);

  var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

  var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

  var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

  x.domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Waste; })).nice();
  y.domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Wage; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("font-size","12px")
      .attr("x", width)
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("Amount of waste generated per year (tons)");

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(60, 0)")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("font-size","12px")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Minumum wages (Annual, US dollar)")

  svg.selectAll(".dot")
      .data(dictMinWageTotWaste)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.Waste); })
      .attr("cy", function(d) { return y(d.Wage); })
      .style("fill", function(d) { return "blue"; });



};
