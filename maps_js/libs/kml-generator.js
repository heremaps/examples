if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}


function extend(B, A) {
	function I() {}
	I.prototype = A.prototype;
	B.prototype = new I();
	B.prototype.constructor = B;
}

function KMLGenerator  (panel, options) {
	nokia.maps.map.component.Component.call(this);
	this.init (panel, options) ;
}

extend(KMLGenerator,
		nokia.maps.map.component.Component);


KMLGenerator.prototype.init = function(panel, options) {
	that = this;
	that.panel = panel;
	that.options = options;
	
	that.toUnicode = function  (prefix, input){
		var output = "";

		var splitInput = input.split("");
		for (var i = 0; i < splitInput.length; i++){
				var currentChar = splitInput[i];
				// Encode any extended character plus &
				if (currentChar.charCodeAt()> 128 ||  currentChar.charCodeAt()== 38  || currentChar.charCodeAt()== 39 ) {
						output = output +  prefix + currentChar.charCodeAt() + ";";
				} else {
						output = output + currentChar;
				}
		}

		return output;
	};

	that.getPlaceMarkData = function(objects){
	
	
		for (i=0; i< objects.getLength(); i++) {
			if ( objects.get(i) instanceof nokia.maps.map.Marker ) {
				// Retrieve all the Marker data and add it to an array
				var placemark = new Object();
				var dataSource = (that.options.datasource !== undefined) ?
					objects.get(i)[that.options.datasource] : objects.get(i);
				if (that.options.id !== undefined){
					placemark.id = that.toUnicode("&amp;#",
						dataSource[that.options.id]);
				}
				placemark.latitude = objects.get(i).coordinate.latitude;
				placemark.longitude = objects.get(i).coordinate.longitude;
				if (that.options.description !== undefined){
					placemark.description = that.toUnicode("&#", 
						dataSource[that.options.description]);    //map.objects.get(i).$data.description.toUnicodeCDATA();
				}
				if (that.options.name !== undefined){
					placemark.name = that.toUnicode("&amp;#",
					dataSource[that.options.name]);
				}
				if (that.options.address !== undefined){
					placemark.address = that.toUnicode("&amp;#",
						dataSource[that.options.address]);
				}
				if (that.options.styleURL !== undefined &&
					dataSource[that.options.styleURL] !== undefined ){
					placemark.styleURL = dataSource[that.options.styleURL];
				} else {
					if (dataSource.icon  !== undefined && dataSource.icon.src  !== undefined ){
						placemark.href = dataSource.icon.src;
					} else if (dataSource.brush !== undefined) {
				 		placemark.color = dataSource.brush.color;
					} else if (objects.get(i).icon  !== undefined && objects.get(i).icon.src  !== undefined ){
						placemark.href = objects.get(i).icon.src;
					} else if (objects.get(i).brush !== undefined) {
				 		placemark.color = objects.get(i).brush.color;
					}
				}
				that.placemarks.push(placemark);
	
			} else if ( objects.get(i) instanceof nokia.maps.map.Container ) {
				that.getPlaceMarkData(objects.get(i).objects);
			} else if( map.objects.get(i) instanceof nokia.maps.map.Polyline ){
				// Retrieve all the Polyline data and add it to an array
				var lineString = new Object();
				var dataSource = (that.options.datasource !== undefined) ?
					objects.get(i)[that.options.datasource] : objects.get(i);
				var path =  map.objects.get(i).path.asArray();
				var geocoords = new Array();
				// Ensure we have all the Geo-coordinates longitude and latitude.
				for (j=0; j< path.length; j = j + 3){
					var geocoord = new Object();
					geocoord.latitude = path[j];
					   geocoord.longitude = path[j+ 1];
					   geocoords.push(geocoord); 
					}
					lineString.coordinates = geocoords;          
					if (that.options.styleURL !== undefined &&
						dataSource[that.options.styleURL] !== undefined ){
						lineString.styleURL = dataSource[that.options.styleURL];
					}
					that.lineStrings.push( lineString);
				}         
		}
	}
	
	that.outputToPanel = function (text){
		
		
		if (that.preNode !== undefined){
			that.preNode.parentNode.removeChild(that.preNode);
		}
		
		that.preNode = document.createElement("pre");
		var spanNode =  document.createElement("span"); 
		var codeNode =  document.createElement("code");
		codeNode.className ="language-markup";
		var textNode = document.createTextNode(text);
	
		codeNode.appendChild(textNode);
		spanNode.appendChild(codeNode);
		that.preNode.appendChild(spanNode)
		
		that.panel.appendChild(that.preNode);
	}

}




