<script>
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import {map} from './store.js';

  let posCircle;
  let posAccuracy;
  
  function createMap(container) {
    let m = L.map(container, {
        maxZoom: 24,       // kun je lekker doorzoomen ook als er geen omgevingskaart meer over is
        maxNativeZoom: 18,
        tileSize: 512,
        zoomOffset: -1 
    }).setView([51.798958, 5.842759], 16);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abc'
      }
    ).addTo(m);

    return m;
  }

  function mapAction(container) {
    $map = createMap(container);
    $map.once('locationfound', onFirstFound);
    $map.on('locationerror', onLocError);
    $map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
    return {
      destroy: () => {
        $map.remove();
      },
    };
  }
  
  function onFirstFound(e) {
    posCircle = L.circle(e.latlng, {
      radius: 2,
      fillColor: '#3388ff',
      fillOpacity: 1
    }).addTo($map);
    posAccuracy = L.circle(e.latlng, {
      radius: e.accuracy
    }).addTo($map);  
    $map.on('locationfound', onLocFound);
    $map.off('locationerror', onLocError);
    $map.locate({setView: false, enableHighAccuracy: true, watch: true});
  }
  
  function onLocFound(e) {
    posCircle.setLatLng(e.latlng);
    posAccuracy.setLatLng(e.latlng);
    posAccuracy.setRadius(e.accuracy);
  }
  
  function onLocError(e) {
      alert(e.message);
  }
</script>

<div style="height:80vh;width:vw" use:mapAction />
