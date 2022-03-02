import * as gen from './js/general.js';
import * as m from './js/map.js';
import * as log from './js/logger.js';

//initialize map
m.init();

//first locate
m.map.once('locationfound', m.onFirstFound);
m.map.on('locationerror', m.onLocError);
m.map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});

//set button event listeners
log.setLogPointButtons();
log.setTrackButton();
log.setResetButton();
