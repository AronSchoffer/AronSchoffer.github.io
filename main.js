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

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
    alert(e.message);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);
mymap.locate({setView: true, maxZoom: 16});
