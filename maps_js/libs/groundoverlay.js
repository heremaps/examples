function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function GroundOverlay (url, boundingBox)  {
	nokia.maps.map.component.Component.call(this);
	this.init(url, boundingBox);
}

extend(GroundOverlay,
		nokia.maps.map.component.Component);


GroundOverlay.prototype.init = function (url, boundingBox) {
	that = this;
	that.overlayDiv  = document.createElement("div");
	that.overlayDiv.style.position = 'absolute';
	that.overlayDiv.style.cursor= 'default';
	that.overlayImage =document.createElement("img"); 	
	that.overlayImage.id = "groundoverlay";
	that.overlayDiv.appendChild(that.overlayImage);
	
	that.set("url", url);
	that.set("boundingBox", boundingBox);
	that.set("visible", true);
	that.set("opacity", 1);
	
	that.addOverlay = function ( evt){
		var isVisible = that.get("visible");
		if (isVisible == false){
			that.overlayDiv.style.display ='none';			
		} else {
			var boundingBox = that.get("boundingBox");
			
			var topLeft = 
				that.map.geoToPixel(boundingBox.topLeft);
			var bottomRight = 
				that.map.geoToPixel(boundingBox.bottomRight);
			that.overlayDiv.style.display ='block';
			that.overlayDiv.style.left = topLeft.x + "px";
			that.overlayDiv.style.top = topLeft.y + "px";
			that.overlayDiv.style.width = 
				(bottomRight.x - topLeft.x) + "px";
			that.overlayDiv.style.height = 
				(bottomRight.y - topLeft.y) + "px";	
			that.overlayImage.src= that.get("url");
			that.overlayImage.style.width = 
				(bottomRight.x - topLeft.x) + "px";
			that.overlayImage.style.height = 
				(bottomRight.y - topLeft.y) + "px";
			that.overlayImage.style.opacity = that.get("opacity");
		}
		
	}
	
	that.addObserver("opacity", that.addOverlay);
	that.addObserver("visible", that.addOverlay);
	that.addObserver("url", that.addOverlay);
	that.addObserver("boundingBox", that.addOverlay);

};


GroundOverlay.prototype.attach = function (map) {
	
	this.map = map;
	var controls = map.getUIContainer().firstChild;
	var child = controls.firstChild;
	controls.insertBefore(this.overlayDiv, child);

	map.addObserver("center", this.addOverlay);
	map.addObserver("zoomLevel", this.addOverlay);
	
	if(!this.evtTarget) {
		this.evtTarget =  nokia.maps.dom.EventTarget(
			document.getElementById("groundoverlay")).enableDrag();           
		this.evtTarget.addListener("drag",  function(evt){
			var newGeo = that.map.pixelToGeo (that.map.width/2 - 
			evt.deltaX , that.map.height/2 - evt.deltaY);                       	
			that.map.set("center", newGeo);
			evt.stopPropagation(); 
		});
		this.evtTarget.addListener("dblclick",  function(evt){
			evt.target = this.parentNode.parentNode;
			that.map.dispatch(evt);
		});
		this.evtTarget.addListener("mousewheel",  function(evt){
			evt.target = this.parentNode.parentNode;
			that.map.dispatch(evt);
		});
		this.addOverlay();
	}

}
	
GroundOverlay.prototype.detach = function(map){
	this.map = null;
	map.removeObserver("center", this.addOverlay);
	map.removeObserver("zoomLevel", this.addOverlay);
	this.overlayDiv.parentNode.removeChild(this.overlayDiv);
}
	
GroundOverlay.prototype.getId = function () {
	return 'GroundOverlay';
}
	
	
GroundOverlay.prototype.getVersion = function(){
	return '1.0.0';
}
