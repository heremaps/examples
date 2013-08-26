

// An overlay object places images (usually from a tile server)
// over a map.
//
function MarkerGridOverlay(map, tileUrl, overlayMin, overlayMax) {
	var map_ = map;
	var tileUrl = tileUrl;
	var me_ = this;
	var overlayZoom = -1;
	var tileWidth;
	
	var label= "";
	var max = 30;
	var min = 0;
	
	
	// Alter the provider details if give.
	if (overlayMax){
		max = overlayMax;
	}
	if (overlayMin){
		min = overlayMin;
	}
	
	
	var node = document.createElement("div");
	node.id = 'nm_overlay_cp';
	map.getUIContainer().appendChild(node);
	
	var container = new nokia.maps.map.Container();
	// Set the zIndex negative so we are behind all
	container.set ("zIndex", -9999);
	
	// This function calculates the row and column of the current tile
	// accordinfg to the normalised mercator projection.
	// This projectio is the commonest standard used for online maps.
	function calculateColumnRow(coord) {
	
		var longitude = coord.longitude;
		var latitude = coord.latitude;
		longitude /= 360;
		longitude += 0.5;
		latitude = 0.5 - ((Math.log(Math.tan((Math.PI / 4) + (latitude * Math.PI/360))) / Math.PI) / 2.0);
		
		
		var column= Math.floor( longitude*tileWidth); 
		var row=Math.floor( latitude*tileWidth);    	
		return new nokia.maps.util.Point (column, row);     	 
	}
	
	// Adds an image marker 256 x 256 pixels anchored at the top left corner of the tile.
	function addOverlayTiles(column, row) {
		column = column % tileWidth;
		
		/// This tile is anchored at: 
		var anchor = new nokia.maps.geo.Coordinate 
			( (180 / Math.PI) * ((2 * Math.atan(Math.exp(Math.PI * (1 - (2 * (row/tileWidth)))))) - (Math.PI / 2)),
			-180 + ((column * 360.0) / tileWidth));
		
		if (!isTileAdded(anchor)){
			var marker = new nokia.maps.map.Marker ( anchor,
				{ icon: tileUrl(column, row, overlayZoom)});
			container.objects.add ( marker);
		}
	}
		
		
	// Check to see if this image has already been addded to the collection.
	function isTileAdded(coordinate) {
		
		for (var i = 0;  i < container.objects.getLength(); i++) {
			if ( coordinate.equals(container.objects.get(i).coordinate)){
				return true;
			}
		}
		return false
	}
		
		
		
	// Function to add the overlay to the map.
	this.add = function (){
		map.objects.add(container);
		zoomOrMoveEventHandler();
	}
	
	// Funciton to remove the overlay from the map.
	this.remove =  function (){
		map.objects.remove(container); 
	}
		
		
	// If the viewport is altered, recalculate the images associated to the overlay.
	var zoomOrMoveEventHandler = function (evt) { 
		if(container.isAdded(map)){
			if (overlayZoom != map.zoomLevel){
				overlayZoom = map.zoomLevel;
				tileWidth= Math.pow(2, overlayZoom);
				container.objects.clear();
			}
			if ( overlayZoom >= min  && overlayZoom <=  max){
				var viewPort = map.getViewBounds() ;  
				var topLeft = calculateColumnRow(viewPort.topLeft);
				var bottomRight = calculateColumnRow(viewPort.bottomRight );	       
				if (topLeft.x > bottomRight.x){
					topLeft.x = topLeft.x + tileWidth;
				}			       
			
				for (var i =  topLeft.x; i < bottomRight.x + 1; i++){
					for (var j =  topLeft.y; j < bottomRight.y + 1; j++){
						addOverlayTiles(i,j);
					}	       		
				} 
			}	       						
		
		}       		
	};
	
	// Add the event handler to both viewPort movement and zoom changes. 
	map.addListener("mapviewchangeend", zoomOrMoveEventHandler); 
	map.addObserver("zoomLevel", zoomOrMoveEventHandler);

}

