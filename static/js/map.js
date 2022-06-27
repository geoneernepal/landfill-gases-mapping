
var map = L.map('map', {zoomControl: true}).setView([27.7797,85.2460], 14);


var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibG9zdGIxIiwiYSI6ImNqaTBjcGd4bjE2cGMza3M2MWEzcTRwd3gifQ.Ps6yKHol2bmEPndMSeYKKw'
}).addTo(map);

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var Stamen_TerrainBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});


// var TrueTile = "{{ trueColorTile }}"
// console.log('{ trueColorTile }');



var baseMaps1 = {
    "OSM" :basemap,
    "Topo Map": OpenTopoMap,
    "Terrain": Stamen_TerrainBackground,
    "ESRI World Imagery":Esri_WorldImagery ,
    "USGS Imagery Topo":USGS_USImageryTopo,
};




// L.control.zoom({
//     'position': 'bottomright',
// }).addTo(map);






// // marker for landfill site location
// var landfillIcon = L.icon({
//     // iconUrl: "{% static '/media/dumping-site.png' %}",
//     iconUrl: "{% static 'media/logo.png'%}",
//     shadowUrl: "{% static 'media/logo.png'%}",

//     iconSize:     [38, 95], // size of the icon
//     shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// // L.marker([27.777768900181712,85.24440391494112]).addTo(map).bindPopup("Sisdol Landfill Site").openPopup();

// sisdol landfill area polygon
var bufferStyle = {
    color:'red',
    fillColor:'#ffffff00',
    weight:'0.8',
}

var sisdolLanfill = L.geoJSON(sisdol_landfill, {
    color:'red',
    fillColor:'orange',
    fillOpacity:'0.5',
    weight:0.5,
}).addTo(map).bindPopup("Sisdol Landfill Site").openPopup();
var sisdolBuffer1400 = L.geoJSON(buffer1400 , bufferStyle).bindPopup("Buffer Area 1400 m");
var sisdolBuffer1000 = L.geoJSON(buffer1000, bufferStyle).bindPopup("Buffer Area 1000 m");
var sisdolBuffer500 = L.geoJSON(buffer500 , bufferStyle).bindPopup("Buffer Area 500 m");
var sisdolBuffer300 = L.geoJSON(buffer300, bufferStyle).bindPopup("Buffer Area 300 m");



// // building markers and clusters

var buildingStyle = {
    color:'#ffffff00',
    fillColor:'red',
    weight:'0.0',
    fillOpacity:'1',
}

const geojsonMarkerOptions = {
    radius:8,
    fillColor:"#ff7800",
    color:"#000",
    weight:1,
    opacity:1,
    fillOpacity:0.8,
}

// var markers = L.markerClusterGroup();

var buildingsLayerFromApi = new L.GeoJSON.AJAX("http://localhost:8000/api/buildings?format=json", {
    style: buildingStyle,
    // pointToLayer: function(feature, latlng) {      
    //     return new L.CircleMarker(latlng, {
    //       radius: 8,
    //       fillOpacity: 0.75,
    //       color: 'red'
    //     });
    //     },
    onEachFeature: function(feature, layer){

        // for converting polygon to point 
        
                const popupContent = 
                '<h4 class="text-primary">Household Details</h4>'+
                '<div class="container"><table class="table table-striped">'+
                "<thead><tr><th>Properties</th><th>Value</th></tr></thead>"+
                "<tbody><tr><td>House_id</td><td>"+
                feature.properties.osm_id +
                "</td></tr>"+
                "<tbody><tr><td>Name</td><td>"+
                feature.properties.name +
                "</td></tr>"+
                "<tbody><tr><td>Latitude</td><td>"+
                feature.geometry.coordinates[1]+
                "</td></tr>"+
                "<tbody><tr><td>Longitude</td><td>"+
                feature.geometry.coordinates[0]+
                "</td></tr>"
               
                layer.bindPopup(popupContent);
            },
     
});



// buildingsLayerFromApi.addTo(map);

// map.addLayer(markers);


// var tileTrue = "{{ trueColorTile | js }}";
// console.log(tileTrue)


// #layer from GEE
var trueColor = document.getElementById("trueColor").value;
var thermal = document.getElementById('thermal').value;
var ndvi = document.getElementById('ndvi').value;
// var trueColorLayer = L.tileLayer('https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/51aa5c4f7bbf095fe0bc3d7ac80a2afc-1ed69ffd0a231bd8c7e98f076333b109/tiles/{z}/{x}/{y}').addTo(map);
var trueColorLayer = L.tileLayer(trueColor);
var thermalLayer = L.tileLayer(thermal);
var ndvi = L.tileLayer(ndvi);


