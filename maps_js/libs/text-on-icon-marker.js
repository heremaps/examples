
function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function TextOnIconMarker (coords, props)  {
	nokia.maps.map.Marker.call(this, coords, props);
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
	that.body = document.body || document._documentElement;
	
	that.createDefacedIcon = function(image){
		
		var op = nokia.maps.gfx.IDL.opcodes,
			idlImage = new nokia.maps.gfx.IDL(
				[op.BEGIN_2D_IMAGE, image.width, image.height, "",
				op.MOVE_TO, 0, 0,
				op.DRAW_IMAGE, that._imgElement, 
					0, 0, image.width, image.height, 0, 0, 
					image.width, image.height,
				op.DRAW_IMAGE, that._textAsImgElement, 
					0, 0, image.width, image.height, 0, 0, 
					image.width,image.height
				
				]); 
		that.defacedIcon = 
		new nokia.maps.gfx.GraphicsImage(idlImage);
	}
	that.addTextToDOM = function(image){
		var GraphicsImage = nokia.maps.gfx.GraphicsImage,
		Color = nokia.maps.gfx.Color,
		parseCss = Color.parseCss;

		// Create a new graphics image.
		var textImage = new GraphicsImage(function (graphics, graphicsImage) {
			// This will clear the canvas and set it's size.
			graphics.beginImage(image.width, image.height, "");
			graphics.set("font", "bold 12px verdana");	
			//center the text relatively to anchor point;
			graphics.set("textAlign", "center");
			graphics.set("fillColor", parseCss("black",1.0));
			graphics.set("strokeColor", parseCss("white",1.0));
				
			//center the text to be in the center of the canvas
			graphics.strokeText(that.get("text"), image.width/2, image.height/2);
			graphics.fillText(that.get("text"), image.width/2, image.height/2);
		});
		
		that._textAsImgElement = textImage.createElement();
		that._textAsImgElement.style.display = "none";
		that.body.appendChild(that._textAsImgElement);
		that.createDefacedIcon(image) ;
	}
	that.addImageToDOM = function (image) {
			that._imgElement = image.createElement();
			that._imgElement.style.display = "none";				
			that.body.appendChild(that._imgElement);
			that.addTextToDOM( image)
	}

	that.updateIcon = function (){
		if(that._textAsImgElement && that._textAsImgElement.parentNode ){
			that._textAsImgElement.parentNode.removeChild(that._textAsImgElement);
		}
		if(that._imgElement &&  that._imgElement.parentNode){
			that._imgElement.parentNode.removeChild(that._imgElement);
		}
				
		var baseBitmap = new nokia.maps.gfx.BitmapImage(that.get("icon").src);
		baseBitmap.prepare(that.addImageToDOM, that);
	}
	
	that.updateIcon();
	that.addObserver("text", that.updateIcon);
	that.addObserver("icon", that.updateIcon);	
}


TextOnIconMarker.prototype.getIconForRendering  = function (doc) {
	var icon = nokia.maps.map.Marker.prototype.getIconForRendering.call(this, doc);	
	if (document.all && !document.addEventListener) {
		// Return basic marker for older browsers.
    	return icon;
	}

	return (this.defacedIcon) ? this.defacedIcon : icon ;

}
 