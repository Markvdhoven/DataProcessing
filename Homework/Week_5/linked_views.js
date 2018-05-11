// put JSON files in queue
d3.queue()
  .defer(d3.json, "countryinfo.json")
  .defer(d3.json, "wellbeing.json")
  .awaitAll(combineData);

function combineData(error, response){
  if (error) throw error;

  // add locations in countryinfo.json to wellbeing.json
  for(var country = 0; country < response[1]["data"].length; country ++){
    countryname = response[1]["data"][country]["Country"]
    for(var country2 = 0; country2 < response[0]["data"].length; country2 ++){
      if(response[0]["data"][country2]["Country"] == countryname){
        response[1]["data"][country]["LOCATION"] = response[0]["data"][country2]["LOCATION"]
      }
    }
  }

  // create dict for data structure
  var dict = {}

  // iterate over all elements in edited wellbeing file
  for(var i = 0; i < response[1]["data"].length; i++){
    if(response[1]["data"][i]["LOCATION"] != undefined){

      // make subdivisions for the level of wellbeing in each country
      if(parseFloat(response[1]["data"][i]["Well-being (0-10)"]) < 6){
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'LOW',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }
      else if (parseFloat(response[1]["data"][i]["Well-being (0-10)"]) >= 6
          && parseFloat(response[1]["data"][i]["Well-being (0-10)"]) < 7 ){
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'MEDIUM',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }
      else if (parseFloat(response[1]["data"][i]["Well-being (0-10)"]) >= 7){
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'HIGH',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }
    }
  }

  // make datamap
  var map = new Datamap({
          element: document.getElementById('container'),
          fills: {
              HIGH: 'rgb(67,162,202)',
              LOW: 'rgb(224,243,219)',
              MEDIUM: 'rgb(168,221,181)',
              UNKNOWN: 'black',
              defaultFill: 'lightgrey'
          },

          data: dict,

  done: function(datamap) {

        // make datamap clickable
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

          // remove old barchart if there is one
          d3.select("#barChart").remove();

          // create svg element to draw bar chart in
          var svg = d3.select("body")
              .append("svg")
              .attr("width",1000)
              .attr("height", 1000)
              .attr("id", "barChart")

          // read into JSON file
          d3.json("countryinfo.json", function(error, data) {
            // check if no error
            if (error) throw error;
            countryList = []

            // make array of specific info per country
            for(var info = 0; info < data.data.length; info++){
              country = geography["properties"]["name"]
              prop1 = "Employment rate"
              prop2 = "Educational attainment"
              prop3 = "Years in education"
              prop4 = "Dwellings without basic facilities"
              prop5 = "Air pollution"
              if(data.data[info]["Country"] == country
                &&(data.data[info]["Indicator"] == prop1
                ||data.data[info]["Indicator"] == prop2
                ||data.data[info]["Indicator"] == prop3
                ||data.data[info]["Indicator"] == prop4
                ||data.data[info]["Indicator"] == prop5)){
                countryList.push(data.data[info])
              }
            }

            // create tooltip for hoovering
            // http://bl.ocks.org/Caged/6476579
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([10, 50])
                .html( function(d) {
                  return "<strong>Indactor:</strong> <span style='color:red'>" + d["Indicator"] + "<strong>Waarde:</strong> <span style='color:red'>" + d["Value"];
                })

            // call tooltip
            svg.call(tip);

            // create scale for bars
            var scale = d3.scale.linear()
                .domain([0, d3.max(countryList, function(d) {return d["Value"]; })])
                .range([0, 180]);

            // create scale for the info
            var xscale = d3.scale.ordinal().rangeRoundBands([50, 1000], .03)
                .domain(countryList.map(function(d) { return d["Indicator"]; }));


            // create scale for y-axis
            var yscale = d3.scale.linear()
                .domain([d3.max(countryList, function(d) {return d["Value"]}), 0])
                .range([0, 180]);

            // create x-axis
            var xAxis = d3.svg.axis()
                .scale(xscale)
                .orient("bottom");

            // call x-axis and attributes
            svg.append("g")
                .attr("width", 1000)
                .attr("height", 200)
                .attr("class", "axis")
                .attr("transform", "translate(20," + 183 + ")")
                .call(d3.svg.axis()
                .scale(xscale)
                .orient("bottom"))

            // create y-axis
            var yAxis = d3.svg.axis()
                .scale(yscale)
                .orient("left")
                .ticks(5);

            // call y-axis and attributes
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + 40 + ",0)")
                .call(yAxis)

            // create bar for each data-element
            svg.selectAll(".bar")
                .data(countryList)
                .enter()
                .append("rect")
                .attr("fill", "green")
                .attr("class", "bar")
                .attr("x", function(d) { return xscale(d["Indicator"]) + 100; })
                .attr("y", function (d) {
                  return 180  - scale(d["Value"]);
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
          });

        });
  },

    // create hovering for datamap
    geographyConfig: {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo"><strong>',
                    'Well-being (0-10) ' + geo.properties.name,
                    ': ' + data.wellbeing,
                    '</strong></div>'].join('');
        }
      }
    });
}
