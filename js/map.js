import * as gen from './general.js';

var map;

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
  }).setView([51.798958, 5.842759],13);
}

function onLocationFound(e) {
  var radius = e.accuracy;
  L.marker(e.latlng).addTo(e.target)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(e.target);
}

function onLocationError(e) {
    alert(e.message);
}

function toLnglat(latlng) {
  return Object.values(latlng).reverse();
}

export {
  onLocationFound,
  onLocationError,
  toLnglat,
  init,
  map
}
