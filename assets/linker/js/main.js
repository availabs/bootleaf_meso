var mesonet = {
  map:{},
  sidebar:{},
  init:function(){
    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");
     
    var mapquestOAM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 20,
      //subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 20,
      //subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    })]);

    var rainfall = L.tileLayer('http://vis.availabs.org/mesonet/data/tiles/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 10,tms: true,opacity:0.5});
    var floodplains = L.tileLayer('http://vis.availabs.org/mesonet/data/flood_planes/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 12,tms: true,opacity:1});
    
    mesonet.map = L.map("map", {
          center: [42.76314586689494,-74.7509765625],
          zoom: 7,
      layers: [mapquestOSM]
    });

   

    var baseLayers = {
      "Street Map": mapquestOSM,
      "Aerial Imagery": mapquestOAM,
      "Imagery with Streets": mapquestHYB,
      //"Rainfall": rainfall,
      //"Flood Plains": floodplains
    };
    
   
    /*var overlayMaps = {
    "<span class='rainfall'>Rainfall</span>":rainfall,
    "<span class='floodplains'>Flood Hazard Zones</span>":floodplains

    };
    */
    
    var layerControl = L.control.layers(baseLayers, {}, {
      collapsed: true
    }).addTo(mesonet.map);

    
    L.control.scale().addTo(mesonet.map);
   
    mesonet.map.addLayer(rainfall);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',4).attr('id','rainfall').hide();
    mesonet.map.addLayer(floodplains);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',4).attr('id','floodplain').hide();   

     var sidebarLoaded = false; 
    $("#layers").click(function(){
      if(!sidebarLoaded){
        mesonet.sidebar = L.control.sidebar('sidebar', { position: 'left'});
        mesonet.map.addControl(mesonet.sidebar);
        sidebarLoaded = true;
        mesonet.sidebar.show();
      }else{
        mesonet.sidebar.toggle();
      }
    });

   

    $( "#zoom" ).click(function(map) {
      mesonet.map.setView([42.76314586689494,-74.7509765625], 7);
    });
      /* Highlight search box text on click */
    /*
    $("#searchbox").click(function () {
      $(this).select();
    });*/
   

    popup.init();
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


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
var popup = {

    init : function() {

    // position popup
    //windowW = $(window).width();
    $("#map").on("mousemove", function(e) {
      
      var x = e.pageX + 20;
      var y = e.pageY;
      var windowH = $(window).height();
      if (y > (windowH - 100)) {
        y = e.pageY - 100;
      } else {
        y = e.pageY - 20;
      }

      $("#info").css({
        "left": x,
        "top": y
      });
    });

  }

};