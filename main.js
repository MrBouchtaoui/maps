// Map rendering with Leaflet library: https://leafletjs.com/index.html



console.log("Welcome to this Map Demo");

const generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click',generateMarker);

const locations = [
    [52.032660, 4.316106],
    [52.056972, 4.196791],
    [52.088593, 4.283824],
    [52.085129, 4.395876],
    [52.040286, 4.397286],
    [52.061955, 4.314128],
];
let crntIndex = 0;

var airplaneIcon = L.icon({
    iconUrl: 'image/airplane.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [32, 32], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


// Adding a map object
let map = L.map('map').setView([52.060110, 4.333959], 13);

// Adding tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Adding a marker
// L.marker([52.060110, 4.333959]).addTo(map)
//     .bindPopup('Mijn errste popup<br>Best eenvoudig.')
//     .openPopup();

L.marker([52.060110, 4.333959], {icon: airplaneIcon}).addTo(map);

function generateMarker() {
    if(crntIndex < locations.length) {
        const loc = locations[crntIndex];
        L.marker(loc).addTo(map);
        crntIndex++;
    } else {
        crntIndex = 0;
    }
}
