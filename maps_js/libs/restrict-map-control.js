function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function RestrictMap(minZoom, maxZoom, boundingBox) {
	
var that = this;
this.__map;

this.boundingBox = boundingBox;
this.minZoom = minZoom;
this.maxZoom = maxZoom;


var restrictZoom = function(obj, key, newValue, oldValue) {
	 if (newValue < minZoom){
	 	 that.__map.set("zoomLevel", minZoom);
	 }
	 if (newValue > maxZoom){
	 	 that.__map.set("zoomLevel", maxZoom);
	 }
}


var restrictCenter = function(evt) {	 

 if (that.__map.center.latitude > that.boundingBox.topLeft.latitude
  	 || that.__map.center.longitude < that.boundingBox.topLeft.longitude
  	 || that.__map.center.latitude < that.boundingBox.bottomRight.latitude
  	 || that.__map.center.longitude > that.boundingBox.bottomRight.longitude) {

      var latitude =  Math.max(Math.min(that.__map.center.latitude, that.boundingBox.topLeft.latitude),
      	 that.boundingBox.bottomRight.latitude);
      var longitude = Math.min(Math.max(that.__map.center.longitude, that.boundingBox.topLeft.longitude), 
      	that.boundingBox.bottomRight.longitude);    
      that.__map.setCenter(new nokia.maps.geo.Coordinate(latitude,longitude));      
      evt.cancel();
  }
}



/////////////////////////////////////////////////////////////////////////
//
//   Now wire up the events by adding a single listener to the map.
//
//
this.attach = function (map) {
	that.__map = map;
	map.addListener("dragend", restrictCenter);
	map.addListener("drag", restrictCenter);
	map.addListener("mapviewchange", restrictCenter);
	map.addListener("mapviewchangeend", restrictCenter);
	map.addListener("mapviewchangestart", restrictCenter);

	map.addObserver("zoomLevel", restrictZoom);
};

this.detach = function(map){
	map.addListener("dragend", restrictCenter);
	map.addListener("drag", restrictCenter);
	map.addListener("mapviewchange", restrictCenter);
	map.addListener("mapviewchangeend", restrictCenter);
	map.addListener("mapviewchangestart", restrictCenter);

	map.addObserver("zoomLevel", restrictZoom);
	
};

this.getId = function () {
	return 'RestrictMap';
};
this.getVersion = function(){
		return '1.0.0';
}; 

};



