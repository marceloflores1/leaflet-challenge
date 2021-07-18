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
            fillOpacity: .75,
            weight: .5,
            color: "black",
            fillColor: eqMarkerColor(eqCoords[2]),
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
        center: [40, -107],
        zoom: 6,
        layers: [lightmap, eqLayer]
    });

    L.control.layers(baseMaps, overlayMap, {
        collapsed: true
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    })

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML = [
            `<i id="legend1"></i>-10 - 10<br>`,
            `<i id="legend2"></i>10 - 30<br>`,
            `<i id="legend3"></i>30 - 50<br>`,
            `<i id="legend4"></i>50 - 70<br>`,
            `<i id="legend5"></i>70 - 90<br>`,
            `<i id="legend6"></i>90+`
        ].join("")
        return div;
      };

    info.addTo(myMap);
    
});

function eqMarkerColor(depth){
    return depth >= 90 ? "#ff0000" :
    depth >= 70 ? "#ff4d00" :
    depth >= 50 ? "#ff8400" :
    depth >= 30 ? "#ffcc00" :
    depth >= 10 ? "#f2ff00" :
    "#bfff00"
};