KMLGenerator.prototype.generateKML = function() {
	
	if (this.map === undefined){
		return;
	}

	this.placemarks = new Array();
	this.lineStrings = new Array();
	this.getPlaceMarkData(this.map.objects);	


	// Now output the KML, start with the header.
	var kmlOutput = "<?xml version='1.0' encoding='UTF-8'?><"+"kml xmlns='http://www.opengis.net/kml/2.2'><"+"Document>\n";

	if (this.options.defaultStyles !== undefined){
		kmlOutput = kmlOutput + this.options.defaultStyles;
	}
	
	for (i=0; i< this.lineStrings.length; i ++){
	
		kmlOutput = kmlOutput + "<Placemark>\n";
		kmlOutput = kmlOutput + "   <LineString>\n"  
		kmlOutput = kmlOutput + "       <coordinates>"  
		for (j=0; j< this.lineStrings[i].coordinates.length; j++){
			kmlOutput = kmlOutput + this.lineStrings[i].coordinates[j].longitude + 
				"," + this.lineStrings[i].coordinates[j].latitude + ",0\n";
		}
		kmlOutput = kmlOutput + "       <\/coordinates>\n"  
		kmlOutput = kmlOutput + "   <\/LineString>\n";
		
		if (this.lineStrings[i].styleURL === undefined ){
			// Do Nothing if no StyleURL entered as it is optional
		} else if  (this.lineStrings[i].styleURL == ""){
			// Do Nothing if no StyleURL entered as it is optional
		} else {
			kmlOutput = kmlOutput + "   <styleUrl>" + this.lineStrings[i].styleURL +"<\/styleUrl>\n";
		}
		kmlOutput = kmlOutput + "<\/Placemark>\n";
	}

	// Loop nthrough the markers and add Point Placemarks
	for (i=0; i< this.placemarks.length; i ++){

		if (this.placemarks[i].id === undefined ){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else if  (this.placemarks[i].id == ""){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else {
			  kmlOutput = kmlOutput + "<"+"Placemark id=\"" +
				 this.placemarks[i].id +"\">\n";
		}

		if (this.placemarks[i].name === undefined ){
			// Do Nothing  if no name entered as it is optional
		} else if  (this.placemarks[i].name == ""){
		   // Do Nothing if no name entered as it is optional
		} else {
				kmlOutput = kmlOutput + "   <"+"name>" +  this.placemarks[i].name +"<\/name>\n";
		}

		if ( this.placemarks[i].description === undefined ){
			// Do Nothing if no description entered as it is optional
		} else if  (this.placemarks[i].description == ""){
			kmlOutput = kmlOutput + "   <"+"description/>\n";
		} else {
			kmlOutput = kmlOutput + "   <"+"description><![CDATA[" +  this.placemarks[i].description +"]]><\/description>\n";
		}

		if (this.placemarks[i].address === undefined ){
			// Do Nothing if no address entered as it is optional
		} else if  (this.placemarks[i].address == ""){
		   // Do Nothing if no address entered as it is optional
		} else {
		   kmlOutput = kmlOutput + "   <"+"address>" +  this.placemarks[i].address +"<\/address>\n";
		}

		kmlOutput = kmlOutput + "    <"+"Point><"+"coordinates>"  + this.placemarks[i].longitude + "," 
			+ this.placemarks[i].latitude + ",0<\/coordinates><\/Point>\n";

		if ( this.placemarks[i].styleURL === undefined ||  this.placemarks[i].styleURL == ""){
			if (this.placemarks[i].href === undefined &&  this.placemarks[i].color !== undefined ){
					kmlOutput = kmlOutput + "    <styleUrl>" +  this.placemarks[i].color + "</styleUrl>\n";				
			}  else if  (this.placemarks[i].href !== undefined) {	
				kmlOutput = kmlOutput + "    <Style><IconStyle><Icon>";
				kmlOutput = kmlOutput + "<href>" +  this.placemarks[i].href + "</href>";
				kmlOutput = kmlOutput + "	</Icon></IconStyle></Style>\n";
			}
		} else  {
			kmlOutput = kmlOutput + "    <"+"styleUrl>#" + this.placemarks[i].styleURL +"<\/styleUrl>\n";
		}

		kmlOutput = kmlOutput + "<\/Placemark>\n\n";
	}

	// Close the < document> element to ensure the KML is well formed.
	kmlOutput = kmlOutput + "<\/Document><\/kml>";
	that.outputToPanel(kmlOutput)
}
  



KMLGenerator.prototype.attach = function(display) {
	this.map = display;
}
KMLGenerator.prototype.detach = function(display) {
	this.map = undefined;
}



