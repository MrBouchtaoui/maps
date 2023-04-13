console.log("Welcome to this Map Demo");

const generateBtn = document.querySelector("#generate");
generateBtn.addEventListener("click", generateMarker);

const moveBtn = document.querySelector("#move");
moveBtn.addEventListener("click", startMoving);

const nextBtn = document.querySelector("#next");
nextBtn.addEventListener("click", moveNextPosition);

const locations = [
	[52.03266, 4.316106],
	[52.056972, 4.196791],
	[52.088593, 4.283824],
	[52.085129, 4.395876],
	[52.040286, 4.397286],
	[52.061955, 4.314128],
];
let crntIndex = 0;

const positions = [
	[52.085873, 4.343973],
	[52.087671, 4.38035],
	[52.074309, 4.434707],
	[52.063, 4.472756],
	[52.037286, 4.509552],
	[52.01196, 4.529729],
	[51.979802, 4.497937],
	[51.966451, 4.466903],
	[51.962329, 4.453831],
	[51.956352, 4.438973],
];
let crntPosition = 0;

const styles = {
	geoMarker: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 1],
			src: "image/airplane.png",
		}),
	}),
};

// Adding a map object
let map = new ol.Map({
	target: "map",
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM(),
		}),
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([4.333959, 52.06011]),
		zoom: 13,
	}),
});

// Adding a markers layer
let markersLayer = new ol.layer.Vector({
	source: new ol.source.Vector(),
	style: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 0.5],
			src: "image/airplane.png",
		}),
	}),
});
map.addLayer(markersLayer);

// Adding a marker to markersLayer
// Gebruik Feature ipv Marker: https://gis.stackexchange.com/a/20491
let flyingPlane = new ol.Feature({
	geometry: new ol.geom.Point(ol.proj.fromLonLat([4.333959, 52.06011])),
});
markersLayer.getSource().addFeature(flyingPlane);

const geoMovingMarker = flyingPlane.getGeometry().clone();
console.log("Position flyingPlane: ", geoMovingMarker);

function lerp(vStart, vEnd, t) {
	return vStart + t * (vEnd - vStart);
}


function generateMarker(e) {
	if (crntIndex < locations.length) {
		const loc = [locations[crntIndex][1], locations[crntIndex][0]];
		const airplane = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat(loc)),
		});
		markersLayer.getSource().addFeature(airplane);
		crntIndex++;
	} else {
		crntIndex = 0;
	}
}

function movePlaneToPos(pos) {
	let marker = new ol.geom.Point(ol.proj.fromLonLat(pos));
	flyingPlane.setGeometry(marker);
}


// Lerp the marker between the 2 points
function lerpMarker(oldPos, newPos) {

	// The progress of the move from oldPos to newPos (0.0 < progress <= 1.0)
	let progress = 0.0;
	let progressPerFrame = 0.005;

	let intervalID = window.setInterval(() => {
		const xOld = positions[oldPos][1];
		const yOld = positions[oldPos][0];

		const xNew = positions[newPos][1];
		const yNew = positions[newPos][0];
	
		const xLerped = lerp(xOld, xNew, progress);
		const yLerped = lerp(yOld, yNew, progress);

		if (progress >= 1) {
			window.clearInterval(intervalID);
		}

		movePlaneToPos([xLerped, yLerped])

		progress += progressPerFrame;
		
	}, 0.1);
}

// source: https://openlayers.org/en/latest/examples/feature-move-animation.html
function moveMarker() {
	// console.log("Move marker: ");

	const oldPos = crntPosition;

	crntPosition = (crntPosition + 1) % positions.length;

	lerpMarker(oldPos, crntPosition)
	

	// console.log("\tPosition: ", crntPosition);
	// marker.rotate(Math.PI/2, flyingPlane.getCenter());
	// map.view.setCenter(new ol.geom.Point(ol.proj.fromLonLat(loc)));
}

function startMoving(e) {
	console.log("Start moving!");
	console.log(markersLayer);
	// markersLayer.on('postrender', moveMarker);
}

function moveNextPosition(e) {
	moveMarker();
	// markersLayer.un('postrender', moveMarker);

	// flash(flyingPlane);
	// animateMove(flyingPlane, [positions[1][1], positions[1][0]]);
}

// Animation code
// const duration = 3000;
// function flash(feature) {
// 	// Pak timestamp in milliseconden
// 	const start = Date.now();

// 	// Kopieer coordinatie
// 	const flashGeom = feature.getGeometry().clone();

// 	// listener voor postrender
// 	const listenerKey = markersLayer.on("postrender", animate);

// 	// animate functie, aangeroepen door postrender event
// 	function animate(event) {
// 		// Pak timestamp van frame-refresh
// 		const frameState = event.frameState;

// 		// Bepaal tijdsverschil met start-time
// 		const elapsed = frameState.time - start;
// 		if (elapsed >= duration) {
// 			ol.Observable.unByKey(listenerKey);
// 			return;
// 		}

