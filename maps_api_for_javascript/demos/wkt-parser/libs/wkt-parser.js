function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}




// This is the default representation of a point, a line string and a
// polygon, override as necessary.
var WKTTheme = {
  getPointPresentation: function (dataPoint) {
    return new nokia.maps.map.StandardMarker(dataPoint);
  },
  getLineStringPresentation: function (dataPoints) {
    return new nokia.maps.map.Polyline(dataPoints);
  },
  getPolygonPresentation: function (dataPoints) {
    return new nokia.maps.map.Polygon(dataPoints);
  }
};


function WKTContainer(options) {
  nokia.maps.map.Container.call(this);
  this.init(options);
}

extend(WKTContainer,
    nokia.maps.map.Container);


WKTContainer.prototype.init = function (options) {

  var that = this;
      that.regex = /(?:(?![()]).)*(?:(?![(),]).)/g;
      that.coordsRegex = /(\d+\.{0,1}\d{0,8})/g;

  this.set('state', 'initial');


  if (options !== undefined && options.container !== undefined) {
    this.container = options.container;
  }
  if (options !== undefined && options.theme !== undefined) {
    this.theme = [];
    this.theme.getPointPresentation = (options.theme.getPointPresentation !== undefined) ?
        options.theme.getPointPresentation : WKTTheme.getPointPresentation;
    this.theme.getLineStringPresentation = (options.theme.getLineStringPresentation !== undefined) ?
        options.theme.getLineStringPresentation : WKTTheme.getLineStringPresentation;
    this.theme.getPolygonPresentation = (options.theme.getPolygonPresentation !== undefined) ?
        options.theme.getPolygonPresentation : WKTTheme.getPolygonPresentation;
  } else {
    this.theme = WKTTheme;
  }

  that._error = function (message) {
    that.set('state', 'failed');
    return {
      type: 'Error',
      message: message
    };
  };


  that.geometryToMapObjects = function (type, coordinateSets, props) {

    var mapObject,
      lineString,
      coord,
      path,
      point,
      geoStrip,
      polygon,
      polygons,
      exteriorDirection,
      interiorDirection,
      error,
      i,
      j,
      k,
      ll,
      obj;

    switch (type) {
    case 'point':
      coords = coordinateSets[0].match(that.coordsRegex);
      mapObject = that.theme.getPointPresentation(
        [parseFloat(coords[1]), parseFloat(coords[0])], props
      );
      break;

    case 'multipoint':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < coordinateSets.length; i += 1) {
        coords = coordinateSets[i].match(that.coordsRegex);
        if(coords){
          point = that.theme.getPointPresentation(
          [parseFloat(coords[1]), parseFloat(coords[0])], props
          );
          mapObject.objects.add(point);
        }
      }
      break;

    case 'linestring':
      coords = coordinateSets[0].match(that.coordsRegex);
      path = [];
      for (i = 0; i < coords.length; i += 2) {
        ll = new nokia.maps.geo.Coordinate(parseFloat(coords[i+1]), parseFloat(coords[i+0]));
        path.push(ll);
      }
      mapObject = that.theme.getLineStringPresentation(path, props);
      break;

    case 'multilinestring':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < coordinateSets.length; i += 1) {
        coords = coordinateSets[i].match(that.coordsRegex);
        if(coords){
          path = [];
          for (j = 0; j < coords.length; j += 2) {
            ll = new nokia.maps.geo.Coordinate(parseFloat(coords[j+1]),
               parseFloat(coords[j+0]));
            path.push(ll);
          }
          lineString = that.theme.getLineStringPresentation(path, props);
          mapObject.objects.add(lineString);
        }
      }
      break;

    case 'polygon':

      coords = coordinateSets[0].match(that.coordsRegex);

      path = [];
      for (i = 0; i < coords.length; i += 2) {
        ll = new nokia.maps.geo.Coordinate(parseFloat(coords[i+1]), parseFloat(coords[i+0]));
        path.push(ll);
      }

      mapObject = that.theme.getPolygonPresentation(path, props);
      break;

    case 'multipolygon':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < coordinateSets.length; i += 1) {
        coords = coordinateSets[i].match(that.coordsRegex);
        if(coords){
          path = [];
          for (j = 0; j < coords.length; j += 2) {
            ll = new nokia.maps.geo.Coordinate(parseFloat(coords[j+1]),
               parseFloat(coords[j+0]));
            path.push(ll);
          }
          polygon = that.theme.getPolygonPresentation(path, props);
          mapObject.objects.add(polygon);
        }
      }
      break;


    default:
      error = that._error('Invalid WKT object: Geometry object must be one of ' +
          '\'Point\', \'LineString\', \'Polygon\' or \'MultiPolygon\'.');
    }

    return mapObject;

  };
};

WKTContainer.prototype.parseWKT = function (wellKnownText, props) {
  this.objects.clear();
  this.addWKT(wellKnownText, props);
  return this.objects.asArray();
};

WKTContainer.prototype.addWKT = function (wellKnownText, props) {
  var error,
    i;
    parts = wellKnownText.match(this.regex);
    type = parts[0].trim().toLowerCase();
    coordinates = parts.slice(1);

  this.set('state', 'started');


  if (this.container !== undefined) {
    // clear the internal representation of map objects,
    // since we are using an external container.
    this.objects.clear();
  }

  switch (type) {

  case 'point':
  case 'multipoint':
  case 'linestring':
  case 'multilinestring':
  case 'polygon':
  case 'multipolygon':
    if (parts.length > 1) {
      this.objects.add(this.geometryToMapObjects(type, parts.slice(1)));
    } else {
      error = this._error('Invalid WKT object: Geometry object missing \'coordinates\'.');
    }
    break;

  default:
    error = this._error('Invalid WKT object: WKT object must be one of \'Point\',' +
      ' \'LineString\', \'Polygon\', \'MultiPolygon\', \'Feature\', \'FeatureCollection\' or \'GeometryCollection\'.');
  }

  if (this.get('state') === 'failed') {
    return error;
  } else if (this.container !== undefined) {
    this.container.objects.addAll(this.objects.asArray())
  }

  this.set('state', 'finished');
  return (this.container  !== undefined) ? this.container : this;
}






