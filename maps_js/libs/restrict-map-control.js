function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function RestrictMap(minZoom, maxZoom, boundingBox) {
	nokia.maps.map.component.Component.call(this);
	this.init(minZoom, maxZoom, boundingBox);
}
extend(RestrictMap,
		nokia.maps.map.component.Component);


RestrictMap.prototype.init = function (minZoom, maxZoom, boundingBox) {	
	var that = this;
	that.set("boundingBox", boundingBox);
	that.set("minZoom", minZoom);
	that.set("maxZoom", maxZoom);
	
	EventHandlers = function(ctx) {	 
		var that = ctx;
		this.restrictCenter = function(evt){
			if (that.__map.center.latitude > that.boundingBox.topLeft.latitude
				|| that.__map.center.longitude < that.boundingBox.topLeft.longitude
				|| that.__map.center.latitude < that.boundingBox.bottomRight.latitude
				|| that.__map.center.longitude > that.boundingBox.bottomRight.longitude) {
			
				var latitude =  Math.max(Math.min(that.__map.center.latitude,
					 that.boundingBox.topLeft.latitude), that.boundingBox.bottomRight.latitude);
				var longitude = Math.min(Math.max(that.__map.center.longitude, 
					that.boundingBox.topLeft.longitude), that.boundingBox.bottomRight.longitude);    
				that.__map.setCenter(new nokia.maps.geo.Coordinate(latitude,longitude));      
				evt.cancel();
			}
		}
		this.restrictZoom = function(obj, key, newValue, oldValue) {
			if (newValue < that.minZoom){
	 	 		that.__map.set("zoomLevel", that.minZoom);
			}
			if (newValue > that.maxZoom){
				 that.__map.set("zoomLevel", that.maxZoom);
			}
		}
	}
	
	that.eventHandlers = new EventHandlers(that);
}

RestrictMap.prototype.attach = function (map) {
	this.__map = map;
	
	

	map.addListener("dragend", this.eventHandlers.restrictCenter);
	map.addListener("drag",this.eventHandlers.restrictCenter);
	map.addListener("mapviewchange", this.eventHandlers.restrictCenter);
	map.addListener("mapviewchangeend", this.eventHandlers.restrictCenter);
	map.addListener("mapviewchangestart", this.eventHandlers.restrictCenter);

	map.addObserver("zoomLevel",  this.eventHandlers.restrictZoom);
};

RestrictMap.prototype.detach = function(map){
	map.removeListener("dragend",  this.eventHandlers.restrictCenter);
	map.removeListener("drag",  this.eventHandlers.restrictCenter);
	map.removeListener("mapviewchange", this.eventHandlers.restrictCenter);
	map.removeListener("mapviewchangeend",  this.eventHandlers.restrictCenter);
	map.removeListener("mapviewchangestart",  this.eventHandlers.restrictCenter);

	map.removeObserver("zoomLevel",  this.eventHandlers.restrictZoom);
	this.__map = null;
	
};

RestrictMap.prototype.getId = function () {
	return 'RestrictMap';
};
RestrictMap.prototype.getVersion = function(){
		return '1.0.0';
}; 





