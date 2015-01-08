// This file holds all the constants used in the Demos.
(function (exports, ctx) {
  exports.HereMapsConstants = {
    //  Set authentication token and appid
    //  WARNING: this is a demo-only key
    //
    // Add your own appId and token here
    // sign in and register on http://developer.here.com
    // and obtain your own developer's API key
    AppIdAndToken :{
      appId: 'DemoAppId01082013GAL',
      appCode: 'AJKnXv84fjrb0KIHawS0Tg',
      language: 'en-US',
      serviceMode: 'cit'
    },
    // Initial center and zoom level of the map
    InitialLocation : {
      longitude: 13.39,
      latitude: 52.53,
      zoomLevel: 14},

    JSLibs  :{
      // versioned URL to load the HERE maps API.
      // Check on:  http://developer.here.com/versions
      // to obtain the latest version.
      HereMapsUrl :'http://js.api.here.com/v3/3.0/mapsjs-core.js',
      HereMapsUrlService: 'http://js.api.here.com/v3/3.0/mapsjs-service.js',
      HereMapsUrlEvents: 'http://js.api.here.com/v3/3.0/mapsjs-mapevents.js',
      HereMapsUrlUI: 'http://js.api.here.com/v3/3.0/mapsjs-ui.js',

      // versioned URL to load jQuery
      jQueryUrl : 'http://code.jquery.com/jquery-git2.min.js',
      jQueryUIUrl: 'http://code.jquery.com/ui/1.10.4/jquery-ui.min.js'
    },
    NS : 'nokia'

  }
})(window, document);