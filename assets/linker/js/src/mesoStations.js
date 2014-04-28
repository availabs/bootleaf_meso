mesoStation = {
	markers : [],
	stations: [],
	icon_size : 20,
	draggable : false,
	mesoIcon:L.icon({iconUrl: '/linker/js/images/green.png',iconSize: [12, 12],iconAnchor: [ 12/2,12/2],popupAnchor: [0,0]}),
	sunyIcon:L.icon({iconUrl: '/linker/js/images/blue.png',iconSize: [12, 12],iconAnchor: [ 12/2,12/2],popupAnchor: [0,0]}),
	profilerIcon:L.icon({iconUrl: '/linker/js/images/orange.png',iconSize: [12, 12],iconAnchor: [ 12/2,12/2],popupAnchor:[0,0]}),
	pprofIcon:L.icon({iconUrl: '/linker/js/images/redsq.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	pcanalIcon:L.icon({iconUrl: '/linker/js/images/ylwsq.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	pneppIcon:L.icon({iconUrl: '/linker/js/images/grnsq.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	psunyIcon:L.icon({iconUrl: '/linker/js/images/bluesq.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	sprofIcon:L.icon({iconUrl: '/linker/js/images/redtri.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	scanalIcon:L.icon({iconUrl: '/linker/js/images/ylwtri.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	sdhsesIcon:L.icon({iconUrl: '/linker/js/images/greentri.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	ssunyIcon:L.icon({iconUrl: '/linker/js/images/bluetri.png',iconSize: [22, 22],iconAnchor: [ 22/2,22/2],popupAnchor: [0,0]}),
	high_impactIcon:L.icon({iconUrl: '/linker/js/images/high_impact.png',iconSize: [12, 12],iconAnchor: [ 12/2,24],popupAnchor:[0,-18]}),
	deficiencyIcon:L.icon({iconUrl: '/linker/js/images/deficient.png',iconSize: [24, 24],iconAnchor: [ 24/2,24],popupAnchor:[0,-18]}),
	other_sectorsIcon:L.icon({iconUrl: '/linker/js/images/beneficial.png',iconSize: [24, 24],iconAnchor: [ 24/2,24],popupAnchor:[0,-18]}),
	snowIcon:L.icon({iconUrl: '/linker/js/images/snowy.png',iconSize: [24, 24],iconAnchor: [ 24/2,24],popupAnchor:[0,-18]}),
	userIcon:L.icon({iconUrl: '/linker/js/images/imp_forecasting.png',iconSize: [24, 24],iconAnchor: [ 24/2,24],popupAnchor:[0,-18]}),
	drawStations : function(visability) {
		
		if(mesoStation.markers.length > 0) { mesoStation.clearMarkers(); }

		mesoStation.stations.forEach(function(d,i){
			
			var chosenIcon = {};
			var selectionType = '';
			switch(d.type){
				case "mesonet":
					chosenIcon = mesoStation.mesoIcon;
					selectionType = 'main';
					break;
				case "suny":
					chosenIcon = mesoStation.sunyIcon;
					selectionType = 'main';
					break;
				case "profiler":
					chosenIcon = mesoStation.profilerIcon;
					selectionType = 'main';
					break;
				case 'high-impact':
					chosenIcon = mesoStation.high_impactIcon;
					selectionType = 'main';
					break;
				case 'deficiency':
					chosenIcon = mesoStation.deficiencyIcon;
					selectionType = 'main';
					break;
				case 'other-sectors':
					chosenIcon = mesoStation.other_sectorsIcon;
					selectionType = 'main';
					break;
				case 'snow':
					chosenIcon = mesoStation.snowIcon;
					selectionType = 'main';
					break;
				case 'user':
					chosenIcon = mesoStation.userIcon;
					selectionType = 'user';
					break;
				case 'primary_Profiler':
					chosenIcon = mesoStation.pprofIcon;
					selectionType = 'primary';
					break;
				case 'primary_Canal':
					chosenIcon = mesoStation.pcanalIcon;
					selectionType = 'primary';
					break;
				case 'primary_NEPP':
					chosenIcon = mesoStation.pneppIcon;
					selectionType = 'primary';
					break;
				case 'primary_SUNY':
					chosenIcon = mesoStation.psunyIcon;
					selectionType = 'primary';
					break;
				case 'secondary_Profiler':
					chosenIcon = mesoStation.sprofIcon;
					selectionType = 'primary';
					break;
				case 'secondary_Canal':
					chosenIcon = mesoStation.scanalIcon;
					selectionType = 'primary';
					break;
				case 'secondary_DHSES':
					chosenIcon = mesoStation.sdhsesIcon;
					selectionType = 'primary';
					break;
				case 'secondary_SUNY':
					chosenIcon = mesoStation.ssunyIcon;
					selectionType = 'primary';
					break;
			}
			
			var station = L.marker([d.lat,d.lng],{icon:chosenIcon,draggable:mesoStation.draggable,alt:selectionType});
			mesoStation.markers.push(station);
	
		});
		mesoStation.setStations(visability);
	},
	setStations : function(visability) {
		mesoStation.markers.forEach(function(station,i){
			station.addTo(mesonet.map);
		});
		if(!visability.primary) $('img[alt="primary"]').hide();
		if(!visability.main) $('img[alt="main"]').hide();
		if(!visability.user) $('img[alt="user"]').hide();
	},
	setDraggable : function(true_or_false){
		mesoStation.draggable = true_or_false;
		mesoStation.markers.forEach(function(station,i){
			if(mesoStation.draggable){
				station.dragging.enable();
			}else{
				station.dragging.disable();
				//console.log(station.dragging.enabled());
			}
		});
	},

	

	clearMarkers : function(){
		mesoStation.markers.forEach(function(m){
			mesonet.map.removeLayer(m);
		});
		mesoStation.markers = [];
	},
	popupMarkup : function(index){
		var markup = '';
		return markup;
	}
};