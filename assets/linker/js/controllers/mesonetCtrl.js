/*jslint node: true */
app.controller('MesonetCtrl', function MesonetCtrl($scope, $modal, sailsSocket, $log, $compile, $timeout, $http){
  mesonet.init();
  $('#main-nav').css('display','block');
  var elevator = new google.maps.ElevationService();
  $scope.loggedIn = false;
  $scope.user = {};
  $scope.stations = [];
  $scope.mesoMap = {};
  $scope.addMarker = false;
  $scope.editable = false ;
  $scope.saveChanged = '';
  $scope.userStationsLoaded = false;
  $scope.vis = {};
  $scope.vis.primary= false;
  $scope.vis.main = false;
  $scope.vis.user = false;

  $scope.$on('sailsSocket:connect', function(ev, data) {
    // Get Session Status
    sailsSocket.get(
      '/admin/getStatus', {},
      function(response) {
				if(response.status == 'loggedIn'){
					$scope.loggedIn = true;
					$scope.user = response.userInfo;
					$scope.getUserStations();

				}else{
					sailsSocket.get(
					'/mesoMap/4',{},
					function(response){
							
							$scope.mesoMap = response.id;
							$scope.stations = response.mapData;
							
							mesoStation.stations = $scope.stations;
							
							mesoStation.drawStations($scope.vis);
							mesoStation.setDraggable(false);
							$scope.markers = mesoStation.markers;
							
							$scope.bindMarkers($scope.editable);
							
				});
			}
    });
  });

  var userStationLegend = function(){
  	$('img[alt="user"]').hide();
  	$('#economic').append('<li><a style="height:35px; cursor:pointer;" id="users" class="secret">User Stations</a></li>');
  	$('#economic li a#users').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).removeClass('active-secret');
			$('img[alt="user"]').hide(500);
			$('#'+$(this).attr('id')+'_legend').hide(500);
		}else{
			if($(this).hasClass('secret')){
				$(this).addClass('active-secret');
			}
			$(this).addClass('active');
			$('img[alt="user"]').show(500);
			$('#'+$(this).attr('id')+'_legend').show(500);
		}
	});
	
  }
  $scope.getUserStations = function(){
		if($scope.user.mapId != -1 && $scope.user.mapId !== null){
			sailsSocket.get(
				'/mesoMap/4',{},
				function(response){
						$scope.mesoMap = response;
						$scope.stations = response.mapData;
						//console.log('getUserStations',$scope.user.stations);
						if($scope.user.stations){
							if($scope.user.stations.length > 0){
								$scope.user.stations.forEach(function(station){
									$scope.stations.push(station);
								});
							}
						}
						mesoStation.stations = $scope.stations;
						
						
						if($scope.user.accessLevel == 1) {
							$scope.editable = true;
							sailsSocket.get(
								'/mesomap/userStations',{},
								function(response){
									var actualStations = [];
									response.forEach(function(userStations){
										if(userStations.stations.length >= 1){
											userStations.stations.forEach(function(station){
												station.username = userStations.username;
												station.name = station.id + " " +userStations.username;
												actualStations.push(station);
											})
										}
									});
									actualStations.forEach(function(d){
										$scope.stations.push(d);
									});
									mesoStation.drawStations($scope.vis);
									if(!$scope.userStationsLoaded){
										userStationLegend();
										$scope.userStationsLoaded = true;
									}
									mesoStation.setDraggable($scope.editable);
									$scope.markers = mesoStation.markers;
									$scope.bindMarkers($scope.editable);
								}
							);
							
							

						}else{
							mesoStation.drawStations($scope.vis);
							mesoStation.setDraggable($scope.editable);
							$scope.markers = mesoStation.markers;
							$scope.bindMarkers($scope.editable);
						}
					
			});
		}else{
			$scope.newMap();
		}
	};

	$scope.exportComments = function (){
		sailsSocket.get('/comment/',
			function(response){
				var output  = [['user','station_id','type','body','1st Tier?','createdAt']];
				response.forEach(function(comment){
					if(!comment.primary){
						comment.primary = '';
					}
					output.push([comment.username,comment.userId+"_"+comment.stationId,comment.type,comment.body,comment.primary,comment.createdAt]);
				})
				downloadCSV(output,"mesonet_comments.csv",'#export_comments');
			}
		);
		
	};

	$scope.exportStations = function(){
		var output = [['id','name','type','elevation','lat','lng','Assembly_District','Congressional_District','County_Name','HU8_Name','HU10_Name','RadarSite_1_5km','RadarSite_1km','RadarSite_2km','Senate_District','ad_name','cd_name']];
		$scope.stations.forEach(function(station){
			if(!station.elevation){
				station.elevation = 0;
			}
			ad_name = '';
			if(typeof station.ad_name != 'undefined') ad_name = station.ad_name.replace(',',' ');
			output.push([station.id,station.name,station.type,station.elevation,station.lat,station.lng,station.Assembly_District,station.Congressional_District,station.County_Name,station.HU8_Name,station.HU10_Name,station.RadarSite_1_5km,station.RadarSite_1km,station.RadarSite_2km,station.Senate_District,ad_name,station.cd_name]);
		});
		downloadCSV(output,"meso_stations.csv",'#export_csv');
		
	};

	function downloadCSV(output,filename,container){
		var csvContent = "data:text/csv;charset=utf-8,";
		output.forEach(function(infoArray, index){
			dataString = infoArray.join(",");
			csvContent += dataString+ "\n";
		});
		if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ){
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", filename);
			link.setAttribute('target', '_blank');
			link.click();
		}else{
			var encodedUri = encodeURI(csvContent);
			//window.open(encodedUri);
			 $(container)
            .attr({
            'download': filename,
            'href': encodedUri,
            'target': '_blank'
        });
		}
	};
    
	mesonet.map.on('click',function(e){
		if($scope.addMarker){
			
			var old_station =  $scope.stations[$scope.stations.length-1];
			var new_station = {};
			new_station.id = old_station.id + 1;
			new_station.currentIndex = old_station.currentIndex+1;
			new_station.name = "Station "+new_station.id;
			new_station.lat = e.latlng.lat;
			new_station.lng = e.latlng.lng;

			var marker = {};
			new_station.type='user';
			marker = new L.marker(e.latlng, {icon:mesoStation.userIcon, draggable:true});	
			
			mesonet.map.addLayer(marker);
			new_station.marker = marker;
			$scope.stations.push(new_station);
			////console.log('add station, last station',new_station)
			if(!$scope.user.stations){
				$scope.user.stations = [];
			};
			////console.log('add station before push',$scope.user.stations);	
			$scope.user.stations.push(new_station);
			////console.log('add station after push',$scope.user.stations);	
			$scope.markers.push(marker);
			
			var newScope = $scope.$new();
			var n = $compile('<div popup station="stations['+($scope.stations.length-1)+']" editable="'+true+'" mapId="'+$scope.mesoMap.id+'" saved="'+false+'"></div>')(newScope);
			marker.bindPopup(n[0]);

			marker.on('dragend', function(event){
				var emarker = event.target;
				$scope.stations[$scope.stations.length-1].lng = emarker._latlng.lng;
				$scope.stations[$scope.stations.length-1].lat = emarker._latlng.lat;
				getElevation($scope.stations[$scope.stations.length-1].lat, $scope.stations[$scope.stations.length-1].lng,$scope.stations.length-1);
				$scope.$apply();
			});

			marker.on('click',function(event){
				if(!$scope.stations[$scope.stations.length-1].elevation){
					getElevation($scope.stations[$scope.stations.length-1].lat, $scope.stations[$scope.stations.length-1].lng,$scope.stations.length-1);
				}
				sailsSocket.get('/comment/find',{"where":{"mapId":$scope.mesoMap.id,"stationId":$scope.stations[$scope.stations.length-1].id}},
					function(response){
						$scope.stations[$scope.stations.length-1].comments = response;
					});
			});

			$scope.addMarker = false;
			$('#map').css('cursor','');
		}else{
		
			////console.log('no add click');
		
		}
	});

	$scope.$on('sailsSocket:message', function(ev, data) {

    $log.debug('New comet message received :: ', data);
  
  });
  
	// $scope.loadStops = function(){
	//	console.log('load stops',mesonet.stations);
	//	sailsSocket.post('/mesomap',{mapData:mesonet.stations,userId:$scope.user.id},function(response){
	//		console.log(response);
	//	})
	// };
	
	
    

	$scope.saveChanges = function(){
		$scope.vis.primary= $('img[alt="primary"]').is(':visible');
		$scope.vis.main = $('img[alt="main"]').is(':visible');
		$scope.vis.user = $('img[alt="user"]').is(':visible');

		if($scope.user.accessLevel == 1){
			//console.log($scope.stations);
						var removeUs = [];
			$scope.stations.forEach(function(station,index){
				if(station.type == 'user'){
					//console.log(index);
					removeUs.push(station);
				}
			})
			//console.log($scope.stations.length-removeUs.length,removeUs.length);
			$scope.stations.splice($scope.stations.length-removeUs.length,removeUs.length);
			$scope.mesoMap.mapData = $scope.stations;
			$scope.mesoMap.mapData.forEach(function(d){
				d.marker = [];
				delete d.comments;
			});
			sailsSocket.put(
				'/mesoMap/',$scope.mesoMap,
				function(response){
					
					$scope.saveChanged = 'Changes Saved';
					$timeout(function(){
	           $scope.saveChanged = '';
	        },3000);
			});
		}
		$scope.user.stations.forEach(function(d){
			d.marker = [];
			delete d.comments;
		});
		sailsSocket.put(
			'/user/'+$scope.user.id,$scope.user,
			function(response){
				//console.log('save changes',$scope.user.stations);
				sailsSocket.get('/user/'+$scope.user.id,function(response){
					$scope.user.stations = response.stations;
					$scope.getUserStations();	
				})
				$scope.saveChanged = 'Changes Saved';
				$timeout(function(){
           $scope.saveChanged = '';
        },3000);
				
			});
		
					
	};

	$scope.newMap = function(){
		sailsSocket.get(
			'/mesoMap/1',{},
			function(response){
				
				var newMap = {};
				newMap.mapData = response.mapData;
				newMap.userId = $scope.user.id;
				sailsSocket.post('/mesoMap/',newMap,function(created){
				
					$scope.user.mapId = created.id;
					sailsSocket.put('/user/'+$scope.user.id, $scope.user,
						function(done) {
							$scope.getUserStations();
					});
				});
		});
	};
	$scope.$on('viewComment',function(evt,station_id){
		var station_index = -1;
		$scope.stations.forEach(function(d,i){
			if(d.id == station_id){
				station_index = i;
			}
		});
		var modalInstance = $modal.open({
	      templateUrl: 'ViewCommentModalContent.html',
	      controller: ViewCommentModalCtrl,
	      resolve: {
					comments: function () { return $scope.stations[station_index].comments; },
	      }
	    });
	});

	$scope.$on('comment', function(evt,value){
		$scope.current_station = value;
		var modalInstance = $modal.open({
	      templateUrl: 'CommentModalContent.html',
	      controller: CommentModalCtrl,
	      resolve: {
				user: function () { return $scope.user; },
	        	station_id: function () { return $scope.current_station; },
	        	map_id: function () { return $scope.mesoMap.id; }
	      }
    	});
		modalInstance.result.then(function (result) {
			//if()
		});
	});

	$scope.$on('delete_station', function (evt, value) {
		var delete_index = -1;
		$scope.stations.forEach(function(d,i){
			if(d.id == value){
				delete_index = i;
			}
		});
		mesonet.map.removeLayer($scope.stations[delete_index].marker);
		$scope.markers.splice(delete_index,1);
		var deleted_station = $scope.stations.splice(delete_index,1)[0];

		//console.log(deleted_station.type);
		if(deleted_station.type == 'user'){
    	//console.log('is user');
    	if(deleted_station.comments && deleted_station.comments instanceof Array ){
    		deleted_station.comments.forEach(function(comment){
    			//console.log('comment');
    			sailsSocket.delete('/comment/'+comment.id,function(response){
    				//console.log('deleted comment'+comment.id,response);
    			})
    		})
    	}
    	var user_delete_index;
    	$scope.user.stations.forEach(function(d,i){
				if(d.id == value){
					user_delete_index = i;
				}
			});
			//console.log('user delete index');
			$scope.user.stations.splice(user_delete_index,1);
			$scope.user.stations.forEach(function(d){
				d.marker = [];
				delete d.comments;
			});
			$scope.saveChanges();
			$timeout(function(){
       $scope.getUserStations();
    	},3000);
		}		
		$scope.bindMarkers($scope.editable);
		$scope.saveChanged = 'Deleted Station '+value;
		$timeout(function(){
       $scope.saveChanged = '';
    },3000);

	
	});

	$scope.bindMarkers = function(editable){
		
		$scope.markers.forEach(function(marker,i){
			var current_editable = editable;
			if($scope.stations[i].type == 'user') { 
				current_editable = true;
				marker.dragging.enable();
			}
			$scope.stations[i].currentIndex = i;
			$scope.stations[i].marker = marker;
			var newScope = $scope.$new();
			var e = $compile('<div popup station="stations['+i+']" editable="'+current_editable+'" mapId="'+$scope.mesoMap.id+'" saved="'+true+'"></div>')(newScope);
			marker.bindPopup(e[0]);

			marker.on('dragend', function(event){
				var emarker = event.target;
				$scope.stations[i].lng = emarker._latlng.lng;
				$scope.stations[i].lat = emarker._latlng.lat;
				getElevation($scope.stations[i].lat, $scope.stations[i].lng,i);
				$scope.$apply();
			});
			marker.on('click',function(event){
				if(!$scope.stations[i].elevation){
					getElevation($scope.stations[i].lat, $scope.stations[i].lng,i);
				}
				if($scope.user.accessLevel == 1){
					sailsSocket.get('/comment/find',{"where":{"mapId":$scope.mesoMap.id,"stationId":$scope.stations[i].id}},
					function(response){
						$scope.stations[i].comments = response;
					});
				}else{
					sailsSocket.get('/comment/find',{"where":{"mapId":$scope.mesoMap.id,"stationId":$scope.stations[i].id,"userId":$scope.user.id}},
					function(response){
						$scope.stations[i].comments = response;
					});
				}
				
			});
		});
	};

	$scope.pullData = function(){
		console.log("pulling data yo.");
		$scope.stations.forEach(function(station){
			sailsSocket.post('/geodata/getInfo', {coords:[station.lat, station.lng]}, function(newInfo){
				
				for(key in newInfo[0]){
					station[key] = newInfo[0][key]
				}
				console.log(station);
			})
		})
	}

	$scope.addStation = function(){
		$scope.addMarker = true;
		$('#map').css('cursor','crosshair');
	};

	function getElevation(lat,lng,i){
		var locations = [];
		var coords =  new google.maps.LatLng(lat, lng);
		locations.push(coords);
		var positionalRequest = {
			'locations': locations
		};
		elevator.getElevationForLocations(positionalRequest, function(results, status) {
			if (status == google.maps.ElevationStatus.OK) {
				// Retrieve the first result
				if (results[0]) {
					$scope.stations[i].elevation =  results[0].elevation.toFixed(2);
				}
			}
		});
		sailsSocket.post('/geodata/getInfo', {coords:[lat, lng]}, function(newInfo){
				for(key in newInfo[0]){
					$scope.stations[i][key] = newInfo[0][key];
				}
			})

	};
  
  //
  // Login modal
  //
  $scope.openModal = function () {
		var modalInstance = $modal.open({
      templateUrl: 'LoginModalContent.html',
      controller: LoginModalCtrl,
      resolve: {}
    });
    
    modalInstance.result.then(function (result) {
			if(result.user){ // Get Stations
				$scope.loggedIn = true;
				$scope.user = result.user;
				$scope.getUserStations();
				$('#layers_selector_user').show();
				$('#main-nav').show();

			}
    });
  };
  
  //
	// Log Out
	//
	$scope.logout = function () {
		sailsSocket.post('/logout', {},
			function(response) {
				$scope.user = {};
				$scope.loggedIn = false;
				mesoStation.setDraggable(false);
				$('#users').hide();
				$('#layers_selector_user').hide();
			});
	};
	
});

