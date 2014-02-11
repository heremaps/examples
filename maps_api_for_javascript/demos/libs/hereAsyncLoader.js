
(function (exports, ctx) {
  jQl.loadjQ(exports.HereMapsConstants.JSLibs.jQueryUrl, function () {
    var script = null,
      baseNS = null,
      mapsNS = null,
      map = null;

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
      return new mapsNS.Display(domElement, {
        center: [location.longitude, location.latitude],
        zoomLevel: location.zoomLevel, // Bigger numbers are closer in
        components: [  // We use these components to make the map interactive
          new mapsNS.component.ZoomBar(),
          new mapsNS.component.Behavior()
        ]
      });
    }

    // This method is a convenience function that intialises the Settings
    // to authenticate the app with the HERE Maps JS library.
    function authenticate(settings) {
      baseNS.Settings.set('app_id', settings.appId);
      baseNS.Settings.set('app_code', settings.appCode);
      if (settings.language) {
        baseNS.Settings.set('defaultLanguage', settings.language);
      }
      if (settings.serviceMode) {
        baseNS.Settings.set('serviceMode', settings.serviceMode);
      }
    }

    // This method is called once the base JS library has loaded, it
    // initialises the requested features, authenticates the app to
    // the library, and sets up an appropriately located  map in
    // the specified DOM element.
    function hereMapLoaderCallback() {
      // Set the mapsNS for further use
      baseNS = exports[exports.HereMapsConstants.NS];

      var params = 'maps',
        fmatrix,
        // This callback is run if the feature load was successful.
        onApiFeaturesLoaded = function (error) {
          mapsNS = baseNS.maps.map;
          authenticate(exports.HereMapsConstants.AppIdAndToken);
          var libsArray = $(script).data('libs'),
            libs,
            callbackKey;

          if (libsArray !== undefined) {
            $.ajaxSetup({async: false});
            libs = libsArray.split(',');
            $.each(libs, function (index, value) {
              $.getScript('libs/' + value + '.js');
            });
            $.ajaxSetup({async: true});
          }


          if (map === null) {
            callbackKey = $(script).data('callback');
            if ($(script).data('map-container') !== undefined) {
              map = createMap(exports.HereMapsConstants.InitialLocation,
                ctx.getElementById($(script).data('map-container')));
              map.addListener('displayready', function () {
                exports[callbackKey](map);
              }, false);
            } else {
              exports[callbackKey](null);
            }
          }
        },
        // This callback is run if an error occurs during the feature loading
        onApiFeaturesError = function (error) {
          alert('Whoops! ' + error);
        };

      if ($(script).data('params') !== undefined) {
        params = $(script).data('params');
      }
      fmatrix = baseNS.Features.getFeaturesFromMatrix(params.split(','));

      baseNS.Features.load(
        fmatrix,
        onApiFeaturesLoaded, // an callback when everything was successfully loaded
        onApiFeaturesError, // an error callback
        null,  // Indicates that the current document applies
        false  //Indicates that loading should be asynchronous
      );
    }

    if ($(script).data('enterprise-only')){
       $.getScript(exports.HereMapsConstants.JSLibs.HereMapsEnterpriseUrl, hereMapLoaderCallback);
    } else {
      $.getScript(exports.HereMapsConstants.JSLibs.HereMapsUrl, hereMapLoaderCallback);
    }
  });

})(window, document);