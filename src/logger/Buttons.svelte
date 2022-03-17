<div>
  {#each buttons as but}
    <button on:click={logPoint} name={but}> {but} </button> 
  {/each}
  <button on:click={logPoint} use:longpress={logPoint} on:longpress={resetF} name='framboos' > framboos {f} </button>
  <Track/>
  <button on:click={reset}> reset logId </button>
</div>

<script>
  import {map} from '../store.js';
  import Track from './Track.svelte';
  import {downloadObjectAsJson} from '../general.js'
  
  let gjson;
  let buttons = ['oost', 'O-hoek', 'N-hoek', 'noord', 'ingang', 'other button'];
  let f = 1;
  let fHasClick = true;
  
  function logPoint(e) {
    if (e.target.name === 'other button') {
      var name = prompt('Naam meetpunt:');
    } else if (e.target.name === 'framboos'){
      var name = 'framboos ' + f;
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
      if (gjson.properties.name.includes('framboos')) f = f % 5 + 1;
      downloadObjectAsJson(gjson, exportName);
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
  
  //https://stackoverflow.com/questions/56844807/svelte-long-press
  function longpress(node, clickFn, threshold = 1000) {
  // note — a complete answer would also consider touch events

    const handle_mousedown = () => {
      let start = Date.now();

      const timeout = setTimeout(() => {
        node.removeEventListener('click', clickFn);
        fHasClick = false;
        console.log('click removed');
        node.dispatchEvent(new CustomEvent('longpress'));
        // console.log(getEventListeners(node));
      }, threshold);

      const cancel = () => {
        clearTimeout(timeout);
        if (!fHasClick) {
          setTimeout(function () {
            console.log('add click');
            node.addEventListener('click', clickFn);  
          }, 200);
        }
        node.removeEventListener('mouseup', cancel);
      };

      node.addEventListener('mouseup', cancel);
    }

    node.addEventListener('mousedown', handle_mousedown);

    return {
      destroy() {
        node.removeEventListener('mousedown', handle_mousedown);
      }
    };
  }

function resetF() {
  f = 1;
}
</script>

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
