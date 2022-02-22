import * as gen from './js/general.js';
import * as m from './js/map.js';
import * as log from './js/logger.js';

//initialize mymap and locate
////////////////////////////////////////////////////////////////////////////////
var achtergrondkaart = L.tileLayer(  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
  // geen kaart als achtergrond voor de duidelijkheid
  id:'mapid',
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
 subdomains: ['a','b','c']
});

var mymap = L.map('mapid', {
  maxZoom: 24,       // kun je lekker doorzoomen ook als er geen omgevingskaart meer over is
  maxNativeZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
  zoomSnap: 0.25,
  layers: [achtergrondkaart]
}).setView([51.798958, 5.842759],13);

mymap.once('locationfound', (e) => {
  gen.onLocationFound(e);
  main();
});
mymap.on('locationerror', gen.onLocationError);
mymap.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});

//After initial locate run main
////////////////////////////////////////////////////////////////////////////////
function main() {
  var logger = document.getElementById('logger-container');
  mymap.curGJson = log.getEmptyGJson();
  
  //set event listeners for buttons that log single point
  var pButtons = logger.getElementsByClassName('log-point-button');
  for (var but of pButtons) {
    but.onclick = (e) => {
      mymap.once('locationfound', log.onLocFound);
      mymap.curGJson.features[0].properties.name = e.target.innerHTML.trim();
      mymap.curGJson.features[1].properties.name = "HA " + e.target.innerHTML.trim();
      mymap.locate({setView: true, maxZoom: 16, enableHighAccuracy: false});
    }
  }  
}
