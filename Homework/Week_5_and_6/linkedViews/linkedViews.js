/*
* Mark van den Hoven 10533133
* Main page where complete visualisation is made
**/

// put json files in queue
d3.queue()
  .defer(d3.json, "linkedViews/countryinfo.json")
  .defer(d3.json, "linkedViews/wellbeing.json")
  .awaitAll(Visualize);

/*
* function that makes complete visualisation
**/
function Visualize(error, response){
  if (error) throw error;

    // combine two data files
    combineJSON(error, response)

    // make wellbeing button clickable
    $('#buttonExpectancy').on('click', function(event) {

      // update datamap accordingly
      map.updateChoropleth(createLifeExpectancyData(error, response), {reset: true})
    });

    // make wellbeing button clickable
    $('#buttonWellBeing').on('click', function(event) {

      // update datamap accordingly
      map.updateChoropleth(createWellBeingData(error, response), {reset: true})
    });

    // create datamap
    var map = makeDatamap(error, response)

    // create legend
    makeLegend(error, response, map)
}
