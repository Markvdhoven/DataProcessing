/*
* Mark van den Hoven 10533133
* This file contains functions which helps structuring the data
**/

/*
* function that adds location code from countryinfo to wellbeing info
*/
function combineJSON(error, response){

  // iterate over wellbeing info
  for(var country = 0; country < response[1]["data"].length; country ++){

    // select the country name
    countryname = response[1]["data"][country]["Country"]

    // iterate over countryinfo
    for(var country2 = 0; country2 < response[0]["data"].length; country2 ++){

      // check if countries match
      if(response[0]["data"][country2]["Country"] == countryname){

        // add location code to wellbeing info
        response[1]["data"][country]["LOCATION"] = response[0]["data"][country2]["LOCATION"]
      }
    }
  }
}

/*
* function that returns a dictionary with all wellbeing fill-elements for the datamap
*/
function createWellBeingData(error, response){
  if (error) throw error;

  var dict = {}

  // iterate over all elements in wellbeing file
  for(var i = 0; i < response[1]["data"].length; i++){

    // check if location code is added
    if(response[1]["data"][i]["LOCATION"] != undefined){

      // check if the value of wellbeing is small
      if(parseFloat(response[1]["data"][i]["Well-being (0-10)"]) < 6){

        // add a dictionary with corresponding fill-element and wellbeing value
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'LOW',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }

      // check if the value of wellbeing is medium
      else if (parseFloat(response[1]["data"][i]["Well-being (0-10)"]) >= 6
        && parseFloat(response[1]["data"][i]["Well-being (0-10)"]) < 7 ){

          // add a dictionary with corresponding fill-element and wellbeing value
          dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'MEDIUM',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }

      // check if the value of wellbeing is high
      else if (parseFloat(response[1]["data"][i]["Well-being (0-10)"]) >= 7){

        // add a dictionary with corresponding fill-element and wellbeing value
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'HIGH',
          "wellbeing" : parseFloat(response[1]["data"][i]["Well-being (0-10)"])
        }
      }
    }
  }

  return dict
}

/*
* function that returns a dictionary with life expectancy fill-elements for the datamap
*/
function createLifeExpectancyData(error, response){

  // create dict for data structure
  var dict = {}

  // iterate over all elements in life expectancy file
  for(var i = 0; i < response[1]["data"].length; i++){

    // check if location code is added
    if(response[1]["data"][i]["LOCATION"] != undefined){

      // check if the value of life expectancy is small
      if(parseFloat(response[1]["data"][i]["Life Expectancy"]) < 77){

        // add a dictionary with corresponding fill-element and life expectancy value
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'LOW',
          "Expectancy" : parseFloat(response[1]["data"][i]["Life Expectancy"])
        }
      }

      // check if the value of life expectancy is medium
      else if (parseFloat(response[1]["data"][i]["Life Expectancy"]) >= 77
          && parseFloat(response[1]["data"][i]["Life Expectancy"]) < 81 ){

        // add a dictionary with corresponding fill-element and life expectancy value
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'MEDIUM',
          "Expectancy" : parseFloat(response[1]["data"][i]["Life Expectancy"])
        }
      }

      // check if the value of life expectancy is high
      else if (parseFloat(response[1]["data"][i]["Life Expectancy"]) >= 81){

        // add a dictionary with corresponding fill-element and life expectancy
        dict[response[1]["data"][i]["LOCATION"]] = {
          "fillKey" : 'HIGH',
          "Expectancy" : parseFloat(response[1]["data"][i]["Life Expectancy"])
        }
      }
    }
  }

  return dict
}
