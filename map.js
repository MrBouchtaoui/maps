// Map rendering with Leaflet library: https://leafletjs.com/index.html



console.log("Welcome to this Map Demo");

const generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click',generateMarker);

const moveBtn = document.querySelector('#move');
moveBtn.addEventListener('click', startMoving);

const nextBtn = document.querySelector('#next');
nextBtn.addEventListener('click', moveNextPosition);

const locations = [
    [52.032660, 4.316106],
    [52.056972, 4.196791],
    [52.088593, 4.283824],
    [52.085129, 4.395876],
    [52.040286, 4.397286],
    [52.061955, 4.314128],
];
let crntIndex = 0;

const positions = [
    [52.085873, 4.343973],
    [52.087671, 4.380350],
    [52.074309, 4.434707],
    [52.063000, 4.472756],
    [52.037286, 4.509552],
    [52.011960, 4.529729],
    [51.979802, 4.497937],
    [51.966451, 4.466903],
    [51.962329, 4.453831],
    [51.956352, 4.438973],
];
let crntPosition = 0;

const styles = {
    'geoMarker': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'image/airplane.png',
      }),
    }),
  };


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
        anchor: [0.5, 0.5],
        src: 'image/airplane.png'
        })
    })
});
map.addLayer(markersLayer);

// Adding a marker to markersLayer
// Gebruik Feature ipv Marker: https://gis.stackexchange.com/a/20491
let flyingPlane = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([4.333959, 52.060110]))
});
markersLayer.getSource().addFeature(flyingPlane);

const geoMovingMarker = flyingPlane.getGeometry().clone();
console.log('Position flyingPlane: ', geoMovingMarker);

function generateMarker(e) {
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

// source: https://openlayers.org/en/latest/examples/feature-move-animation.html
function moveMarker(e) {
    console.log("Move marker: ", e);

    // move marker to next position
    if(crntPosition < positions.length) {
        console.log("\tPosition: ", crntPosition);
        const loc = [positions[crntPosition][1], positions[crntPosition][0]];
        
        let marker = new ol.geom.Point(ol.proj.fromLonLat(loc));
        flyingPlane.setGeometry(marker);
        marker.rotate(Math.PI/2, flyingPlane.getCenter());
        // map.view().setCenter(new ol.geom.Point(ol.proj.fromLonLat(loc)));

        crntPosition++;

    } else {
        crntPosition = 0;
    }
}

function startMoving(e) {
    console.log("Start moving!");
    console.log(markersLayer);
    // markersLayer.on('postrender', moveMarker);
}

function moveNextPosition(e) {
    moveMarker(e);
    // markersLayer.un('postrender', moveMarker);
}

