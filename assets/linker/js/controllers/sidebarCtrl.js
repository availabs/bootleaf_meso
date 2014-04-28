app.controller('sidebarCtrl', function sidebarCtrl($scope, sailsSocket, $http){


  $scope.Layers = [
   {
        name:"Stations", 
        layers:[
          {selector:'img[alt="primary"]',name:'First Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="main"]',name:'Proposal Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="user"]',name:'User Stations',loaded:true,visible:false,type:'leaflet'}
        ]
    },
    {
        name:'Structures',
        layers:[
          {name:'ASOS Stations',selector:'asos_stations', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#ff0'},mouseover:{info:[{name:"ASOS Station: ",prop:"Site"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'SUNY/CUNY Schools',selector:'college', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#0027FF'},mouseover:{info:[{name:"",prop:"LNAME"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Public Libraries',selector:'libraries', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#77FFC6'},mouseover:{info:[{name:"",prop:"NAME"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Public Schools',selector:'schools', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#00FF0E'},mouseover:{info:[{name:"",prop:"NAME"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'NYSNET CORS',selector:'nysnet', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#7967FF'},mouseover:{info:[{name:"",prop:"NAME"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Wind Farms',selector:'wind_stations', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#551a8b'},mouseover:{info:[{name:"",prop:"FarmName"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}}
        ]
    },
    {
        name:'Canal Corporation', 
        layers:[
          {name:'Canal Precip Gauges',selector:'cc_rainfall', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#FF00E3'},mouseover:{info:[{name:"Source: ",prop:"Source"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Water Level Gauges',selector:'water', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#FF9500'},mouseover:{info:[{name:"Gauge ID: ",prop:"GAGE"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Corp Structures',selector:'cc_struct', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#000000'},mouseover:{info:[{name:"Structure Name: ",prop:"STRUCT_NAM"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Fiber Optic Access Points',selector:'fiber_access', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#77FFC6'},mouseover:{info:[{name:"Fiber Access Point: ",prop:"OBJECTID"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Corp Land',selector:'cc_land', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',fill:'#ff0'},mouseover:{info:[{name:"Canal Corporaton Land",prop:""}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}}

        ]
    },
    {
        name:'Political Boundaries', 
        layers:[
          {name:'County Population',selector:'county', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#'},mouseover:{info:[{name:"HUC8",prop:"HUC8"},{name:"Name: ",prop:"Name"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Congressional Districts',selector:'congress', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#00FF3A'},mouseover:{info:[{name:"<strong>",prop:"NAMELSAD"},{name:"</strong>Representative: ",prop:"CD_Name"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'State Assmebly Districts',selector:'assembly', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#A748FF'},mouseover:{info:[{name:"<strong>",prop:"NAMELSAD"},{name:"</strong>Representative: ",prop:"AD_Name"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Senate Districts',selector:'senate', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#FFD929'},mouseover:{info:[{name:"",prop:"NAMELSAD"},{name:"</strong>Representative: ",prop:"Rep_Name"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}}
        ]
    },
    {
        name:'Hydrology', 
        layers:[
          {name:'MARFC SubBasins',selector:'marfc', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#FF6600'},mouseover:{info:[{name:"<strong>",prop:"name_long"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'NYS SubBasins (HUC 8)',selector:'huc8', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',opacity:'0.4',stroke:'black','stroke-width':'2',fill:'FF6600'},mouseover:{info:[{name:"<strong>",prop:"Name"},{name:"</strong>HUC8: ",prop:"HUC8"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'NYS Watersheds (HUC 10)',selector:'huc10', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#3399FF'},mouseover:{info:[{name:"HUC10:",prop:"HUC10"},{name:"Name: ",prop:"Name"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Average Rainfall',selector:'rainfall', loaded:false, visible:false, type:'leaflet'},
          {name:'Flood Hazard Zones',selector:'floodplains', loaded:false, visible:false, type:'leaflet'}
        
        ]
    },
    {
        name:'Radar Coverage', 
        layers:[
          {name:'Radar Coverage (1 km)',selector:'radar1km', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#00FF3A'},mouseover:{info:[{name:"<strong>",prop:"SiteName"},{name:"</strong>",prop:"cSiteICAO"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Radar Coverage (1.5 km)',selector:'radar1_5km', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#FF6600'},mouseover:{info:[{name:"<strong>",prop:"SiteName"},{name:"</strong>",prop:"cSiteICAO"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Radar Coverage (2 km)',selector:'radar2km', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#551a8b'},mouseover:{info:[{name:"<strong>",prop:"SiteName"},{name:"</strong>",prop:"cSiteICAO"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}}
        ] 
    }

  ];


  

  $scope.oneAtATime = false;
  $scope.layerClick=function(layer){
    var typeSelect = "#";
    if(layer.type == 'leaflet'){ typeSelect = '';}
    if(!layer.loaded){
      $http.post('/geodata/getLayer', {selector:layer.selector}).success(function(geoData){
        var options = {layerId:layer.selector};
        if(typeof layer.mouseover != 'undefined'){
          options.mouseover = layer.mouseover;
        }
        if(typeof layer.style != 'undefined'){
          options.style = layer.style;
        }
        mesonet.map.addLayer(new L.GeoJSON.d3(geoData,options));
        if(typeof layer.style != 'undefined'){
          for(key in layer.style){
            $('#'+ layer.selector+' path').css(key,layer.style[key]);
            
          }
     
        }
      
        layer.loaded=true;
        layer.visible=true;
        $('#legend-list').append('<li id="'+layer.selector+'_legend"><svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="'+layer.style.fill+'" class="'+layer.selector+'""></circle><</svg><span>'+layer.name+'</span></li>');
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