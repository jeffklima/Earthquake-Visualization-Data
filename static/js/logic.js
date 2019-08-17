// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.geojson(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h4>Location: " + feature.properties.place + 
    "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
    "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // Define a function to create the circle size based on the magnitude
  function radiusSize(magnitude) {
    return magnitude * 20000;
  }

  // Define a function to set the circle color based on the magnitude
  function circleColor(magnitude) {
    if (mag <= 1) {
        return "#ADFF2F";
    } else if (mag <= 2) {
        return "#9ACD32";
    } else if (mag <= 3) {
        return "#FFFF00";
    } else if (mag <= 4) {
        return "#FFD700";
    } else if (mag <= 5) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
        return L.circle(latlng, {
            radius: radiusSize(earthquakeData.properties.mag),
            color: circleColor(earthquakeData.properties.mag),
            fillOpacity: 1
        });
        },
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Define outdoorsmap layers
// Logan helped!
var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.outdoors",
accessToken: API_KEY
}); 

// Create our map, giving it the outdoorsmap and earthquakes layers to display on load
var map = L.map("map", {
center: [31.850033,-99.6500523],
zoom: 4
});

outdoorsmap.addTo(map)
d3.json(queryUrl, function(data){
    L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        var mag = feature.properties.mag;
        function colorer(mag){
            switch(true){
                case mag <= 1: return "#ADFF2F";
                case mag <= 2: return "#9ACD32";
                case mag <= 3: return "#FFFF00";
                case mag <= 4: return "#FFD700";
                case mag <= 5: return "#9ACD32";
                default: return "#FF0000";
            }
        }
        return L.circle(latlng, {
            radius: mag * 10000,
            fillOpacity: 1,
            color: colorer(mag)})
        },
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h4>Location: " + feature.properties.place + 
        "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
        "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(map);
})

function createMap(earthquakes) {

    // Define outdoorsmap layers
    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    }); 
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the outdoorsmap and earthquakes layers to display on load
    var map = L.map("map", {
      center: [31.850033,-99.6500523],
      zoom: 4,
      layers: [outdoorsmap, earthquakes]
    });
  
  // Add legend to the map
  // Reference: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];

      div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colorer(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }

      return div;
  };
  legend.addTo(map);
}
