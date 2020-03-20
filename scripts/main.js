let addItemButton = document.querySelector('#addItemButton');
let list = document.querySelector('#list');

addItemButton.onclick = function() {
  addItemButton.type = 'text';
  addItemButton.value = '';
  addItemButton.focus();
}

// Stop the form from submitting when a button is pressed
addItemButton.addEventListener('submit', function(e) {
  e.preventDefault();
});

addItemButton.addEventListener('click', function() {
  localStorage.setItem('name', addItemButton.value);
})
