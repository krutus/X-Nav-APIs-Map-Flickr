$(document).ready(function() {
	$("div#search button").click(addr_search);

    map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 16
    }).addTo(map);

    map.locate({setView: true, maxZoom: 14});
    
    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map).bindPopup("Tu posición").openPopup();
		L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);
});

addr_search = function () {
    var inp = document.getElementById("addr");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            items.push(
                "<li><a href='#' onclick='chooseAddr(" +
                val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
            '</a></li>'
            );
        });
        
        $('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Te refieres a:" }).appendTo('#results');
            $('<ul/>', {
            'class': 'my-new-list',
            html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
        
        $('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
        $("#close").click(function (){$("#results").empty();});
        
        var ciudad = $("#addr").val();
        console.log(ciudad);
        var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + ciudad + "&tagmode=any&format=json&jsoncallback=?";
        
        $.getJSON(urlFlickr, function(data) { 
            $.each( data.items, function( i, item ) {
                $( "<img>" ).attr( "src", item.media.m ).appendTo( "#results" );
                if ( i === 1 ) {
                    return false;
                }
            });
        });
        
        
    });
}


chooseAddr = function (lat, lng, type) {
    var location = new L.LatLng(lat, lng);
    map.panTo(location);

    if (type == 'city' || type == 'administrative') {
        map.setZoom(11);
    } else {
        map.setZoom(13);
    }
}