// 		// Pak vector's teken pen
// 		const vectorContext = ol.render.getVectorContext(event);

// 		// Bepaal deelwaarde van elapsed en duration
// 		const elapsedRatio = elapsed / duration;

// 		// radius will be 5 at start and 30 at end.
// 		const radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;

// 		// Wordt met de tijd steeds transparanter
// 		const opacity = ol.easing.easeOut(1 - elapsedRatio);

// 		// Pas style aan met nieuwe waarden radius en opacity
// 		const style = new ol.style.Style({
// 			image: new ol.style.Circle({
// 				radius: radius,
// 				stroke: new ol.style.Stroke({
// 					color: "rgba(255, 0, 0, " + opacity + ")",
// 					width: 0.25 + opacity,
// 				}),
// 			}),
// 		});

// 		// Pas nieuwe style toe
// 		vectorContext.setStyle(style);

// 		// Teken op de locatie
// 		vectorContext.drawGeometry(flashGeom);

// 		// tell OpenLayers to continue postrender animation
// 		map.render();
// 	}
// }

// const ANIM_TIME = 1500;
// let num_logs = 0;
// function animateMove(feature, destCoord) {
// 	/* We hebben een start en een eind positie en een
//        animatie tijd van 1500 ms.
//        We pakken het verschil tussen de 2 locaties:
//        dLat en dLon 
//     */

// 	// Pak huidige timestamp in milliseconden
// 	const start = Date.now();

// 	// Kopieer huidige coordinatie
// 	const currentGeom = feature.getGeometry().clone();
// 	// console.log("currentGeom: ", currentGeom);

// 	// Waar moet het naar toe
// 	let finalGeom = null;

// 	const currentLoc = currentGeom.getCoordinates();
// 	console.log("currentLoc: ", currentLoc);

// 	const destGeom = new ol.geom.Point(ol.proj.fromLonLat([destCoord[0], destCoord[1]]));
// 	const destLoc = destGeom.getCoordinates();
// 	console.log("destGeom: ", destLoc);

// 	// console.log("destLat: ", destLoc[1]);
// 	// console.log("crntLon", currentLoc[0], "destLon: ", destLoc[0]);

// 	const dLat = destLoc[1] - currentLoc[1];
// 	console.log("dLat: ", dLat);
// 	const dLon = destLoc[0] - currentLoc[0];
// 	console.log("dLon: ", dLon);
// 	const stepLat = dLat / ANIM_TIME;
// 	console.log("stepLat: ", stepLat);
// 	const stepLon = dLon / ANIM_TIME;
// 	console.log("stepLon: ", stepLon);

// 	// listener voor postrender
// 	const listenerKey = markersLayer.on("postrender", animate);

// 	let lastTime = 0;

// 	const newLoc = [];
// 	(newLoc[0] = currentLoc[0]), (newLoc[1] = currentLoc[1]);

// 	// animate functie, aangeroepen door postrender event
// 	function animate(event) {
// 		console.log("Last time: ", lastTime);

// 		// if(num_logs >= 20) return;
// 		// else num_logs++;
// 		// console.log("Num logs: ", num_logs);

// 		// Pak tijdsverschil tussen 2 frames
// 		// const elapsedTime = event.frameState.time - lastTime; console.log("Elapsed time: ", elapsedTime);
// 		// lastTime = elapsedTime;

// 		newLoc[1] += stepLat;
// 		newLoc[0] += stepLon;
// 		const newLat = newLoc[1];
// 		console.log("newLat: ", newLat);
// 		const newLon = newLoc[0];
// 		console.log("newLon: ", newLon);

// 		// Bepaal tijdsverschil met start-time
// 		const elapsed = event.frameState.time - start;
// 		console.log("Elapsed: ", elapsed);
// 		if (newLat >= destLoc[1]) {
// 			ol.Observable.unByKey(listenerKey);
// 			return;
// 		}

// 		finalGeom = new ol.geom.Point([newLon, newLat]);

// 		// Pak vector's teken pen
// 		const vectorContext = ol.render.getVectorContext(event);

// 		// Bepaal deelwaarde van elapsed en duration
// 		// const elapsedRatio = elapsed / duration;

// 		// radius will be 5 at start and 30 at end.
// 		// const radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;

// 		// Wordt met de tijd steeds transparanter
// 		// const opacity = ol.easing.easeOut(1 - elapsedRatio);

// 		// Pas style aan met nieuwe waarden radius en opacity
// 		const style = new ol.style.Style({
// 			image: new ol.style.Circle({
// 				radius: 16,
// 				stroke: new ol.style.Stroke({
// 					color: "rgba(0, 0, 0)",
// 					width: 2,
// 				}),
// 			}),
// 		});

// 		// Pas nieuwe style toe
// 		// vectorContext.setStyle(style);

// 		// Teken op de locatie
// 		vectorContext.drawGeometry(finalGeom);

// 		// tell OpenLayers to continue postrender animation
// 		map.render();
// 	}
// }
