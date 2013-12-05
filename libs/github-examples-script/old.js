(function(exports, ctx) {

	var map = null;
	HereMapsConstants = {
	//	Set authentication token and appid
	//	WARNING: this is a demo-only key
	//
	// Add your own appId and token here
	// sign in and register on http://developer.here.com
	// and obtain your own developer's API key
	AppIdAndToken : {
		appId : "DemoAppId01082013GAL",
		appCode : "AJKnXv84fjrb0KIHawS0Tg",
		language : "en-US",
		serviceMode : "cit",
	},
	// Initial center and zoom level of the map
	InitialLocation : {
		longitude : 52.53,
		latitude : 13.39,
		zoomLevel : 14
	},

	JSLibs : {
		// versioned URL to load the HERE maps API.
		// Check on:  http://developer.here.com/versions
		// to obtain the latest version.
		HereMapsUrl : "http://js.cit.api.here.com/se/2.5.3/jsl.js?blank=true",
		// versioned URL to load jQuery
		jQueryUrl : 'http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js',
		jQueryUIUrl : 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'
	},
	NS : "nokia"

};


	// This method is a convenience function that intialises a map for the
	// Given DOM element and at the specified location.

	function createMap(location, domElement) {
		return new mapsNS.Display(domElement, {
			center : [location.longitude, location.latitude],
			zoomLevel : location.zoomLevel, // Bigger numbers are closer in
			components : [// We use these components to make the map interactive
			new mapsNS.component.ZoomBar(), new mapsNS.component.Behavior()]
		});
	};

	// This method is a convenience function that intialises the Settings
	// to authenticate the app with the HERE Maps JS library.
	function authenticate(settings) {
		baseNS.Settings.set("app_id", settings.appId);
		baseNS.Settings.set("app_code", settings.appCode);
		if (settings.language) {
			baseNS.Settings.set("defaultLanguage", settings.language);
		}
		if (settings.serviceMode) {
			baseNS.Settings.set("serviceMode", settings.serviceMode);
		}
	};

	// This method is called once the base JS library has loaded, it
	// initialises the requested features, authenticates the app to
	// the library, and sets up an appropriately located  map in
	// the specified DOM element.
	function hereMapLoaderCallback(callbackKey,mapContainer, libsArray ) { 
		// Set the mapsNS for further use
		alert(HereMapsConstants.NS);
		if(exports==undefined)
			alert();
		baseNS =  exports[HereMapsConstants.NS];
		mapsNS =  baseNS.maps.map;
		authenticate(HereMapsConstants.AppIdAndToken);
		alert('done auth');
			if (libsArray !== undefined) {
				$.ajaxSetup({
					async : false
				});
				libs = libsArray.split(',');
				$.each(libs, function(index, value) {
					$.getScript('libs/' + value + '.js');
				});
				$.ajaxSetup({
					async : true
				});
			}

			if (map == null) {
				  
				//callbackKey = $(script).data('callback');
				if (mapContainer !== undefined) {
					map = createMap(exports.HereMapsConstants.InitialLocation, ctx.getElementById(mapContainer));
					map.addListener("displayready", function() {
						
						exports[callbackKey](map);
					}, false);
				}else {
					exports[callbackKey](map);}
			}
		
	}

	alert('asdas');
	var callbackKey="addCircleToMap" ,mapContainer="mapContainer", libsArray;
	hereMapLoaderCallback(callbackKey,mapContainer, libsArray );


	function foo(str) {
		alert(str);
	}


	exports.foo = foo;
})(window, document);
