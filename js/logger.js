import * as gen from './general.js';
import * as m from './map.js';

function setLogPointButtons() {
  var logger = document.getElementById('logger-container');
  
  //set event listeners for buttons that log a single point
  var pButtons = logger.getElementsByClassName('log-point-button');
  for (var but of pButtons) {
    but.onclick = (e) => {
      if (e.target.id === 'other-button') {
        var name = prompt('Naam meetpunt:');
      } else {
        var name = e.target.value.trim();
      }
      m.map.curGJson = getEmptyGJson();
      m.map.once('locationfound', onLocFound);
      m.map.curGJson.features[0].properties.name = name;
      m.map.curGJson.features[1].properties.name = "HA " + name;
      //logId was set using devtools
      var id = localStorage.getItem('logId');
      m.map.curGJson.features[0].properties.id = id;
      m.map.curGJson.features[1].properties.id = id;
      m.map.locate({setView: true, maxZoom: 16, enableHighAccuracy: false});
    }
  }  
}

function setTrackButton() {
  var trackButton = document.getElementById('track-button');
  trackButton.onclick = startTrack;
}

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
  gjson.geometry.coordinates = m.toLnglat(e.latlng);
}

//log the found location and locate again with high accuracy enabled
function onLocFound(e) {
  m.onLocationFound(e);
  var gjson = e.target.curGJson.features[0];
  logLocEvent(e, gjson)

  //e.target == m.map
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
  m.onLocationFound(e);
  var gjson = e.target.curGJson.features[0];
  var gjsonHA = e.target.curGJson.features[1];
  logLocEvent(e, gjsonHA);

  //download the geojson
  var id = gjson.properties.id;
  var exportName = id + '_' + gjson.properties.name;
  gen.downloadObjectAsJson(e.target.curGJson, exportName);
  
  //prepare for next log
  if (gjson.properties.name != '' || null) {
    id++;
    localStorage.setItem('logId', id);  
  }
  delete e.target.curGJson;
}

function startTrack(e) {
  if (m.map.hasLayer(m.map.track)) m.map.removeLayer(m.map.track);
  m.map.track = L.polyline([], {color: 'red'}).addTo(m.map);
  m.map.on('locationfound', trackEpoch);
  m.map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true, watch: true});
  e.target.innerHTML = 'stop tracking';
  e.target.onclick = stopTrack;
}

function stopTrack(e) {
  m.map.off('locationfound', trackEpoch);
  m.map.stopLocate();
  e.target.innerHTML = 'start tracking';
  e.target.onclick = startTrack;
}

function trackEpoch(e) {
  e.target.track.addLatLng(e.latlng);
  console.log(e.target.track);
  // var polyline = L.polyline(e.target.track, {color: 'red'}).addTo(e.target);
  // console.log(polyline);
}

export {
  setLogPointButtons,
  setTrackButton,
  getEmptyGJson,
  onLocFound
}
