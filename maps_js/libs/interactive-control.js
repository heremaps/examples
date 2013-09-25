function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function Interactive(minZoom, maxZoom, boundingBox) {
	nokia.maps.map.component.Component.call(this);
	this.init(minZoom, maxZoom, boundingBox);
}

extend(Interactive,
	nokia.maps.map.component.Component);

Interactive.prototype.init =  function() {
	var that = this;
	that.changeCursor= function(target, cursor){
		if ((( target.$href === undefined) == false) ||  
		   (( target.$click === undefined) == false)){
			document.body.style.cursor = cursor;	 
	  }
	}
	EventHandlers = function(ctx) {	 
		var that = ctx;
		this.onMouseOver = function(evt) {
	  		that.changeCursor(evt.target, 'pointer');
		}
		this.onMouseOut = function(evt) {
			that.changeCursor(evt.target, 'default');
		}
		this.onClick = function(evt) {
			that.changeCursor(evt.target, 'default');
			if (( evt.target.$href === undefined) == false){
				  window.location = evt.target.$href; 
			}  else if (( evt.target.$click === undefined) == false){
				var onClickDo = new Function(evt.target.$click);
					onClickDo(); 
			}
		}
	}
	that.eventHandlers = new EventHandlers(that);
}

Interactive.prototype.attach = function (map) {
	map.addListener("mouseover", this.eventHandlers.onMouseOver);
	map.addListener("mouseout", this.eventHandlers.onMouseOut);
	var TOUCH = nokia.maps.dom.Page.browser.touch,
		CLICK = TOUCH ? "tap" : "click";
	map.addListener(CLICK, this.eventHandlers.onClick);
}

Interactive.prototype.detach = function(map){
	map.removeListener("mouseover", this.eventHandlers.onMouseOver);
	map.removeListener("mouseout", this.eventHandlers.onMouseOut);
	var TOUCH = nokia.maps.dom.Page.browser.touch,
		CLICK = TOUCH ? "tap" : "click";
	map.removeListener(CLICK, this.eventHandlers.onClick);
};

Interactive.prototype.getId = function () {
	return 'Interactive';
};
Interactive.prototype.getVersion = function(){
	return '1.0.0';
}; 
