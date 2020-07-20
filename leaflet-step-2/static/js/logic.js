var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(Url, function(data) {
    var earthquakes = data.features;


    //Tile Layers are mutually exclusive
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: "pk.eyJ1IjoiZmFienVtIiwiYSI6ImNrYm54NjduYTF1dzUyc25jMGUzN3huOTYifQ.pD1VCmlHWWg4d5CV7MMl0A"
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: "pk.eyJ1IjoiZmFienVtIiwiYSI6ImNrYm54NjduYTF1dzUyc25jMGUzN3huOTYifQ.pD1VCmlHWWg4d5CV7MMl0A"
    });
    
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: "pk.eyJ1IjoiZmFienVtIiwiYSI6ImNrYm54NjduYTF1dzUyc25jMGUzN3huOTYifQ.pD1VCmlHWWg4d5CV7MMl0A"
    });
 
    var myMap = L.map("map", {
        center: [
          35.87, -116.44
        ],
        zoom: 5,
        layers: lightmap
    });



    var baseMaps = {
        "Satellite": satellite,
        "Greyscale": lightmap,
        "Outdoors": outdoors
    };
    
    var overlayMaps = {
        "Fault Lines": cities,
        "Earthquakes": earthquakes
    };



    function getColor(mag) {
        if (mag <= 1) {
            return "yellowgreen"
        }
        else if (mag <= 2) {
            return "greenyellow"
        }
        else if (mag <= 3) {
            return "gold"
        }
        else if (mag <= 4) {
            return "orange"
        }
        else if (mag <= 5) {
            return "coral"
        } 
        else {
            return "red"
        }
    }

    for (var i = 0; i < earthquakes.length; i++) {
        var lat = earthquakes[i].geometry.coordinates[1]
        var lng = earthquakes[i].geometry.coordinates[0]
        L.circle([lat,lng], {
            weight: 0.5,
            color: getColor(earthquakes[i].properties.mag),
            fillColor: getColor(earthquakes[i].properties.mag),
            fillOpacity: 1,
            radius: earthquakes[i].properties.mag * 28000
        }).bindPopup("<h1> Location: " + earthquakes[i].properties.place + "</h1> <hr> <h3>Time: " + new Date(earthquakes[i].properties.time) + "</h3>").addTo(myMap);
    }

    var legend = L.control({position: "bottomright"});
  
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var mags = [5,4,3,2,1,0];
        div.innerHTML = "<span></span><br>";
 
        for (var i = mags.length -1; i >= 0; i--) {
            div.innerHTML +=
                '<i style="background:' + getColor(mags[i] + 1) + '"></i> <span>' +
                mags[i] + (mags[i - 1] ? '&ndash;' + mags[i - 1] + '</span><br>' : '+</span><br>');
        }

        return div;
    };

    
    // Adding legend to the map
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
});