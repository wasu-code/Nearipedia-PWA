import { Wikipedia } from './services/Wikipedia.js';
import { OSM } from './services/OSM.js';



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
    alert('Zoom in to display new markers')
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
      map.setView([lat, lon], 13);
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
const modal = document.getElementById('modal');

// Add event listeners to buttons
document.getElementById("button1").addEventListener("click", () => {
  // Button 1 functionality
});

document.getElementById("button2").addEventListener("click", () => {
  // Button 2 functionality
  modal.style.display = 'flex';
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



function displayOptions() {
  const options = document.getElementById('services-options');
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
      if (tag.isActive === true) tagElement.className = 'selected';
      tagElement.addEventListener('click', () => { toggleTag(service, index, tagElement) })
      tagsContainer.appendChild(tagElement)
    }

    details.appendChild(tagsContainer);
    options.appendChild(details)
  }
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
  closeModal();
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

