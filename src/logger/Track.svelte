<button on:click={startTrack}> start tracking </button>

<script>
  import {map} from '../store.js';
  
  let action = 'start tracking'

  function startTrack(e) {
    if ($map.hasLayer($map.track)) $map.removeLayer($map.track);
    $map.track = L.polyline([], {color: 'red'}).addTo($map);
    $map.on('locationfound', trackEpoch);
    e.target.innerHTML = 'stop tracking';
    e.target.onclick = stopTrack;
  }

  function stopTrack(e) {
    $map.off('locationfound', trackEpoch);
    e.target.innerHTML = 'start tracking';
    e.target.onclick = startTrack;
  }

  function trackEpoch(e) {
    $map.track.addLatLng(e.latlng);
    console.log(e.target.track);
    // var polyline = L.polyline(e.target.track, {color: 'red'}).addTo(e.target);
    // console.log(polyline);
  }
</script>

<style>
  button {
    margin: 5px;
    height: 6vh;
    width: 11vh;
    text-align: center;
  }
</style>
