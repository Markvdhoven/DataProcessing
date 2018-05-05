function update2014(error, response) {

  // getting API data from stats.eocd.org
  var minimumWages = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+COL+CRI+LTU+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"
  var waste = "https://stats.oecd.org/SDMX-JSON/data/WSECTOR/AUS+AUT+BEL+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+COL+LTU.TOTAL_S+RES+TOTAL+01-03+01+05-09+10-33+10-12+13-15+16+17-18+19+20-22+23+24-33+24+24-25+25-28+26-30+29-33+31-33+35+36-39+41-43+45-98+INTENSITY+INT_CAPITA+INT_GDP+INT_CONS/all?startTime=1990&endTime=2015&dimensionAtObservation=allDimensions"

  // put links in a queue and make scatter of both data
  d3.queue()
    .defer(d3.request, minimumWages)
    .defer(d3.request, waste)
    .awaitAll(makeScatter2014);
};

function update2016(error, response) {

  // getting API data from stats.eocd.org
  var minimumWages = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+CZE+EST+FRA+DEU+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+TUR+GBR+USA+COL+CRI+LTU+BRA+RUS.EXR+PPP.H+A/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"
  var waste = "https://stats.oecd.org/SDMX-JSON/data/WSECTOR/AUS+AUT+BEL+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+COL+LTU.TOTAL_S+RES+TOTAL+01-03+01+05-09+10-33+10-12+13-15+16+17-18+19+20-22+23+24-33+24+24-25+25-28+26-30+29-33+31-33+35+36-39+41-43+45-98+INTENSITY+INT_CAPITA+INT_GDP+INT_CONS/all?startTime=1990&endTime=2015&dimensionAtObservation=allDimensions"

  // put links in a queue and make scatter of both data
  d3.queue()
    .defer(d3.request, minimumWages)
    .defer(d3.request, waste)
    .awaitAll(makeScatter2016);
}

// function that makes scatterplot of data
function makeScatter2014(error, response) {
  if (error) throw error;

  // remove old scatterplot if there is one
  d3.selectAll("svg").remove();

  dictMinWage = []

  // make JSON structure of API links
  minWage = JSON.parse(response[0].responseText)

  // make dictionairy of minimum wages
  for (var country = 0; country < 25; country++){
    observation = country + ":" + 4 + ":0:0"
    dictMinWage.push({
      "Country" : minWage.structure.dimensions.observation[0].values[country]["name"],
      "Wage" : minWage.dataSets[0].observations[observation][0]
    })
  }

  dictTotWaste = []

  // make JSON structure of API links
  totWaste = JSON.parse(response[1].responseText)

  // make dictionairy of total amount of waste generated
  for (var country = 0; country < 31; country++){
    observation = country + ":17:" + 2
    if (totWaste.dataSets[0].observations[observation] != undefined){
      dictTotWaste.push({
        "Country": totWaste.structure.dimensions.observation[0].values[country]["name"],
        "Waste": totWaste.dataSets[0].observations[observation][0]
      })
    }
  }

  // combine dictionairies in a new dictionairy
  dictMinWage.forEach(function(d){
    var CountryK = d.Country;
    dictTotWaste.forEach(function(e) {
      if (e.Country === CountryK){
        d["Waste"] = e.Waste
      }
    })
  })

  dictMinWageTotWaste = []

  // only keep dictionary elements which are complete
  for(var dict = 0; dict < dictMinWage.length; dict++){
    if(dictMinWage[dict]["Waste"] != undefined){
      dictMinWageTotWaste.push({
        "country" : dictMinWage[dict]["Country"],
        "Wage" : dictMinWage[dict]["Wage"],
        "Waste" : dictMinWage[dict]["Waste"]
      })
    }
  }

  // create margin for scatterplot
  var margin = {top: 20, right: 30, bottom: 30, left: 30},
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // create different colours for each country
  var cValue = function(d) { return d.country;},
      color = d3.scale.category10();

  // create scale for x-axis
  var x = d3.scale.linear()
      .range([80, width - 200])

      // create domain by taking maximum off data
      .domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Waste; })).nice();

  // create scale for y-axis
  var y = d3.scale.linear()
      .range([height, 10])

      // create domain by taking maximum of all data
      .domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Wage; })).nice();

  // create x-axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // create y-axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // create a svg element to draw scatter plot in
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")

  // create scatterplot title
  svg.append("text")
      .attr("class", "label")
      .attr("font-size","18px")
      .attr("x", width - 200)
      .attr("y", 20)
      .style("text-anchor", "end")
      .text("Waste generated vs minimal wage 2014");

  // create x-axis with lable
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("font-size","12px")
      .attr("x", width - 200)
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("Amount of waste generated per year (tons)");

  // create y-axis with lable
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

  // create dots in scatterplot
  svg.selectAll(".dot")
      .data(dictMinWageTotWaste)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.Waste); })
      .attr("cy", function(d) { return y(d.Wage); })
      .style("fill", function(d) { return color(cValue(d));})

  // create legend
  var legend = svg.selectAll(".legend")
      .data(dictMinWageTotWaste, function(d) {return d.country; })
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // make a rectangle for each country with according colour
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) {return color(d.country)});

  // append to each rectangle the country name
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.country; })
};

