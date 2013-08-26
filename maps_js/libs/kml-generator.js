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

function  KMLGenerator(panel, options) {
	this.panel = panel;
	this.options = options;
	that = this;
	var preNode;

var toUnicode = function  (prefix, input){
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

var getPlaceMarkData = function(objects){
	
	
	for (i=0; i< objects.getLength(); i++) {
		if ( objects.get(i) instanceof nokia.maps.map.Marker ) {
			// Retrieve all the Marker data and add it to an array
			var placemark = new Object();
			var dataSource = (that.options.datasource !== undefined) ?
				objects.get(i)[that.options.datasource] : objects.get(i);
			if (that.options.id !== undefined){
				placemark.id = toUnicode("&amp;#",
					dataSource[that.options.id]);
			}
			placemark.latitude = objects.get(i).coordinate.latitude;
			placemark.longitude = objects.get(i).coordinate.longitude;
			if (that.options.description !== undefined){
				placemark.description =  toUnicode("&#", 
					dataSource[that.options.description]);    //map.objects.get(i).$data.description.toUnicodeCDATA();
			}
			if (that.options.name !== undefined){
				placemark.name = toUnicode("&amp;#",
				dataSource[that.options.name]);
			}
			if (that.options.address !== undefined){
				placemark.address = toUnicode("&amp;#",
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
			placemarks.push(placemark);

		} else if ( objects.get(i) instanceof nokia.maps.map.Container ) {
			getPlaceMarkData(objects.get(i).objects);
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
				lineStrings.push( lineString);
			}         
	}
}

this.generateKML = function() {

	placemarks = new Array();
	lineStrings = new Array();
	getPlaceMarkData(that.map.objects);	


	// Now output the KML, start with the header.
	 kmlOutput = "<?xml version='1.0' encoding='UTF-8'?><"+"kml xmlns='http://www.opengis.net/kml/2.2'><"+"Document>\n";

	if (that.options.defaultStyles !== undefined){
		kmlOutput = kmlOutput + that.options.defaultStyles;
	}
	
	for (i=0; i< lineStrings.length; i ++){
	
		kmlOutput = kmlOutput + "<Placemark>\n";
		kmlOutput = kmlOutput + "   <LineString>\n"  
		kmlOutput = kmlOutput + "       <coordinates>"  
		for (j=0; j< lineStrings[i].coordinates.length; j++){
			kmlOutput = kmlOutput + lineStrings[i].coordinates[j].longitude + 
				"," + lineStrings[i].coordinates[j].latitude + ",0\n";
		}
		kmlOutput = kmlOutput + "       <\/coordinates>\n"  
		kmlOutput = kmlOutput + "   <\/LineString>\n";
		
		if ( lineStrings[i].styleURL === undefined ){
			// Do Nothing if no StyleURL entered as it is optional
		} else if  ( lineStrings[i].styleURL == ""){
			// Do Nothing if no StyleURL entered as it is optional
		} else {
			kmlOutput = kmlOutput + "   <styleUrl>" + lineStrings[i].styleURL +"<\/styleUrl>\n";
		}
		kmlOutput = kmlOutput + "<\/Placemark>\n";
	}

	// Loop nthrough the markers and add Point Placemarks
	for (i=0; i< placemarks.length; i ++){

		if ( placemarks[i].id === undefined ){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else if  ( placemarks[i].id == ""){
				kmlOutput = kmlOutput + "<"+"Placemark>\n";
		} else {
			  kmlOutput = kmlOutput + "<"+"Placemark id=\"" +
				 placemarks[i].id +"\">\n";
		}

		if ( placemarks[i].name === undefined ){
			// Do Nothing  if no name entered as it is optional
		} else if  ( placemarks[i].name == ""){
		   // Do Nothing if no name entered as it is optional
		} else {
				kmlOutput = kmlOutput + "   <"+"name>" +  placemarks[i].name +"<\/name>\n";
		}

		if ( placemarks[i].description === undefined ){
			// Do Nothing if no description entered as it is optional
		} else if  ( placemarks[i].description == ""){
			kmlOutput = kmlOutput + "   <"+"description/>\n";
		} else {
			kmlOutput = kmlOutput + "   <"+"description><![CDATA[" +  placemarks[i].description +"]]><\/description>\n";
		}

		if ( placemarks[i].address === undefined ){
			// Do Nothing if no address entered as it is optional
		} else if  ( placemarks[i].address == ""){
		   // Do Nothing if no address entered as it is optional
		} else {
		   kmlOutput = kmlOutput + "   <"+"address>" +  placemarks[i].address +"<\/address>\n";
		}

		kmlOutput = kmlOutput + "    <"+"Point><"+"coordinates>"  + placemarks[i].longitude + "," + placemarks[i].latitude + ",0<\/coordinates><\/Point>\n";

		if ( placemarks[i].styleURL === undefined ||  placemarks[i].styleURL == ""){
			if ( placemarks[i].href === undefined &&  placemarks[i].color !== undefined ){
					kmlOutput = kmlOutput + "    <styleUrl>" +  placemarks[i].color + "</styleUrl>\n";				
			}  else if  (placemarks[i].href !== undefined) {	
				kmlOutput = kmlOutput + "    <Style><IconStyle><Icon>";
				kmlOutput = kmlOutput + "<href>" +  placemarks[i].href + "</href>";
				kmlOutput = kmlOutput + "	</Icon></IconStyle></Style>\n";
			}
		} else  {
			kmlOutput = kmlOutput + "    <"+"styleUrl>#" + placemarks[i].styleURL +"<\/styleUrl>\n";
		}

		kmlOutput = kmlOutput + "<\/Placemark>\n\n";
	}

	// Close the < document> element to ensure the KML is well formed.
	kmlOutput = kmlOutput + "<\/Document><\/kml>";
	outputToPanel(kmlOutput)
  }
  
var outputToPanel = function (text){
	
	
	if (preNode !== undefined){
		preNode.parentNode.removeChild(preNode);
	}
	
	preNode = document.createElement("pre");
	var spanNode =  document.createElement("span"); 
	var codeNode =  document.createElement("code");
	var textNode = document.createTextNode(text);

	codeNode.appendChild(textNode);
	spanNode.appendChild(codeNode);
	preNode.appendChild(spanNode)
	
	that.panel.appendChild(preNode);
}


this.attach = function(display) {
	this.map = display;
}
this.detach = function(display) {
	this.map = undefined;
}


};

