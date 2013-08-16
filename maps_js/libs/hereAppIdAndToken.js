// This file holds all the constants used in the Demos.

window.HereMapsConstants = {
	//	Set authentication token and appid 
	//	WARNING: this is a demo-only key
	//
	// Add your own appId and token here
	// sign in and register on http://developer.here.com
	// and obtain your own developer's API key 
	AppIdAndToken :{
		appId: "_peU-uCkp-j8ovkzFGNU",
		appCode: "gBoUkAMoxoqIWfxWA5DuMQ",
		language: "fr-FR"
	},
	// Initial center and zoom level of the map
	InitialLocation : {
		longitude: 52.53,
		latitude:  13.39,
		zoomLevel: 14},
	
	JSLibs	:{
		// versioned URL to load the HERE maps API.
		// Check on:  http://developer.here.com/versions 
		// to obtain the latest version.
		HereMapsUrl :"http://api.maps.nokia.com/2.2.4/jsl.js?blank=true",
		// versioned URL to load jQuery
		jQueryUrl : 'http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js'
	},
	NS : "nokia"
	
}
