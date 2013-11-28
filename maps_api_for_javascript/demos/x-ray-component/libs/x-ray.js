function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function  XRayControl(width, height ) {
	nokia.maps.map.component.Component.call(this);
	this.init(width, height );
}
extend(XRayControl,
		nokia.maps.map.component.Component);


XRayControl.prototype.init= function (width, height ) {
	that = this;
	that.set("visible", true);
	that.set("width", width);
	that.set("height", height);

	that.__div  = document.createElement("div");
	that.__div.id = 'nm_x_ray';
	that.__div.style.width = width + 'px';
	that.__div.style.height = height + 'px';
	that.__div.style.position = 'absolute';
	that.__div.style.cursor = 'move';
	that.__div.style.border='3px solid white';
	that.__div.style.borderRadius= '3px'
	that.__div.style.boxShadow= '0 0 5px black'; 	  
		
	// Create an observer function that sets values on the second map
	that.setOverview = function (obj, key, value, oldValue) {
		if (key === "center") {
			that.__map2.set({ center: that.__map.pixelToGeo(that.__div.offsetLeft+100, that.__div.offsetTop+100)});
		} else if(key === "zoomLevel") {
			value = (value >= that.__map2.minZoomLevel) ? value : that.__map2.minZoomLevel;
			that.__map2.set(key, value);
		}
	};
	
	that.createSecondMap = function (map) {

		if (that.__map2 === undefined){
			that.__map2 = new nokia.maps.map.Display(that.__div, {
				center: map.center,
				zoomLevel: map.zoomLevel
			});
		}	
		that.__map2.set("baseMapType", map.SATELLITE);
	
	
		// Now we make the  overview map draggable
		var dragElt = nokia.maps.dom.EventTarget(
			nokia.maps.dom.EventTarget(that.__div)
		).enableDrag();
	
		// We install an event lister on dragging the element
		dragElt.addListener("drag", function (evt) {
			// Adds delta to the start position of overview map. 
			var newX = that.__div.offsetLeft + evt.deltaX,
			newY = that.__div.offsetTop + evt.deltaY;
		
		
			// We move the draggable container to it new position
			if (newX >  5 - that.width
				&& newY > 5 - that.height 
				&& newX < that.__map.width - 5
				&& newY < that.__map.height - 5){
					
				that.__div.style.left = newX + "px";
				that.__div.style.top = newY + "px";
				that.__map2.set({ center: that.__map.pixelToGeo(newX+100, newY+100) });
			}
		});
	
		// Initialize the map center and zoom level
		that.__map2.set({ center: that.__map.get("center"), 
			zoomLevel: (that.__map.get("zoomLevel")) });
	}
	
	that.addObserver("height", function(){
		that.__div.style.height = that.get('height') + 'px';});
	that.addObserver("visible", function(){
		var isVisible = that.get('visible');
		that.__div.style.display = isVisible ? 'block' : 'none';
	});
	that.addObserver("width", function(){
		that.__div.style.width = that.get('width') + 'px';
	});

}


XRayControl.prototype.attach = function (map) {
	this.__map = map;
	var controls = this.__map.getUIContainer().firstChild;
	var child = controls.firstChild;
	controls.insertBefore(this.__div, child);
	this.set("visible", true);
	this.createSecondMap(map);
	
	this.__map.addObserver("center",  this.setOverview);
	this.__map.addObserver("zoomLevel",  this.setOverview);
};
	
XRayControl.prototype.detach = function(map){
	this.__map.removeObserver("center",  this.setOverview);
	this.__map.removeObserver("zoomLevel",  this.setOverview);
	this.__map = null;
	this.__div.parentNode.removeChild(this.__div);
};
	
XRayControl.prototype.getId = function () {
	return 'X-Ray';
};
	
XRayControl.prototype.getVersion = function(){
	return '1.0.0';
}; 
