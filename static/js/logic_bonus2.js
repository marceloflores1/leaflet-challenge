// Information 
var continentsPosition = {
    "World": [0,0,3],
    "North America": [54.5260,-105.2551,4],
    "South America": [-8.7832,-55.4915,4],
    "Europe": [54.5260, 15.2551,4],
    "Africa": [-8.7832,34.5085,4],
    "Asia": [34.0479,100.6197,3],
    "Antarctica": [-82.8628,135.0000,3],
    "Oceania": [-22.7359,140.0188,5]
}

// Urls for Earthquake Data
var periodsUrl = {
    "Day": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    "Week": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    "Month": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
}

// Default variables
var earthquakeUrl = periodsUrl["Day"];
var mapCenter = [continentsPosition["World"][0], continentsPosition["World"][1]];
var mapZoom = continentsPosition["World"][2];

function createMaps(url, mapCenter, mapZoom) {

    d3.select("#map-id").html(" ");
    var container = L.DomUtil.get('map-id');
    if(container != null){
    container._leaflet_id = null;
    }

    d3.json(url).then(function(response){
            
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
                radius: (eqMagnitude * 4)
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
    
        var bubblegmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "amarcelo28/ckr9g5oul27h217oddif0ufqa",
            accessToken: API_KEY
        });
    
        var tectonic = new L.layerGroup();
    
        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(data=>{
            L.geoJson(data,{
                color: "#ff6f00",
                weight: 3
            }).addTo(tectonic)
    
            tectonic.addTo(myMap);
        });
    
        var myMap = L.map("map-id", {
            center: mapCenter,
            zoom: mapZoom,
            layers: [streetsmap, outdoorsmap, satellitemap, lightmap, bubblegmap, eqLayer, tectonic]
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
            "Satellite Map": satellitemap,
            "Light Map": lightmap,
            "Bubblegum Map": bubblegmap
        };
    
        var overlayMaps = {
            "Earthquakes": eqLayer,
            "Tectonic Plates": tectonic
        };
        
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);    
    });

}

function eqMarkerColor(depth){
    return depth >= 90 ? "#ff0000" :
    depth >= 70 ? "#ff4d00" :
    depth >= 50 ? "#ff8400" :
    depth >= 30 ? "#ffcc00" :
    depth >= 10 ? "#f2ff00" :
    "#bfff00"
};

createMaps(earthquakeUrl, mapCenter, mapZoom);

d3.selectAll("#dateButton").on("click", function(){
    d3.selectAll("#dateButton").attr("class", "btn btn-secondary")
    d3.select(this).attr("class", "btn btn-primary")
    var value = d3.select(this).attr("value");
    if(value === "Week"){
        earthquakeUrl = periodsUrl["Week"];
    } else if (value === "Month"){
        earthquakeUrl = periodsUrl["Month"];
    } else {
        earthquakeUrl = periodsUrl["Day"];
    };
    console.log(earthquakeUrl);
    createMaps(earthquakeUrl, mapCenter, mapZoom);
});

d3.selectAll("#regionButton").on("click", function(){
    d3.selectAll("#regionButton").attr("class", "btn btn-secondary")
    d3.select(this).attr("class", "btn btn-primary")
    var value = d3.select(this).attr("value");

    Object.continentsPosition

    if(value === "North America"){
        mapCenter = [continentsPosition["North America"][0], continentsPosition["North America"][1]];
        mapZoom = continentsPosition["North America"][2];
    } else if (value === "South America"){
        mapCenter = [continentsPosition["South America"][0], continentsPosition["South America"][1]];
        mapZoom = continentsPosition["South America"][2];
    } else if (value === "Europe"){
        mapCenter = [continentsPosition["Europe"][0], continentsPosition["Europe"][1]];
        mapZoom = continentsPosition["Europe"][2];
    } else if (value === "Africa"){
        mapCenter = [continentsPosition["Africa"][0], continentsPosition["Africa"][1]];
        mapZoom = continentsPosition["Africa"][2];
    } else if (value === "Asia"){
        mapCenter = [continentsPosition["Asia"][0], continentsPosition["Asia"][1]];
        mapZoom = continentsPosition["Asia"][2];
    } else if (value === "Antarctica"){
        mapCenter = [continentsPosition["Antarctica"][0], continentsPosition["Antarctica"][1]];
        mapZoom = continentsPosition["Antarctica"][2];
    } else if (value === "Oceania"){
        mapCenter = [continentsPosition["Oceania"][0], continentsPosition["Oceania"][1]];
        mapZoom = continentsPosition["Oceania"][2];
    } else {
        mapCenter = [continentsPosition["World"][0], continentsPosition["World"][1]];
        mapZoom = continentsPosition["World"][2];
    };
    console.log(mapCenter);
    console.log(mapZoom);
    createMaps(earthquakeUrl, mapCenter, mapZoom);
});
