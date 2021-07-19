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
    
    var streetsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var bubblegmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        style: "mapbox://styles/amarcelo28/ckr9g5oul27h217oddif0ufqa",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var tectonic = new L.layerGroup();

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(data=>{
        L.geoJson(data,{
            color: "#FFA500",
            weight: 3
        }).addTo(tectonic)

        tectonic.addTo(myMap);
    });

    var myMap = L.map("map-id", {
        center: [0, 0],
        zoom: 2,
        layers: [streetsmap, outdoorsmap, bubblegmap, satellitemap, lightmap, eqLayer, tectonic]
    });

    var info = L.control({
        position: "bottomright"
    })

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML = [
            `<strong>Magnitude</strong><br>`,
            `<i id="legend1"></i>-10-10<br>`,
            `<i id="legend2"></i>10-30<br>`,
            `<i id="legend3"></i>30-50<br>`,
            `<i id="legend4"></i>50-70<br>`,
            `<i id="legend5"></i>70-90<br>`,
            `<i id="legend6"></i>90+`
        ].join("")
        return div;
      };

    info.addTo(myMap);

    var baseMaps = {
        "Street Map": streetsmap,
        "Outdoor Map": outdoorsmap,
        "Bubblegum Map": bubblegmap,
        "Satellite Map": satellitemap,
        "Light Map": lightmap
    };

    var overlayMaps = {
        "Earthquakes": eqLayer,
        "Tectonic Plates": tectonic
    };
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);    
});

function eqMarkerColor(depth){
    return depth >= 90 ? "#ff0000" :
    depth >= 70 ? "#ff4d00" :
    depth >= 50 ? "#ff8400" :
    depth >= 30 ? "#ffcc00" :
    depth >= 10 ? "#f2ff00" :
    "#bfff00"
};

