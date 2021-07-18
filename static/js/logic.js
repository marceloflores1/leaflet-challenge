// Create the tile layer that will be the background of our map


var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(earthquakeUrl).then(function(response){
    var features = response.features;
    var eqMarkers = [];
    for(var i=0; i < features.length; i++){
        var feature = features[i];
        var eqCoords = feature.geometry.coordinates;
        var eqMagnitude = feature.properties.mag
        var eqTitle = feature.properties.title;
        var eqTime = feature.properties.time;
        var eqMarker = L.circleMarker([eqCoords[1],eqCoords[0]],{
            fillOpacity: .5,
            weight: .5,
            color: "black",
            fillColor: "green",
            radius: (eqMagnitude * 5)
        }).bindPopup(`<h1>${eqTitle}</h1><hr><h3>Time: ${new Date(eqTime)}</h3><hr><h3>Depth: ${eqCoords[2]}</h3>`);
        eqMarkers.push(eqMarker);
    };
    var eqLayer = L.layerGroup(eqMarkers);
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMap = {
        "Earthquakes": eqLayer
    };

    var myMap = L.map("map-id", {
        center: [0, 0],
        zoom: 2,
        layers: [lightmap, eqLayer]
    });

    var info = L.control({
        position: "bottomright"
    })

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    }

    info.addTo(myMap);
});