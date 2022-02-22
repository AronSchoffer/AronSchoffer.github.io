// //load html file into DOM element
// function loadHtml(filepath, element, className) {
//   var url = getUrl() + filepath;
//   fetch(url)
//     .then(r => {
//       if (!r.ok) {
//         throw new Error('Network response was not OK');
//       }
//       return r.text();
//     })
//     .then(html => {
//       element.innerHTML = html.trim();
//       for(var e of element.getElementsByTagName('*')){
//         e.classList.add(className);
//       }
//     })
//     .catch(error => {
//       console.error('There has been a problem with your fetch operation:', error);
//     });
// }
// 
// function includeCss(filepath, id){
//   var url = getUrl() + filepath;
//   if (!document.getElementById(id)){
//       var head  = document.getElementsByTagName('head')[0];
//       var link  = document.createElement('link');
//       link.id   = id;
//       link.rel  = 'stylesheet';
//       link.type = 'text/css';
//       link.href = url;
//       head.appendChild(link);
//     }
// }
// 
// function getUrl(){
//   return window.location.protocol + '//' + window.location.host;
// }

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

export{
  onLocationFound,
  onLocationError,
  toLnglat
};
