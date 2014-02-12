var map;

function initmap() {

	map = new L.Map('map');
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 12, maxZoom: 15, attribution: osmAttrib});	
        
        var hawker = new L.KML("./data/Healthier_hawker_centres.kml", {async: true});
        
        var connector = new L.KML("./data/ParkConnectorsandlinksSingapore.kml", {async: true});
        
        population_map = L.geoJson(population, {style: style}).addTo(map);
        
        var exercise_markers = L.geoJson().addTo(map);
        
        var markers_cluster = L.markerClusterGroup();
        
        for (var i = 0; i < exercise.features.length; i++) {
            var a = exercise.features[i];
            var title = a.properties.Name;
            var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { title: title });
            marker.bindPopup(title);
            exercise_markers.addLayer(marker);
            markers_cluster.addLayer(marker);
        }
        
	map.setView(new L.LatLng(1.352083, 103.819836),12);
	map.addLayer(osm);
        //map.addLayer(markers);
	map.addControl(new L.Control.Layers({'Chloropeth': population_map}, {'Exercise Facilities':exercise_markers, 'Exercise Facilities(Cluster)':markers_cluster, 'Healthy Hawkers':hawker, 'Park Connectors':connector}));

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 27430, 54860, 82291, 109721],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);
}

function getColor(d) {
    return d > 109721.6 ? '#b30000' :
           d > 82291.2  ? '#e34a33' :
           d > 54860.8  ? '#fc8d59' :
           d > 27430.4  ? '#fdcc8a' :
                          '#fef0d9';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Census2000_TOTALPOP),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
