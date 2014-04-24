var mesonet = {
  map:{},
  sidebar:{},
  init:function(){
    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["otile1", "otile2", "otile3", "otile4"],
      attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
    });
    var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
      maxZoom: 18,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
      attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
      maxZoom: 18,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
      attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    })]);

    mesonet.map = L.map("map", {
          center: [42.76314586689494,-74.7509765625],
          zoom: 7,
      layers: [mapquestOSM]
    });

    /* Larger screens get expanded layer control */
    if (document.body.clientWidth <= 767) {
      var isCollapsed = true;
    } else {
      var isCollapsed = false;
    }

    var baseLayers = {
      "Street Map": mapquestOSM,
      "Aerial Imagery": mapquestOAM,
      "Imagery with Streets": mapquestHYB
    };

    var layerControl = L.control.layers(baseLayers, {}, {
      collapsed: isCollapsed
    }).addTo(mesonet.map);

/*
    mesonet.sidebar = L.control.sidebar("sidebar", {
      closeButton: true,
      position: "left"
    }).addTo(mesonet.map);
      
*/
    /* Highlight search box text on click */
    $("#searchbox").click(function () {
      $(this).select();
    });

    /* Placeholder hack for IE */
    if (navigator.appName == "Microsoft Internet Explorer") {
      $("input").each(function () {
        if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
          $(this).val($(this).attr("placeholder"));
          $(this).focus(function () {
            if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
          });
          $(this).blur(function () {
            if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
          });
        }
      });
    }
  }
}
