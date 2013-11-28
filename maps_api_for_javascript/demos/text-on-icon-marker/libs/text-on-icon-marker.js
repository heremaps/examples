
function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function TextOnIconMarker (coords, props)  {
	nokia.maps.map.Marker.call(this, coords, props);
	nokia.maps.map.Marker.prototype.getIconForRendering.call(this, document);
	this.init(props);
}

extend(TextOnIconMarker,
		nokia.maps.map.Marker);
	
TextOnIconMarker.prototype.init = function ( props) {
	var that = this;
	if (props){
		that.set("text", props.text !== undefined ? props.text : "");
	} else {
		that.set("text", "");
	}	
	
	that.createDefacedIcon = function(image){
		var GraphicsImage = nokia.maps.gfx.GraphicsImage,
			Color = nokia.maps.gfx.Color,
			parseCss = Color.parseCss;
		
		
		var graphics = new nokia.maps.gfx.Graphics();
		graphics.beginImage(image.width, image.height, "");
		graphics.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
		graphics.set("font", "bold 12px verdana");	
		//center the text relatively to anchor point;
		graphics.set("textAlign", "center");
		graphics.set("fillColor", parseCss("black",1.0));
		graphics.set("strokeColor", parseCss("white",1.0));
			
		//center the text to be in the center of the canvas
		graphics.strokeText(that.get("text"), image.width/2, image.height/2);
		graphics.fillText(that.get("text"), image.width/2, image.height/2);
					
		
		that.defacedIcon = new nokia.maps.gfx.GraphicsImage(graphics);
	}
	that.updateIcon = function (){
		var baseBitmap = new Image();
		baseBitmap.onload = function() {that.createDefacedIcon(baseBitmap)}
		baseBitmap.src = that.get("icon").src;
		if(baseBitmap.naturalWidth > 0){
			that.createDefacedIcon(baseBitmap);
		}
	}
	
	that.updateIcon();
	that.addObserver("text", that.updateIcon);
	that.addObserver("icon", that.updateIcon);	
}


TextOnIconMarker.prototype.getIconForRendering  = function (doc) {
	var icon = nokia.maps.map.Marker.prototype.getIconForRendering.call(this, doc);		
	return (this.defacedIcon) ? this.defacedIcon : icon ;
}
 