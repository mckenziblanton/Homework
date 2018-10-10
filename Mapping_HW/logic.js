// mapbox api key
const API_KEY = "pk.eyJ1IjoidmhhZ2h2ZXJkaSIsImEiOiJjamxlZ2xmeGIwbHI1M3BwaGkxZWt1bWo2In0.ZJu0gU8mjRLeGmcu68h7EA";

// satellite map
var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

// light map
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// outdoors map
var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// initial map conditions
var map = L.map("map", {
  center: [20, 0],
  zoom: 3,
  layers: [satMap, lightMap, outdoorsMap]
});

// layer groups to hold earthquake and fault line data
var quakeGroup = new L.layerGroup();
var faultLineGroup = new L.layerGroup();

// basemap dictionary
var baseMaps = {
  "Satellite": satMap,
  "Light": lightMap,
  "Outdoors": outdoorsMap
};

// overlays dictionary
var overlays = {
  "Fault Lines": faultLineGroup,
  "Earthquakes": quakeGroup
};

// add layer control box
L.control.layers(baseMaps, overlays).addTo(map);

// pull JSON data then act on it
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(data => {

    // function to make size and color of circles dependent on magnitude
    function styleInfo(feature) {
      return {
        opacity: 1,
        color: "#000000",
        fillOpacity: 0.8,
        fillColor: quakeColor(feature['properties']['mag']),
        radius: quakeRadius(feature['properties']['mag']),
        weight: 0.5
      };
    }

    // return one of six colors depending on magnitude
    function quakeColor(mag) {
      switch (true) {
        case mag > 5:
          return "#d73027";
        case mag > 4:
          return "#fc8d59";
        case mag > 3:
          return "#fee08b";
        case mag > 2:
          return "#d9ef8b";
        case mag > 1:
          return "#91cf60";
        default:
          return "#1a9850";
      }
    }

    // circle radius as 5 times the magnitude value
    // if magnitude not registered, return a radius of 1
    function quakeRadius(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 5;
    }

    // make circle markers for each GeoJSON point, styled according to the styleInfo function
    // bind a popup showing the magnitude and location of each earthquake
    L.geoJson(data, {
      pointToLayer: function (feature, coord) {
        return L.circleMarker(coord);
      },

      style: styleInfo,

      onEachFeature: function (feature, layer) {
        layer.bindPopup(`Magnitude: ${feature['properties']['mag']}<br>Location: ${feature['properties']['place']}`);
      }
    }).addTo(quakeGroup);

    // add the earthquake layer group to the map
    quakeGroup.addTo(map);

    // create a new control for the legend, located in the bottom right corner
    var legend = L.control({
      position: "bottomright"
    });

    // create legend showing color and magnitude intervals
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");

      var mags = [0, 1, 2, 3, 4, 5];
      var colors = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];

      // show color and corresponding magnitude interval (final interval renders as "5+")
      mags.forEach((value, index) => {
        div.innerHTML += "<i style='background: " + colors[index] + "'></i> " +
          mags[index] + (mags[index + 1] ? "&mdash;" + mags[index + 1] + "<br>" : "+");
      });

      return div;
    };

    // add legend to map
    legend.addTo(map);

    // pull GeoJSON of fault lines
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
      .then(faultData => {
        L.geoJson(faultData, {
          color: "orange",
          opacity: 0.8,
          weight: 2
        }).addTo(faultLineGroup);

        //add fault line layer group to map
        faultLineGroup.addTo(map);
      });

  });