function CommentModalCtrl($scope, $modalInstance,sailsSocket,user,station_id,map_id) {
	$scope.message='';
	$scope.user = user;
	$scope.station_id = station_id;
	$scope.comment = {};
	$scope.comment.mapId = map_id;
	$scope.comment.stationId = station_id;
	$scope.comment.primary = '';

	if($scope.user.id){
	
		$scope.comment.userId = $scope.user.id;
		$scope.comment.username = $scope.user.username;
	
	} else { $scope.comment.userId = -1; }

	$scope.ok = function (action) {
		sailsSocket.post('/comment',$scope.comment,
			function(response){
				$modalInstance.close({comment_id : response.id});
		});
	};
	$scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

function ViewCommentModalCtrl($scope, $modalInstance,comments) {
	$scope.comments = comments;
	
  $scope.ok = function (action,u,p) {
			$modalInstance.close();
	};
}

function LoginModalCtrl($scope, $modalInstance,sailsSocket) {
	$scope.username='';
	$scope.password='';
	$scope.message='';
    
  $scope.ok = function (action,u,p) {
		sailsSocket.post('/socketLogin', {username: u,password:p},
			function(response) {
				if(response.status == 'failed'){
					$scope.message = response.message;
				}else{
					$modalInstance.close({ user: response.user_info});
				}
		});
		
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

 
}