// #layer made from Qgis

function getColor(d) {
    return d > 16 ? '#800026' :
           d > 14 ? '#bd0026' :
           d > 12  ? '#e31a1c' :
           d > 10   ? '#fc4e2a' :
           d > 8   ? '#fd8d3c' :
           d > 6  ? '#feb24c' :
           d > 4   ? '#fed976' :
           d > 2   ? '#ffeda0' :
                      '#ffffcc';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.gridcode),
        weight: 0,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#aaff00',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {

   
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    }),
    layer.bindPopup("<h5>Gas Concentration : "+ feature.properties.gridcode);
}

geojson = L.geoJson(gasConcentrationClass, {
    style: style,
    onEachFeature: onEachFeature
});


var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2, 4, 6,8,10,12,14,16,18],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innnerHTML = "<p>Gas Concentration Reclassified</p>+"; 

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    

    return div;
};



// marker clustering 
const markers = L.markerClusterGroup();


const ebMarkerOptions = {
    radius:8,
    fillColor:"#ff7800",
    color:"#000",
    weight:1,
    opacity:1,
    fillOpacity:0.8,
}

function getCircleColor(d){
    return d > 18 ? '#FB041C' :
    d > 17 ? '#FB041C' :
    d > 16  ? '#EC111A' :
    d > 15  ? '#DD1F18' :
    d > 14 ? '#CE2D17' :
    d > 13  ? '#BF3B15' :
    d > 12   ? '#B14913' :
    d > 11  ? '#A25712' :
    d > 10  ? '#936510' :
    d > 9   ? '#84730E' :
    d > 8   ? '#76810D' :
    d > 7 ? '#678F0B' :
    d > 6  ? '#589D09' :
    d > 5   ? '#49AB08' :
    d > 4   ? '#3BB906' :
    d > 3  ? '#2CC704' :
    d > 2   ? '#1DD503' :
    d > 1   ? '#0EE301' :
               '#00F100';

}




var effectedBuildings = L.geoJSON(effectedBuildings,{
    onEachFeature : function(feature, layer){
        const popupContent = 
        '<h4 class="text-primary">Household Details</h4>'+
        '<div class="container"><table class="table table-striped">'+
        "<thead><tr><th>Properties</th><th>Value</th></tr></thead>"+
        "<tbody><tr><td>House No</td><td>"+
        feature.properties.house_no +
        "</td></tr>"+
        "<tbody><tr><td>Owner Name</td><td>"+
        feature.properties.owner_name +
        "</td></tr>"+
        "<tbody><tr><td>Contact</td><td>"+
        feature.properties.contact_no +
        "</td></tr>"+
        "<tbody><tr><td>No of Members</td><td>"+
        feature.properties.members +
        "</td></tr>"+
        "<tbody><tr><td>Gas Concentration</td><td>"+
        feature.properties.gridcode +
        "</td></tr>"
        layer.bindPopup(popupContent);
    },
    pointToLayer: function(feature, latlng){
        return markers.addLayer(L.circleMarker(latlng, {
            
            radius:12,
            fillColor:getCircleColor((feature.properties.gridcode)),
            color:"#000",
            weight:1,
            opacity:1,
            fillOpacity:0.8,
            
        }))
    }
}).addTo(map);

var legendEB = L.control({position: 'bottomleft'});

legendEB.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getCircleColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};



map.addLayer(markers);




var renderedMap = {
    'Sisdol Landfill' : sisdolLanfill,
    'Sisdol Buffer 300' : sisdolBuffer300,
    'Sisdol Buffer 500' : sisdolBuffer500,
    'Sisdol Buffer 1000' : sisdolBuffer1000,
    'Sisdol Buffer 1400' : sisdolBuffer1400,
    'Buildings': buildingsLayerFromApi,
    'True Color': trueColorLayer,
    'True Color': trueColorLayer,
    'Thermal Layer': thermalLayer,
    'NDVI': ndvi,
    'Landfill Gases': geojson,
    'Effected Buildings': effectedBuildings,
}



legend.addTo(map);
legendEB.addTo(map);
L.control.layers(baseMaps1, renderedMap).addTo(map);





// printing map 















