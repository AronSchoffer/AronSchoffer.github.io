import * as gen from './general.js';

var map;
var posCircle;
var posAccuracy;

function init() {
  var achtergrondkaart = L.tileLayer(  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    // geen kaart als achtergrond voor de duidelijkheid
    id:'mapid',
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
   subdomains: ['a','b','c']
  });
  
  map = L.map('mapid', {
    maxZoom: 24,       // kun je lekker doorzoomen ook als er geen omgevingskaart meer over is
    maxNativeZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    zoomSnap: 0.25,
    layers: [achtergrondkaart]
  });
}

function onFirstFound(e) {
  posCircle = L.circle(e.latlng, {
    radius: 2,
    fillColor: '#3388ff',
    fillOpacity: 1
  }).addTo(map);
  posAccuracy = L.circle(e.latlng, {
    radius: e.accuracy
  }).addTo(map);  
  map.on('locationfound', onLocFound);
  map.off('locationerror', onLocError);
  map.locate({setView: false, enableHighAccuracy: true, watch: true});
}

function onLocFound(e) {
  posCircle.setLatLng(e.latlng);
  posAccuracy.setLatLng(e.latlng);
  posAccuracy.setRadius(e.accuracy);
}

function onLocError(e) {
    alert(e.message);
}

function toLnglat(latlng) {
  return Object.values(latlng).reverse();
}

export {
  onFirstFound,
  onLocFound,
  onLocError,
  toLnglat,
  init,
  map
}