// function that makes scatterplot of data
function makeScatter2016(error, response){
  if (error) throw error;

  // remove old scatterplot if there is one
  d3.selectAll("svg").remove();

  dictMinWage = []

  // make JSON structure of API links
  minWage = JSON.parse(response[0].responseText)

  // make dictionairy of minimum wages
  for (var country = 0; country < 25; country++){
    observation = country + ":" + 6 + ":0:0"
    dictMinWage.push({
      "Country" : minWage.structure.dimensions.observation[0].values[country]["name"],
      "Wage" : minWage.dataSets[0].observations[observation][0]
    })
  }

  dictTotWaste = []

  // make dictionairy of total amount of waste generated
  totWaste = JSON.parse(response[1].responseText)
  for (var country = 0; country < 31; country++){
    observation = country + ":17:" + 3
    if (totWaste.dataSets[0].observations[observation] != undefined){
      dictTotWaste.push({
        "Country": totWaste.structure.dimensions.observation[0].values[country]["name"],
        "Waste": totWaste.dataSets[0].observations[observation][0]
      })
    }
  }

  // combine dictionairies in a new dictionairy
  dictMinWage.forEach(function(d){
    var CountryK = d.Country;
    dictTotWaste.forEach(function(e) {
      if (e.Country === CountryK){
        d["Waste"] = e.Waste
      }
    })
  })

  dictMinWageTotWaste = []

  // only keep dictionary elements which are complete
  for(var dict = 0; dict < dictMinWage.length; dict++){
    if(dictMinWage[dict]["Waste"] != undefined){
      dictMinWageTotWaste.push({
        "country" : dictMinWage[dict]["Country"],
        "Wage" : dictMinWage[dict]["Wage"],
        "Waste" : dictMinWage[dict]["Waste"]
      })
    }
  }

  // create margin for scatterplot
  var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // create different colours for each country
  var cValue = function(d) { return d.country;},
    color = d3.scale.category10();

  // create scale for x-axis
  var x = d3.scale.linear()
    .range([80, width - 200])

    // create domain by taking maximum off data
    .domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Waste; })).nice();

  // create scale for y-axis
  var y = d3.scale.linear()
    .range([height, 10])

    // create domain by taking maximum off data
    .domain(d3.extent(dictMinWageTotWaste, function(d) { return d.Wage; })).nice();

  // create x-axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  // create y-axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // create a svg element to draw scatter plot in
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  // create scatterplot title
  svg.append("text")
    .attr("class", "label")
    .attr("font-size","18px")
    .attr("x", width - 200)
    .attr("y", 20)
    .style("text-anchor", "end")
    .text("Waste generated vs minimal wage 2016");

  // create x-axis with lable
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("font-size","12px")
    .attr("x", width - 200)
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("Amount of waste generated per year (tons)");

  // create y-axis with lable
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

  // for each country create circle with corresponding colour
  svg.selectAll(".dot")
    .data(dictMinWageTotWaste)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.Waste); })
    .attr("cy", function(d) { return y(d.Wage); })
    .style("fill", function(d) { return color(cValue(d));})

  // create legend
  var legend = svg.selectAll(".legend")
    .data(dictMinWageTotWaste, function(d) {return d.country; })
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // make a rectangle for each country with according colour
  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) {return color(d.country)});

  // append to each rectangle the country name
  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d.country; })
};
