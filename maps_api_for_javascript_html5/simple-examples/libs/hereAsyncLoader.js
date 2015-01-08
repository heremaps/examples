
(function (exports, ctx) {
  jQl.loadjQ(exports.HereMapsConstants.JSLibs.jQueryUrl, function () {
    var script = null,
      baseNS = null,
      mapsNS = null,
      map = null,
      platform = null,
      ui = null;

    // Iterate through the <SCRIPT> Tags to find the loader
    // Then use the element to obtain additional constants
    // such as the name of the DOM element that displays the
    // map
    $(ctx.getElementsByTagName('script')).each(function (index, value) {
      if ($(this).attr('id') === 'HereMapsLoaderScript') {
        script = $(this);
        return false;
      }
      return true;
    });

    // This method is a convenience function that intialises a map for the
    // Given DOM element and at the specified location.

    function createMap(location, domElement) {
      var maptypes = platform.createDefaultLayers(),
        map = new H.Map(domElement,
          maptypes.normal.map, {
          center: {lng : location.longitude, lat: location.latitude},
          zoom: location.zoomLevel, // Bigger numbers are closer in
        }),
        mapevents = new H.mapevents.MapEvents(map),
        // Enable map interaction (pan, zoom, pinch-to-zoom)
        behavior = new H.mapevents.Behavior(mapevents);
      ui = H.ui.UI.createDefault(map,  maptypes);
      return map;
    }

    // This method is a convenience function that intialises the Settings
    // to authenticate the app with the HERE Maps JS library.
    function authenticate(settings) {


      platform = new H.service.Platform({
        useCIT: (settings.serviceMode === 'cit'),
        app_id: settings.appId,
        app_code: settings.appCode
      });


      /*baseNS.Settings.set('app_id', settings.appId);
      baseNS.Settings.set('app_code', settings.appCode);
      if (settings.language) {
        baseNS.Settings.set('defaultLanguage', settings.language);
      }
      if (settings.serviceMode) {
        baseNS.Settings.set('serviceMode', settings.serviceMode);
      }*/
    }

    // This method is called once the base JS library has loaded, it
    // initialises the requested features, authenticates the app to
    // the library, and sets up an appropriately located  map in
    // the specified DOM element.
    function hereMapLoaderCallback() {
      authenticate(exports.HereMapsConstants.AppIdAndToken);

      if (map === null) {
        callbackKey = $(script).data('callback');
        if ($(script).data('map-container') !== undefined) {
          map = createMap(exports.HereMapsConstants.InitialLocation,
            ctx.getElementById($(script).data('map-container')));
          exports[callbackKey](map , platform, ui);
        } else {
          exports[callbackKey](null);
        }
      }
    }

    hereMapLoaderCallback();
  });

})(window, document);