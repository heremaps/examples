function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


function XRayControl(width, height ) {
	
	// ensure CSS is injected
	var styleNode = document.createElement('style');
	styleNode.type = 'text/css';
	var css = '#nm_x_ray{' +
		' position: absolute;' +
		' width: '+ width + 'px;' +
		' height: '+ height + 'px;' +
		' cursor: move;' +
		' border:3px solid white;' +
		' border-radius: 3px;' +
		' box-shadow:0 0 5px black;' + 	  
	'}';
	if (styleNode.styleSheet) { // IE
    	styleNode.styleSheet.cssText = css;
	} else {
    	styleNode.appendChild(document.createTextNode(css));
	}
	document.body.appendChild(styleNode);

	this.__div; 
	this.__map;
	this.__map2;
	this._visible = true;
	this.width = width;
	this.height = height;
	var that = this;
	
	// Create an observer function that sets values on the second map
	var setOverview = function (obj, key, value, oldValue) {

		if (key === "center") {
			that.__map2.set({ center: that.__map.pixelToGeo(that.__div.offsetLeft+100, that.__div.offsetTop+100)});
		} else if(key === "zoomLevel") {
			value = (value >= that.__map2.minZoomLevel) ? value : that.__map2.minZoomLevel;
			that.__map2.set(key, value);
		}
	};
	
	var createSecondMap = function (map) {
		      
	        	that.__map2 = new nokia.maps.map.Display(that.__div, {
		            center: map.center,
		            zoomLevel: map.zoomLevel
		        });
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
						&& newY < that.__map.height - 5
						
						){
						that.__div.style.left = newX + "px";
						that.__div.style.top = newY + "px";
		
						that.__map2.set({ center: that.__map.pixelToGeo(newX+100, newY+100) });
					}
		
				});
				// Add the "copy" function as observers for the first map's center and zoom level
				that.__map.set("observers", { center: setOverview, zoomLevel: setOverview });

				// Initialize the map center and zoom level
				that.__map2.set({ center: that.__map.get("center"), zoomLevel: 
					(that.__map.get("zoomLevel")) });

		    }
	
	this.attach = function (map) {
	
		that.__map = map;
		that.__div  = document.createElement("div");
		that.__div.id = 'nm_x_ray';
		controls = that.__map.getUIContainer().firstChild;
		child = controls.firstChild;
		controls.insertBefore(that.__div, child);
		that.setVisible(true);
		createSecondMap(map);
	
	};
	
	this.detatch = function(map){
		that.__map.removeObserver("center", addOverlay);
		 that.__map.removeObserver("zoomLevel", addOverlay);
	};
	
	this.getId = function () {
		return 'Magnifier';
	};
	
	
	this.getVersion = function(){
			return '1.0.0';
	}; 
	
	this.isVisible = function(){
		 return this._visible; 
	};
	
	this.setVisible = function(x) {
		this._visible = x;
		if ( this._visible == false){
			this.__div.style.display ='none';			
		} else {
			this.__div.style.display ='block';
		}
	};
};
