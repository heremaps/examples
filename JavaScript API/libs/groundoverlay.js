function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}


function GroundOverlay(url, boundingBox) {
	var overlayDiv; 
	var overlayImg;
	this.__map;
	this._url= url;
	this.boundingBox = boundingBox;
	this._visible = true;
	this._opacity = 1;
	var that = this;
	var addOverlay = function ( evt){
		if (that.isVisible() == false){
			overlayDiv.style.display ='none';			
		} else {
			var topLeft = 
				that.__map.geoToPixel(boundingBox.topLeft);
			var bottomRight = 
				that.__map.geoToPixel(boundingBox.bottomRight);
			overlayDiv.style.display ='block';
			overlayDiv.style.left = topLeft.x + "px";
			overlayDiv.style.top = topLeft.y + "px";
			overlayDiv.style.width = 
				(bottomRight.x - topLeft.x) + "px";
			overlayDiv.style.height = 
				(bottomRight.y - topLeft.y) + "px";	
			overlayImage.src= that.getUrl();
			overlayImage.style.width = 
				(bottomRight.x - topLeft.x) + "px";
			overlayImage.style.height = 
				(bottomRight.y - topLeft.y) + "px";
		}
		
	}
	
	
	
	this.attach = function (mapDisplay) {
	
		that.__map = mapDisplay;
		overlayDiv  = document.createElement("div");
		overlayDiv.style.position = 'absolute';
		overlayDiv.style.cursor= 'default';
				
		controls = that.__map.getUIContainer().firstChild;
		child = controls.firstChild;
		
		 controls.insertBefore(overlayDiv, child);
		//map.getUIContainer().appendChild(overlayDiv);
		overlayImage =document.createElement("img"); 	
		overlayImage.id = "groundoverlay";

		overlayDiv.appendChild(overlayImage);   	
		 that.__map.addObserver("center", addOverlay);
		 that.__map.addObserver("zoomLevel", addOverlay);

		
		if(!this.evtTarget) {
			this.evtTarget =  nokia.maps.dom.EventTarget(
                             document.getElementById(
                                     "groundoverlay")).enableDrag();           
            this.evtTarget.addListener("drag",  function(evt){
            	var newGeo = that.__map.pixelToGeo (that.__map.width/2 -  evt.deltaX , that.__map.height/2 - evt.deltaY);                       	
            	that.__map.set("center", newGeo);
            	evt.stopPropagation(); 
            	});
              this.evtTarget.addListener("dblclick",  function(evt){
              	evt.target = this.parentNode.parentNode;
              	that.__map.dispatch(evt);
              });
               this.evtTarget.addListener("mousewheel",  function(evt){
              	evt.target = this.parentNode.parentNode;
              	that.__map.dispatch(evt);
              });
              
            
			addOverlay();
		}
	
	};
	
	this.detatch = function(mapDisplay){
		that.__map.removeObserver("center", addOverlay);
		 that.__map.removeObserver("zoomLevel", addOverlay);
	};
	
	this.getId = function () {
		return 'GroundOverlay';
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
			overlayDiv.style.display ='none';			
		} else {
			overlayDiv.style.display ='block';
		}
	};
	
	this.getOpacity = function(){
		 return this._opacity; 
	};
	
	this.setOpacity = function(x) {
		this._opacity = x;
		if ( this._visible == false){
			overlayImage.style.opacity =x;			
		} else {
			overlayImage.style.opacity = x;
		}
	};
	
	this.getUrl = function(){ 
		return this._url 
	};
	
	this.setUrl = function(x) {
		this._url = x;	
		if (overlayImage !== undefined){
			overlayImage.src= that.getUrl();
		}
	};

};
