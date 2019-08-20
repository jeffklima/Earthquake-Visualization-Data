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
        function magColors(mag){
            switch(true){
                case mag <= 1: return "#ADFF2F";
                case mag <= 2: return "#9ACD32";
                case mag <= 3: return "#FFFF00";
                case mag <= 4: return "#FFD700";
                case mag <= 5: return "#FFA500";
                default: return "#FF0000";
            }
        }
        return L.circle(latlng, {
            radius: mag * 10000,
            fillOpacity: 1,
            color: magColors(mag)})
        },
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h4>Location: " + feature.properties.place + 
        "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
        "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(map);
     // Add legend to the map
  // Reference: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          colors = ["#ADFF2F", "#9ACD32", "#FFFF00", "#FFD700", "#FFA500", "#FF0000"];

      div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              "<i style='background:" + colors[i]+ "'></i> " +
              magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
      }

      return div;
  };
  legend.addTo(map);
  console.log(legend)
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
};
