/*
* Mark van den Hoven 10533133
* contains functions which creates datamap and legend
**/


/*
* function which creates a clickable datamap with filled colors
**/
function makeDatamap(error, response){

  // make datamap with fill elements
  var map = new Datamap({
    element: document.getElementById('container'),
    fills: {
      HIGH: 'rgb(67,162,202)',
      LOW: 'rgb(224,243,219)',
      MEDIUM: 'rgb(168,221,181)',
      UNKNOWN: 'lightgrey',
      defaultFill: 'lightgrey'
    },
    data: null,

  // make datamap clickable
  done: function(datamap) {

    // create barchart for country
    makeBarchart(error, response, datamap)
  },

  // create hovering for datamap
  geographyConfig: {

    // show wellbeing and life expectancy value when hovering
    popupTemplate: function(geo, data) {
        if(data.wellbeing != undefined && data.Expectancy != undefined){
          return ['<div class="hoverinfo"><strong>',
            'Well-being (0-10) ' + geo.properties.name,': ' + data.wellbeing, ' ' +
            'Life Expectancy',': ' + data.Expectancy,'</strong></div>'].join('');
        }
      }
    }
  });

  // call all dictionaries for filling
  var dict = createWellBeingData(error, response)
  var dict2 = createLifeExpectancyData(error, response)
  var dict3 = {}

  // put all dictionaries in choropleth so it knows all information
  map.updateChoropleth(dict, {reset: true})
  map.updateChoropleth(dict2,  {reset: true})
  map.updateChoropleth(dict3,  {reset: true})

  return map
}

/*
* function which creates a legend of datamap
**/
function makeLegend(error, response, map){

  // create legend title
  var legend_params = {
      legendTitle: "Well-being and life expectancy",
  };

  // call legend
  map.legend(legend_params)
}
