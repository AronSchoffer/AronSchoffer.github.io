import * as gen from './general.js';

//creates geojson for the data we'd like to collect
//we try to get all data from the locationevent
//see: https://leafletjs.com/reference.html#locationevent
function getEmptyGJson() {
  var geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: -1,
          name: "non given",
          accuracy: -1,
          altitude: -1,
          altitudeAccuracy: -1,
          heading: -1,
          speed: -1,
          timestamp: -1
        },
        geometry: {
          type: "Point",
          coordinates: [0,0]
        }
      },{
        type: "Feature",
        properties: {
          id: -1,
          name: "HA non given",
          accuracy: -1,
          altitude: -1,
          altitudeAccuracy: -1,
          heading: -1,
          speed: -1,
          timestamp: -1
        },
        geometry: {
          type: "Point",
          coordinates: [0,0]
        }
      }
    ]

  }
  return geojson;
}

//copy data from locationevent to gjson feature
function logLocEvent(e, gjson) {
  for (var p of Object.keys(gjson.properties)){
    for (var q of Object.keys(e)){
      if (p === q) {gjson.properties[p] = e[q]}
    }
  }
  gjson.geometry.coordinates = gen.toLnglat(e.latlng);
}

//log the found location and locate again with high accuracy enabled
function onLocFound(e) {
  gen.onLocationFound(e);
  var gjson = e.target.curGJson.features[0];
  logLocEvent(e, gjson)

  //e.target == mymap
  var circle = L.circle(e.latlng, {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 1,
    radius: 2
  }).addTo(e.target);
  
  e.target.once('locationfound', onLocFoundHA);
  e.target.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
}

function onLocFoundHA(e) {
  gen.onLocationFound(e);
  var gjson = e.target.curGJson.features[0];
  var gjsonHA = e.target.curGJson.features[1];
  logLocEvent(e, gjsonHA);

  //download the geojson
  var id = gjson.properties.id;
  var exportName = id + '_' + gjson.properties.name;
  gen.downloadObjectAsJson(e.target.curGJson, exportName);
  
  //prepare for next log
  if (gjson.properties.name == '' || null) {
    id++;
    localStorage.setItem('logId', id);  
  }
  delete e.target.curGJson;
}

export {
  getEmptyGJson,
  onLocFound
}
