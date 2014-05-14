app.controller('sidebarCtrl', function sidebarCtrl($scope, sailsSocket, $http){


  $scope.Layers = [
   {
        name:"Stations", 
        layers:[
          {selector:'img[alt="primary"]',name:'Phase I Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="main"]',name:'Proposal Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="user"]',name:'User Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="userL2"]',name:'Committee Stations',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="phaseIIa"]',name:'Phase II (Batch 1)',loaded:true,visible:false,type:'leaflet'},
          {selector:'img[alt="phaseIIb"]',name:'Phase II (Batch 2)',loaded:true,visible:false,type:'leaflet'}
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
          {name:'Wind Farms',selector:'wind_stations', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#551a8b'},mouseover:{info:[{name:"",prop:"FarmName"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'NADP Sites',selector:'nadp', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#000000'},mouseover:{info:[{name:"Name: ",prop:"Name"},{name:"Operating Agency: ",prop:"Operating Agency"},{name:"Elevation (m): ",prop:"Elev. (m)"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}}        ]
    },
    {
        name:'Department of Environmental Protection', 
        layers:[
          {name:'DEP Land',selector:'dep_land', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4',fill:'#00FF3A'},mouseover:{info:[{name:"<strong>Municipality: ",prop:"MuniName"},{name:"</strong>SWIS_SBL: ",prop:"SWIS_SBL"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'DEP Snow Stations',selector:'dep_snow', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#BCFFF4'},mouseover:{info:[{name:"<strong>",prop:"Site_name"}, {name:"</strong>Basin: ",prop:"Basin"}, {name:"Elevation: ",prop:"Elev"},  {name:"Owner: ",prop:"Owner"}, {name:"Configuration: ",prop:"Configuration"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'DEP Meterological Stations',selector:'dep_met', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#87FF94'},mouseover:{info:[{name:"<strong>",prop:"Site_name"},{name:"</strong>Basin: ",prop:"Basin"},{name:"Elevation: ",prop:"Elev"}, {name:"Owner: ",prop:"Owner"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}}

        ]
    },
    {
        name:'Canal Corporation', 
        layers:[
          {name:'Canal Precip Gauges',selector:'cc_rainfall', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#FF00E3'},mouseover:{info:[{name:"Source: ",prop:"Source"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Water Level Gauges',selector:'water', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#FF9500'},mouseover:{info:[{name:"Gauge ID: ",prop:"GAGE"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Corp Structures',selector:'cc_struct', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#000000'},mouseover:{info:[{name:"Structure Name: ",prop:"STRUCT_NAM"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Canal Corporation Land',selector:'cc_land', loaded:false, visible:false, type:'d3',style:{opacity:'0.5',cursor:'pointer',fill:'#FF9500', stroke:'black','stroke-width':'1px'},mouseover:{info:[{name:"Canal Corporaton Land"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}}

        ]
    },
     {
        name:'NYS Thruway', 
        layers:[
          {name:'Thruway Land',selector:'thru_land', loaded:false, visible:false, type:'d3',style:{opacity:'0.5',cursor:'pointer',fill:'#ff0', stroke:'black','stroke-width':'1px'},mouseover:{info:[{name:"Thruway Land"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}}},
          {name:'Fiber Optic Access Points',selector:'fiber_access', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#77FFC6'},mouseover:{info:[{name:"Fiber Access Point: ",prop:"OBJECTID"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'Fiber Optic Regen Points',selector:'fiber_regen', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#FF00E3'},mouseover:{info:[{name:"Fiber Regen Point"},{name:"Milepost: ",prop:"MILEPOINT"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}},
          {name:'NYS Thruway Buildings',selector:'thru_build', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'0px',fill:'#551a8b'},mouseover:{info:[{name:"Division: ",prop:"DIVISION"},{name:"Description:  ",prop:"DESCRIPTIO"}],style:{cursor:'pointer',stroke:'black', stroke:'red','stroke-width':'2px'}}}
        ]
    },
    {
        name:'Political Boundaries', 
        layers:[
          {name:'County Population',selector:'county', loaded:false, visible:false, type:'d3',style:{cursor:'pointer',stroke:'black','stroke-width':'2',opacity:'0.4'},mouseover:{info:[{name:"Population: ",prop:"P0010001"},{name:"Name: ",prop:"NAME"}],style:{opacity:'.6',stroke:'red','stroke-width':'4px'}},choropleth:{key:'P0010001', range:["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"]}},
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
          {name:'Average Rainfall',selector:'rainfall', loaded:true, visible:false, type:'d3'},
          {name:'Flood Hazard Zones',selector:'floodplains', loaded:true, visible:false, type:'d3'}
        
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

  
  $scope.oneAtATime = true;
  
  $scope.layerClick=function(layer){
    var typeSelect = "#";
    if(layer.type == 'leaflet'){typeSelect = '';}
        
      if(!layer.loaded){
      $http.post('/geodata/getLayer', {selector:layer.selector}).success(function(geoData){
        var options = {layerId:layer.selector};
        if(typeof layer.mouseover != 'undefined'){
          options.mouseover = layer.mouseover;

        }
        if(typeof layer.style != 'undefined'){
          options.style = layer.style;
        }
        if(typeof layer.choropleth != 'undefined'){
          var data = [],min,max;
          if (geoData.type == "Topology") {
            geoData = root.topojson.feature(geoData, geoData.objects.features);
          }
          geoData.features.forEach(function(feature){
            data.push(feature.properties[layer.choropleth.key]*1);
          })
          min=d3.min(data);
          max=d3.max(data);
          console.log(data,min,max);
          var legend_domain = d3.scale.quantile()
            .domain([min,max/5])
            .range(layer.choropleth.range);

          var color = d3.scale.threshold()
            .domain(legend_domain.quantiles())
            .range(layer.choropleth.range.reverse());

          options.choropleth = {scale:color,key:layer.choropleth.key};
          leafletLegend(color,layer);
        }
     
      
       mesonet.map.addLayer(new L.GeoJSON.d3(geoData,options));
      
        if(typeof layer.style != 'undefined'){
          for(key in layer.style){
            $('#'+ layer.selector+' path').css(key,layer.style[key]);
          }
        }
      
        layer.loaded=true;
        layer.visible=true;
        if(typeof layer.choropleth == 'undefined'){
        $('#legend-list').append('<li id="'+layer.selector+'_legend"><svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="'+layer.style.fill+'" class="'+layer.selector+'""></circle><</svg><span>'+layer.name+'</span></li>');
        }
      });
  
    }else if(layer.visible){
      $(typeSelect+ layer.selector).fadeOut(600);
      $('#'+ layer.selector+'_legend').hide();
      layer.visible=false;
    }else {
      $(typeSelect+ layer.selector).fadeIn(600);
      $('#'+ layer.selector+'_legend').show();
      rainfallLegend(layer);
      layer.visible=true;
    }    
  }

  leafletLegend = function(scale,layer){
    var legendText ='<span id="'+layer.selector+'_legend"><li>'+layer.name+'</li>';
    var prev = 0;
    var numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"];
   // console.log(scale.domain());
    scale.domain().forEach(function(d,i){
      
      if(i === 0){
        legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[i]+'"></rect></svg><span>&lt;= '+number_format(scale.domain()[i].toFixed(0))+' </span></li>';
      }
      else{
        legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[i]+'"></rect></svg><span> '+number_format(scale.domain()[i-1].toFixed(0))+' - '+number_format(scale.domain()[i].toFixed(0))+'</span></span></li>';
      }
    });
    
    legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+layer.choropleth.range[scale.domain().length]+'"></rect></svg><span>&gt; '+number_format(scale.domain()[scale.domain().length-1].toFixed(0))+'</span></li>';
      
    legendText +="</span>";
   
    $('#legend-list').append(legendText);
    
  }

  rainfallLegend=function(layer){
    var legendText ='<span id="'+layer.selector+'_legend"><li>'+layer.name+'</li>';
    var rainfall_legend = [{'value':84962.7,'color':'rgba(26,150,65,255)'},{'value':99541.8,'color':'rgba(166,217,106,255)'},{'value':114121,'color':'rgba(255,255,192,255)'},{'value':128700,'color':'rgba(253,174,97,255)'},{'value':143279,'color':'rgba(215,25,28,255)'}];
    if(layer.selector == 'rainfall'){
      $('#rainfall_legend').remove();
      rainfall_legend.forEach(function(d,i){
        if(i === 0){
          legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+d.color+'"></rect></svg><span>&lt;= '+(rainfall_legend[i].value * 0.000393701).toFixed(2)+'\" </span></li>';
        }
        else{
          legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+d.color+'"></rect></svg><span> '+(rainfall_legend[i-1].value * 0.000393701).toFixed(2)+'\" - '+(rainfall_legend[i].value * 0.000393701).toFixed(2)+'\"</span></span></li>';
        }
      });
      $("#legend-list").append(legendText);
    }   
  }
  
  
  $scope.hideLayers=function(Layers){
  
    currentLayer = $scope.Layers;
    currentLayer.forEach(function(currentLayer){
      currentLayer.layers.forEach(function(layer){
        var typeSelect = "#";
        if(layer.type == 'leaflet'){typeSelect = '';}
        if(layer.visible){
          $(typeSelect+ layer.selector).fadeOut(600);
          $('#'+ layer.selector+'_legend').fadeOut(600);
          layer.visible=false;
        }
      });
    });
   // mesonet.sidebar.toggle();
  
  }

  $scope.isVisible = function(layer){
    if(layer.visible){
      return "active";
    
    }
    return "";
  }  

})

//------------------------------------------------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------------------------------------------------
function number_format(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
