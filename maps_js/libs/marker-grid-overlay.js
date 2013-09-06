function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function MarkerGridOverlay (tileUrl, overlayMin, overlayMax) {
	nokia.maps.map.component.Component.call(this);
	this.init(tileUrl, overlayMin, overlayMax);
}

extend(MarkerGridOverlay,
		nokia.maps.map.component.Component);


MarkerGridOverlay.prototype.init = function(tileUrl, overlayMin, overlayMax) {
	that = this;
	that.tileUrl = tileUrl;
	that.overlayZoom = -1;
	that.max =  (overlayMax) ? overlayMax : 30;
	that.min = (overlayMin)? overlayMin : 0;
	that.container = new nokia.maps.map.Container();
	// Set the zIndex negative so we are behind all objects
	that.container.set ("zIndex", -9999);
	
	// This function calculates the row and column of the current tile
	// accordinfg to the normalised mercator projection.
	// This projectio is the commonest standard used for online maps.
	that.calculateColumnRow= function(coord) {
	
		var longitude = coord.longitude;
		var latitude = coord.latitude;
		longitude /= 360;
		longitude += 0.5;
		latitude = 0.5 - ((Math.log(Math.tan((Math.PI / 4) + (latitude * Math.PI/360))) / Math.PI) / 2.0);
		
		
		var column= Math.floor( longitude*that.tileWidth); 
		var row=Math.floor( latitude*that.tileWidth);    	
		return new nokia.maps.util.Point (column, row);     	 
	}
	
	// Adds an image marker 256 x 256 pixels anchored at the top left corner of the tile.
	that.addOverlayTiles = function(column, row) {
		column = column % that.tileWidth;

		/// This tile is anchored at: 
		var anchor = new nokia.maps.geo.Coordinate 
			( (180 / Math.PI) * ((2 * Math.atan(Math.exp(Math.PI * (1 - (2 * (row/that.tileWidth))))))
				 - (Math.PI / 2)),
			-180 + ((column * 360.0) / that.tileWidth));
		if (!that.isTileAdded(anchor)){
			var marker = new nokia.maps.map.Marker ( anchor,
				{ icon: tileUrl(column, row, that.overlayZoom)});
			that.container.objects.add ( marker);
		}
	}
		
		
	// Check to see if this image has already been addded to the collection.
	that.isTileAdded = function(coordinate) {		
		for (var i = 0;  i < that.container.objects.getLength(); i++) {
			if ( coordinate.equals(that.container.objects.get(i).coordinate)){
				return true;
			}
		}
		return false
	}
		

		
		
	// If the viewport is altered, recalculate the images associated to the overlay.
	that.eventHandler = function (evt) { 
		if(that.container.isAdded(map)){
			if (that.overlayZoom != map.zoomLevel){
				that.overlayZoom = map.zoomLevel;
				that.tileWidth= Math.pow(2, that.overlayZoom);
				that.container.objects.clear();
			}
			if (that.overlayZoom >= that.min  && that.overlayZoom <=  that.max){
			
				var viewPort = map.getViewBounds() ;  
				var topLeft = that.calculateColumnRow(viewPort.topLeft);
				var bottomRight = that.calculateColumnRow(viewPort.bottomRight );	       
				if (topLeft.x > bottomRight.x){
					topLeft.x = topLeft.x + that.tileWidth;
				}						
				for (var i =  topLeft.x; i < bottomRight.x + 1; i++){
					for (var j =  topLeft.y; j < bottomRight.y + 1; j++){
						that.addOverlayTiles(i,j);
						console.log("8");
					}	       		
				} 
			}	       						
		
		}       		
	};
}



MarkerGridOverlay.prototype.getId = function() { 
	return "MarkerGridOverlay";
};
	
MarkerGridOverlay.prototype.attach = function(map) {
	this.map = map;
	map.objects.add(this.container);
	map.addListener("mapviewchangeend", this.eventHandler); 
	map.addObserver("zoomLevel", this.eventHandler);
	this.eventHandler();
};

MarkerGridOverlay.prototype.detach = function(display) {
	this.map = null;
	map.objects.remove(this.container);
	map.removeListener("mapviewchangeend", this.eventHandler); 
	map.removeObserver("zoomLevel", this.eventHandler);

};

