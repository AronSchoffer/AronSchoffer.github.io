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

//from: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export{
  downloadObjectAsJson
};
