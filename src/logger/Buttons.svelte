<script>
  import {map} from '../store.js';
  import Track from './Track.svelte';
  
  let gjson;
  let buttons = ['oost', 'O-hoek', 'N-hoek', 'noord', 'ingang', 'other button'];
  
  function logPoint(e) {
    if (e.target.name === 'other button') {
      var name = prompt('Naam meetpunt:');
    } else {
      var name = e.target.name.trim();
    }
    gjson = createGjson();
    $map.once('locationfound', onLocFound);
    gjson.properties.name = name;
    //logId was set in '../App.svelte'
    var id = localStorage.getItem('logId');
    gjson.properties.id = id;
    $map.stopLocate();
    $map.locate({setView: true, maxZoom: 16, enableHighAccuracy: false});
  }
  
  //creates geojson for the data we'd like to collect
  //we try to get all data from the locationevent
  //see: https://leafletjs.com/reference.html#locationevent
  function createGjson() {
    var geojson = {
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
    }
    return geojson;
  }
  
  function onLocFound(e) {
    logLocEvent(e);
    markPos(e.latlng);
    
    //download the geojson
    var id = gjson.properties.id;
    var exportName = id + '_' + gjson.properties.name;
    if (confirm('Would you like to save ' + exportName + '?')) {
      gen.downloadObjectAsJson(e.target.curGJson, exportName);
      //prepare for next log
      if (gjson.properties.name != '' || null) {
        id++;
        localStorage.setItem('logId', id);  
      }
    }
    gjson = createGjson();
    $map.locate({setView: false, enableHighAccuracy: true, watch: true});
  }
  
  function logLocEvent(e) {
    for (var p of Object.keys(gjson.properties)){
      for (var q of Object.keys(e)){
        if (p === q) {gjson.properties[p] = e[q]}
      }
    }
    gjson.geometry.coordinates = toLnglat(e.latlng);
  }  
  
  function markPos(pos) {
    var circle = L.circle(pos, {
      color: 'black',
      fillColor: 'red',
      fillOpacity: 1,
      radius: 1.5,
      weight: 1
    }).addTo($map);
  }
  
  function toLnglat(latlng) {
    return Object.values(latlng).reverse();
  }  
  
  function reset() {
    var logId = prompt('Reset current logId of ' + localStorage.getItem('logId') + ' to:');
    if(logId) localStorage.setItem('logId', logId);
  }
</script>

<div>
  {#each buttons as but}
    <button on:click={logPoint} name={but}> {but} </button> 
  {/each}
  <Track/>
  <button on:click={reset}> reset logId </button>
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
  }

  button {
    margin: 5px;
    height: 6vh;
    width: 11vh;
    text-align: center;
  }
</style>
