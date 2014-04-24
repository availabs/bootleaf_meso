app.controller('sidebarCtrl', function sidebarCtrl($scope, sailsSocket, $http){


  $scope.Layers = [
   {
        name:"Stations", 
        layers:[
          {selector:'img[alt="primary"]',name:'First Stations',loaded:true,visible:false,type:'leaflet'}
        ]
    },
    {
        name:'Structures',
        layers:[
          {name:'ASOS Stations',selector:'asos_stations', loaded:false, visible:false, type:'d3'},
          {name:'SUNY/CUNY Schools',selector:'college', loaded:false, visible:false, type:'d3'},
          {name:'Public Libraries',selector:'libraries', loaded:false, visible:false, type:'d3'},
          {name:'Public Schools',selector:'schools', loaded:false, visible:false, type:'d3'},
          {name:'NYSNET CORS',selector:'nysnet', loaded:false, visible:false, type:'d3'},
          {name:'Wind Farms',selector:'wind_stations', loaded:false, visible:false, type:'d3'}
        ]
    },
    {
        name:'Canal Corporation', 
        layers:[
          {name:'Canal Precip Gauges',selector:'cc_rainfall', loaded:false, visible:false, type:'d3'},
          {name:'Canal Water Level Gauges',selector:'water', loaded:false, visible:false, type:'d3'},
          {name:'Canal Corp Structures',selector:'cc_struct', loaded:false, visible:false, type:'d3'},
          {name:'Fiber Optic Access Points',selector:'fiber_access', loaded:false, visible:false, type:'d3'},
          {name:'Canal Corp Land',selector:'cc_land', loaded:false, visible:false, type:'d3'}

        ]
    },
    {
        name:'Political Boundaries', 
        layers:[
          {name:'County Population',selector:'county', loaded:false, visible:false, type:'d3'},
          {name:'Congressional Districts',selector:'congress', loaded:false, visible:false, type:'d3'},
          {name:'State Assmebly Districts',selector:'assembly', loaded:false, visible:false, type:'d3'},
          {name:'Senate Districts',selector:'senate', loaded:false, visible:false, type:'d3'}
        ]
    },
    {
        name:'Hydrology', 
        layers:[
          {name:'MARFC SubBasins',selector:'marfc', loaded:false, visible:false, type:'d3'},
          {name:'NYS SubBasins (HUC 8)',selector:'huc8', loaded:false, visible:false, type:'d3'},
          {name:'NYS Watersheds (HUC 10)',selector:'huc10', loaded:false, visible:false, type:'d3'},
          {name:'Average Rainfall',selector:'rainfall', loaded:false, visible:false, type:'d3'},
          {name:'Flood Hazard Zones',selector:'asos_stations', loaded:false, visible:false, type:'d3'}
        
        ]
    },
    {
        name:'Radar Coverage', 
        layers:[
          {name:'Radar Coverage (1 km)',selector:'radar1km', loaded:false, visible:false, type:'d3'},
          {name:'Radar Coverage (1.5 km)',selector:'radar1_5km', loaded:false, visible:false, type:'d3'},
          {name:'Radar Coverage (2 km)',selector:'radar2km', loaded:false, visible:false, type:'d3'}
        ]
    }

  ];

  $scope.oneAtATime = false;
  $scope.layerClick=function(layer){
    var typeSelect = "#";
    if(layer.type == 'leaflet'){ typeSelect = '';}
    if(!layer.loaded){
      $http.post('/geodata/getLayer', {selector:layer.selector}).success(function(geoData){
        mesonet.map.addLayer(new L.GeoJSON.d3(geoData,{layerId:layer.selector}));
        layer.loaded=true;
        layer.visible=true;
        $('#legend-list').append('<li id="'+layer.selector+'_legend"><svg width="20" height="20"><circle cx="10" cy="10" r="7" class="'+layer.selector+'""></circle></svg><span>'+layer.name+'</span></li>');
      });
          
    }else if(layer.visible){
      $(typeSelect+ layer.selector).hide();
      $('#'+ layer.selector+'_legend').hide();
      layer.visible=false;
    }else {
      $(typeSelect+ layer.selector).show();
      $('#'+ layer.selector+'_legend').show();
      layer.visible=true;
    }
    
  }
  $scope.isVisible = function(layer){
    if(layer.visible){
      return "active";
    }
    return "";
  }  

})