
function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function ShadowMarker (coords, props)  {
	nokia.maps.map.StandardMarker.call(this, coords, props);
	nokia.maps.map.StandardMarker.prototype.getIconForRendering.call(this, document);
	this.init(props);
}

extend(ShadowMarker,
		nokia.maps.map.StandardMarker);

ShadowMarker.prototype.init = function ( props) {
	var that = this;
	if (props){
		that.set("shadow", props.shadow !== undefined ? props.shadow : "");
		that.set("shadowOffset", props.shadowOffset !== undefined ? props.shadowOffset : "");
	} else {
		that.set("shadow", "");
		that.set("shadowOffset", new nokia.maps.util.Point(0, 0));
	};

	that.createMarkerWithShadow = function(shadow){
		var GraphicsImage = nokia.maps.gfx.GraphicsImage,
			Color = nokia.maps.gfx.Color,
			parseCss = Color.parseCss;
		var graphics = new nokia.maps.gfx.Graphics();
		var maxWidth = Math.max(shadow.width + that.shadowOffset.x ,that.icon.width);
		var maxHeight= Math.max(shadow.height + that.shadowOffset.y , that.icon.height);

		graphics.beginImage(maxWidth, maxHeight, "");
		graphics.drawImage(shadow, 0, 0, shadow.width, shadow.height , that.shadowOffset.x,
			that.shadowOffset.y, shadow.width, shadow.height);
		graphics.drawImage(that.icon.createElement(), 0, 0,
			that.icon.width, that.icon.height, 0, 0, that.icon.width, that.icon.height);
		that.markerWithShadow = new nokia.maps.gfx.GraphicsImage(graphics);
	}
	that.updateIcon = function (){
		var baseBitmap = new Image();
		baseBitmap.onload = function() {that.createMarkerWithShadow(baseBitmap)}
		baseBitmap.src = that.get("shadow");
		if(baseBitmap.naturalWidth > 0){
			that.createMarkerWithShadow(baseBitmap);
		}
	}

	that.updateIcon();
	that.addObserver("text", that.updateIcon);
	that.addObserver("icon", that.updateIcon);
}


ShadowMarker.prototype.getIconForRendering  = function (doc) {
	var icon = nokia.maps.map.StandardMarker.prototype.getIconForRendering.call(this, doc);
	return (this.markerWithShadow) ? this.markerWithShadow : icon ;
}
