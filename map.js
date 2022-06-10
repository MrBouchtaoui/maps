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


// Adding a map object
let map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([4.333959, 52.060110]),
      zoom: 13
    })
  });

// Adding a markers layer
let markersLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'image/airplane.png'
        })
    })
});
map.addLayer(markersLayer);

// Adding a marker to markersLayer
// let marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([4.333959, 52.060110])));
let marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([4.333959, 52.060110]))
});
markersLayer.getSource().addFeature(marker);




function generateMarker() {
    if(crntIndex < locations.length) {
        const loc = [locations[crntIndex][1], locations[crntIndex][0]];
        const airplane = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(loc))
        });
        markersLayer.getSource().addFeature(airplane);
        crntIndex++;
    } else {
        crntIndex = 0;
    }
}