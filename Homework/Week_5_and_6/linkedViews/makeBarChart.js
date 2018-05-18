/*
* Mark van den Hoven 10533133
* Contains functions that makes barchart for given country
**/

/*
* function which makes complete barchart
**/
function makeBarchart(error, response, datamap){
  datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

    // remove old barchart if there is one
    d3.select("#barChart").remove();

    dict = createWellBeingData(error, response)

    // check if country info is available
    if(dict[geography["id"]] != undefined){

      // create svg element
      var svg = createSVG()

      // read into json file
      d3.json("linkedViews/countryinfo.json", function(error, data) {

        // make info array for given country
        var countryList = makeCountryInfo(data, geography);

        // this scale is used for both x-axis and bars
        var xscale = d3.scale.ordinal().rangeRoundBands([50, 250], .03)
          .domain(countryList.map(function(d) { return d["Indicator"]; }));

        // make corrresponding axes
        createAxis(svg, countryList, xscale)

        // make corrresponding bars
        createBars(svg, countryList, xscale)

        // make corrresponding title
        createTitle(svg, geography)

      });
    }
  });
}

/*
* function which makes barchart axis
**/
function createAxis(svg, countryList, xscale){

  // create scale for y-axis
  var yscale = d3.scale.linear()
    .domain([d3.max(countryList, function(d) {return d["Value"]}), 0])
    .range([0, 340]);

  // create x-axis
  var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom");

  // call x-axis and attributes
  svg.append("g")
    .attr("width", 260)
    .attr("height", 200)
    .attr("class", "axis")
    .attr("transform", "translate(0," + 375 + ")")
    .call(d3.svg.axis()
    .scale(xscale)
    .orient("bottom"))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  // create y-axis
  var yAxis = d3.svg.axis()
    .scale(yscale)
    .orient("left")
    .ticks(5);

  // call y-axis and attributes
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 40 + ",30)")
    .call(yAxis)

   // create y-axis title
   svg.append("g")
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 50)
     .attr("x", -30)
     .attr("dy", ".35em")
     .attr("size", "")
     .style("text-anchor", "end")
     .text("Unit (hover over bar)");
}

/*
* function which makes barchart bars
**/
function createBars(svg, countryList, xscale){
  
  // create tooltip for hoovering
  // http://bl.ocks.org/Caged/6476579
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 50])
    .html( function(d) {
      return "<strong>Inequality:</strong> <span style='color:red'>" + d["Inequality"] + "</span>" + "<strong> Unit:</strong> <span style='color:red'>" + d["Unit"] + "</span>" + "<strong> Waarde:</strong> <span style='color:red'>" + d["Value"] + "</span>";
    })

  // call tooltip
  svg.call(tip);

  // create scale for bars
  var scale = d3.scale.linear()
    .domain([0, d3.max(countryList, function(d) {return d["Value"]; })])
    .range([0, 340]);

  // create bar for each data-element
  svg.selectAll(".bar")
    .data(countryList)
    .enter()
    .append("rect")
    .attr("fill", "green")
    .attr("class", "bar")
    .attr("x", function(d) { return xscale(d["Indicator"]); })
    .attr("y", function (d) {
      return 370  - scale(d["Value"]);
    })
    .attr("width", function(d) {
        return 35;
    })
    .attr("height", function(d){
      return scale(d["Value"]);
    })
    .attr("stroke", "orange")
    .attr("stroke-width", function(d) {
       return d/2;
     })

     // show tooltip when mouseover
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
}

/*
* function which returns array of country info
**/
function makeCountryInfo(data, geography){
  countryList = []

  // iterate over data
  for(var info = 0; info < data.data.length; info++){
    country = geography["properties"]["name"]
    prop1 = "Employment rate"
    prop2 = "Educational attainment"
    prop3 = "Years in education"
    prop4 = "Dwellings without basic facilities"
    prop5 = "Air pollution"

    // if data matches specific info push corresponding dict into array
    if(data.data[info]["Country"] == country
      &&(data.data[info]["Indicator"] == prop1
      ||data.data[info]["Indicator"] == prop2
      ||data.data[info]["Indicator"] == prop3
      ||data.data[info]["Indicator"] == prop4
      ||data.data[info]["Indicator"] == prop5)){
      countryList.push(data.data[info])
    }
  }
  return countryList
}

/*
* function which makes barchart title
**/
function createTitle(svg, geography){
  svg.append("g")
    .attr("transform", "translate(" + (350/2) + ", 15)")
    .append("text")
    .text("Barchart information of " + geography["properties"]["name"])
    .style({"text-anchor":"middle", "font-family":"Arial", "font-weight":"800"});
}

/*
* function which returns svg element
**/
function createSVG(){
  var svg = d3.select('#bar')
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)
    .attr("id", "barChart")

  return svg;
}
