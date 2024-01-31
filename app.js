import { Wikipedia } from './services/Wikipedia.js';
import { OSM } from './services/OSM.js';

const messagebox = document.getElementById('messagebox');

const Services = [OSM, Wikipedia]
//// MAP

// Initialize the map
const map = L.map('map').setView([47.565970123184314, -53.591094942325626], 15); // Set initial coordinates and zoom level

// Add a tile layer (you can replace this URL with a different tile provider)
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.attributionControl.setPosition('topright');

// Remove the default zoom control
map.zoomControl.remove();

// Create a new zoom control and set its position to middle-right
const customZoomControl = L.control.zoom({ position: 'topright' });
customZoomControl.addTo(map);

// Calculate the middle of the map's height
const middleHeight = map.getSize().y / 2;
const zoomControlContainer = document.querySelector('.leaflet-control-zoom.leaflet-bar.leaflet-control');
zoomControlContainer.style.top = `${middleHeight}px`;

tileLayer.customLayerName = 'Tile Layer'


importTags();


// Function to be executed on bbox change
function updateMarkers() {
  if (map.getZoom() > 10) {
    messagebox.style.display = 'none';

    const bbox = map.getBounds(); // Get the current bounding box
    const center = map.getCenter();
    const radius = Math.round(center.distanceTo([bbox._northEast.lat, bbox._northEast.lng]));

    //fetch
    for (const service of Services) {
      service.getLayers({ bbox: bbox, center: center, radius: radius })
        .then(layers => {
          for (const layer of layers) {
            removeLayerByName(layer.customLayerName); //remove old layer
            map.addLayer(layer);
          }
        })
    }

  } else {
    messagebox.style.display = 'block';
    messagebox.innerText = 'Zoom in to display new markers';
  }

}

/*map.on('zoomend', () => {
  const currentZoom = map.getZoom();
  if (currentZoom < 15) {
    markersClusterGroup.options.maxClusterRadius = 4;
  } else {
    markersClusterGroup.options.maxClusterRadius = 40;
  }
  markersClusterGroup.refreshClusters();
});*/


// Add event listener to the 'moveend' event
map.on('moveend', updateMarkers);


// Function to center the map on the user's location
function centerOnUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      map.setView([lat, lon]);
    }, error => {
      console.error('Error getting user location:', error);
    });
  } else {
    console.error('Geolocation is not available in this browser.');
  }
}

function removeLayerByName(name) {
  map.eachLayer(layer => {
    if (layer.customLayerName === name) {
      map.removeLayer(layer);
    }
  });
}

function removeAllMarkerLayers() {
  map.eachLayer(layer => {
    if (layer !== tileLayer) {
      map.removeLayer(layer);
    }
  });
}

//// BUTTONS


// Add event listeners to buttons
document.getElementById("button1").addEventListener("click", () => {
  // Button 1 functionality
  displayInfo();
});

document.getElementById("button2").addEventListener("click", () => {
  // Button 2 functionality
  displayOptions();
});

document.getElementById("button3").addEventListener("click", () => {
  // Button 3 functionality
  centerOnUserLocation();
});


//

function closeModal() {
  modal.style.display = 'none';
  exportTags();
  updateMarkers();
}

const closeModalBtn = document.getElementById('closeModalBtn');

// Close modal when the close button is clicked
closeModalBtn.addEventListener('click', () => {
  closeModal();
});

// Close modal when clicked outside
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});


const modal = document.getElementById('modal');

function displayOptions() {
  modal.style.display = 'flex';
  const options = document.getElementById('modal-content');
  options.innerHTML = '';

  for (const service of Services) {
    const details = document.createElement('details');
    details.open = true;
    const summary = document.createElement('summary');
    summary.innerText = service.name;
    details.appendChild(summary);
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags-container';

    for (const [index, tag] of service.tags.entries()) {
      const tagElement = document.createElement('div');
      tagElement.innerHTML = `<span class="material-icons">${tag.icon}</span> ${tag.label}`;
      tagElement.classList.add('tag');
      tagElement.draggable = true;
      if (tag.isActive === true) tagElement.classList.add('selected');


      let holdTimeout, pressTimeout;

      function startHold() {
        pressTimeout = setTimeout(() => {
          tagElement.classList.add('deleting');
        }, 300); //don't start animation on short press

        holdTimeout = setTimeout(() => {
          service.tags.splice(index, 1);
          tagElement.remove();
          displayOptions();
        }, 2000);
      }

      function stopHold() {
        setTimeout(() => {
          tagElement.classList.remove('deleting');
        }, 300); //remove class for animation AFTER it has been added
        clearInterval(pressTimeout);
        clearTimeout(holdTimeout);
      }

      tagElement.addEventListener('mousedown', startHold);
      tagElement.addEventListener('touchstart', startHold);

      tagElement.addEventListener('mouseup', stopHold);
      tagElement.addEventListener('mouseleave', stopHold);

      tagElement.addEventListener('touchend', stopHold);
      tagElement.addEventListener('touchcancel', stopHold);


      tagElement.addEventListener('click', () => { toggleTag(service, index, tagElement) });
      tagsContainer.appendChild(tagElement)
    }

    details.appendChild(tagsContainer);
    options.appendChild(details)
  }
}

