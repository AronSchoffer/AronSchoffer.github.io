import * as gen from './js/general.js';
import * as m from './js/map.js';
import * as log from './js/logger.js';

//initialize map
m.init();

//first locate
m.map.on('locationfound', m.onLocFound);
m.map.once('locationerror', m.onLocError);
m.el.addEventListener('locDone', m.onLocDone);
m.map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});

//set button event listeners
log.setLogPointButtons();
log.setTrackButton();