function displayInfo() {
  modal.style.display = 'flex';
  const ele = document.getElementById('modal-content');
  ele.innerHTML = '';

  const info = document.getElementById('infoPanel');
  let clon = info.content.cloneNode(true);
  ele.appendChild(clon);
}

function toggleTag(service, tagIndex, element) {
  service.tags[tagIndex].isActive = !service.tags[tagIndex].isActive; //object
  element.classList.toggle('selected'); //UI
  removeLayerByName(`${service.name}:${service.tags[tagIndex].label}`) //map old layer
}

const popup = document.getElementById('popup');
document.getElementById('addNewTagBtn').addEventListener('click', () => { addNewTagPopup() })

const select = document.getElementById('service-select');
const submitBtn = document.getElementById('submitBtn');

function addNewTagPopup() {
  //display popup
  popup.style.display = 'block';

  //create options
  select.innerHTML = '';
  for (const service of Services) {
    const option = document.createElement('option');
    option.value = service.name;
    option.innerText = service.name;
    select.appendChild(option);
  }
}

submitBtn.addEventListener('click', () => {
  const tag = document.getElementById('tag-input');
  const label = document.getElementById('label-input');
  const icon = document.getElementById('icon-input');

  for (const s of Services) {
    if (s.name === select.value) {
      s.tags.push({
        value: tag.value,
        label: label.value,
        icon: icon.value,
        isActive: true
      });
      console.log(s.tags);
    }
  }

  popup.style.display = 'none';
  displayOptions();
});

function exportTags() {
  let obj = {};
  for (const service of Services) {
    const serviceId = service.id;
    obj[serviceId] = service.tags;
  }
  console.log(obj);
  localStorage.setItem('nearipedia_settings', JSON.stringify(obj));
}

function importTags() {
  let localStorageData = JSON.parse(localStorage.getItem('nearipedia_settings'));
  for (const service of Services) {
    const serviceId = service.id;
    if (localStorageData && localStorageData[serviceId]) {
      service.tags = localStorageData[serviceId];
    }
  }
  console.log(Services);
}

/*remote storage*/


// Our appstate object
var services = {
}

// Construct and dependency inject
const remoteStorage = new RemoteStorage({ changeEvents: { local: true, window: true, remote: true, conflicts: true } });
remoteStorage.access.claim('nearipedia', 'rw');
const client = remoteStorage.scope('/nearipedia/');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  var widget = new Widget(remoteStorage, { leaveOpen: true });
  widget.attach('remotestorage-widget-anchor');
  client.cache('');

  // Register our application state JSON schema
  //
  // Documentation: https://remotestoragejs.readthedocs.io/en/latest/js-api/base-client.html#declareType
  client.declareType('services', {
    type: 'object',
    properties: {
      list: {
        type: 'object'
      }
    },
    required: ['list']
  });

  // React to application state changes from RS
  //
  // Documentation: https://remotestoragejs.readthedocs.io/en/latest/js-api/base-client.html#change-events
  client.on('change', (event) => {
    if (event.relativePath === 'services') {
      services = event.newValue;

      console.log(services);
    }
  });

});

// Change the application state within RS
//
// Documentation: https://remotestoragejs.readthedocs.io/en/latest/js-api/base-client.html#storeObject
function setRS(newState) {
  client.storeObject('services', 'services', newState);
}

document.getElementById('load-rs').addEventListener('click', () => {
  for (const service of Services) {
    const serviceId = service.id;
    if (services.list[serviceId]) {
      service.tags = services.list[serviceId];
    }
  }
});

document.getElementById('upload-rs').addEventListener('click', () => {
  let obj = {};
  for (const service of Services) {
    const serviceId = service.id;
    obj[serviceId] = service.tags;
  }
  client.storeObject('services', 'services', { list: obj });
  console.log(obj)
})

