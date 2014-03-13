function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}


function JSONManager() {
  nokia.maps.util.OObject.call(this);
  this.init();
}

extend(JSONManager,
    nokia.maps.util.OObject);


JSONManager.prototype.init = function () {
  var that = this;
  that.set('state', 'initial');
  that.parseJSON = function (filename) {
    that.set('state', 'started');
    $.getJSON( filename,function (json) {
        that.set('state', 'loaded');
        that.set('object', json);
        that.set('state', 'finished');
    });
  };
};

// This is the default representation of a point, a line string and a
// polygon, override as necessary.
var GeoJSONTheme = {
  getPointPresentation: function (dataPoint, properties) {
    return new nokia.maps.map.StandardMarker(dataPoint);
  },
  getLineStringPresentation: function (dataPoints, properties) {
    return new nokia.maps.map.Polyline(dataPoints);
  },
  getPolygonPresentation: function (geoStrip, properties) {
    return new nokia.maps.map.Polygon(geoStrip);
  }
};


function GeoJSONContainer(options) {
  nokia.maps.map.Container.call(this);
  this.init(options);
}

extend(GeoJSONContainer,
    nokia.maps.map.Container);


GeoJSONContainer.prototype.init = function (options) {

  var that = this;

  this.set('state', 'initial');


  if (options !== undefined && options.container !== undefined) {
    this.container = options.container;
  }
  if (options !== undefined && options.theme !== undefined) {
    this.theme = [];
    this.theme.getPointPresentation = (options.theme.getPointPresentation !== undefined) ?
        options.theme.getPointPresentation : GeoJSONTheme.getPointPresentation;
    this.theme.getLineStringPresentation = (options.theme.getLineStringPresentation !== undefined) ?
        options.theme.getLineStringPresentation : GeoJSONTheme.getLineStringPresentation;
    this.theme.getPolygonPresentation = (options.theme.getPolygonPresentation !== undefined) ?
        options.theme.getPolygonPresentation : GeoJSONTheme.getPolygonPresentation;
  } else {
    this.theme = GeoJSONTheme;
  }

  that._error = function (message) {
    that.set('state', 'failed');
    return {
      type: 'Error',
      message: message
    };
  };


  that.geometryToMapObjects = function (geojsonGeometry, properties) {

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

    switch (geojsonGeometry.type) {
    case 'Point':
      mapObject = that.theme.getPointPresentation(
        [geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]],
        properties
      );
      if (properties) {
        mapObject.set('properties', properties);
      }
      break;

    case 'MultiPoint':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < geojsonGeometry.coordinates.length; i += 1) {
        point = that.theme.getPointPresentation(
          [geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]],
          properties
        );
        mapObject.objects.add(point);
      }
      if (properties) {
        for (k = 0; k < mapObject.objects.getLength(); k += 1) {
          mapObject.objects.get(k).set('properties', properties);
        }
      }
      break;

    case 'LineString':
      path = [];
      for (i = 0; i < geojsonGeometry.coordinates.length; i += 1) {
        coord = geojsonGeometry.coordinates[i];
        ll = new nokia.maps.geo.Coordinate(coord[1], coord[0]);
        path.push(ll);
      }
      mapObject = that.theme.getLineStringPresentation(path, properties);
      if (properties) {
        mapObject.set('properties', properties);
      }
      break;

    case 'MultiLineString':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < geojsonGeometry.coordinates.length; i += 1) {
        path = [];
        for (j = 0; j < geojsonGeometry.coordinates[i].length; j += 1) {
          coord = geojsonGeometry.coordinates[i][j];
          ll = new nokia.maps.geo.Coordinate(coord[1], coord[0]);
          path.push(ll);
        }

        lineString = that.theme.getLineStringPresentation(path, properties);
        mapObject.objects.add(lineString);
      }
      if (properties) {
        for (k = 0; k < mapObject.objects.getLength(); k += 1) {
          mapObject.objects.get(k).set('properties', properties);
        }
      }
      break;

    case 'Polygon':
      geoStrip = new nokia.maps.geo.Strip();

      for (i = 0; i < geojsonGeometry.coordinates.length; i += 1) {
        for (j = 0; j < geojsonGeometry.coordinates[i].length; j += 1) {
          geoStrip.add(
            new nokia.maps.geo.Coordinate(geojsonGeometry.coordinates[i][j][1],
              geojsonGeometry.coordinates[i][j][0])
          );
        }
      }

      mapObject = that.theme.getPolygonPresentation(geoStrip, properties);
      if (properties) {
        mapObject.set('properties', properties);
      }
      break;

    case 'MultiPolygon':
      mapObject = new nokia.maps.map.Container();
      for (i = 0; i < geojsonGeometry.coordinates.length; i += 1) {
        polygons = [];
        for (j = 0; j < geojsonGeometry.coordinates[i].length; j += 1) {
          geoStrip = new nokia.maps.geo.Strip();
          for (k = 0; k < geojsonGeometry.coordinates[i][j].length; k += 1) {
            geoStrip.add(
              new nokia.maps.geo.Coordinate(geojsonGeometry.coordinates[i][j][k][1],
                geojsonGeometry.coordinates[i][j][k][0])
            );
          }
          polygon = that.theme.getPolygonPresentation(geoStrip, properties);
          polygons.push(polygon);
        }

        mapObject.objects.addAll(polygons);
      }
      if (properties) {
        for (k = 0; k < mapObject.objects.getLength();  k += 1) {
          mapObject.objects.get(k).set('properties', properties);
        }
      }
      break;

    case 'GeometryCollection':
      mapObject = new nokia.maps.map.Container();
      if (!geojsonGeometry.geometries) {
        error = that._error('Invalid GeoJSON object: GeometryCollection object ' +
          ' missing \'geometries\' member.');
      } else {
        for (i = 0; i < geojsonGeometry.geometries.length; i += 1) {
          obj = that.geometryToMapObjects(geojsonGeometry.geometries[i],
               properties || null);
          if (obj !== undefined) {
            mapObject.objects.add(obj);
          } else {
            break;
          }
        }
      }
      break;

    default:
      error = that._error('Invalid GeoJSON object: Geometry object must be one of ' +
          '\'Point\', \'LineString\', \'Polygon\' or \'MultiPolygon\'.');
    }

    return mapObject;

  };
};

GeoJSONContainer.prototype.parseGeoJSON = function (geojson) {
  this.objects.clear();
  this.addGeoJSON(geojson);
  return this.objects.asArray();
};

GeoJSONContainer.prototype.addGeoJSON = function (geojson) {
  var error,
    i;
  this.set('state', 'started');
  if (this.container !== undefined) {
    // clear the internal representation of map objects,
    // since we are using an external container.
    this.objects.clear();
  }

  switch (geojson.type) {
  case 'FeatureCollection':
    if (!geojson.features) {
      error = this._error('Invalid GeoJSON object: FeatureCollection object missing \'features\' member.');
    } else {
      //
      for (i = 0; i < geojson.features.length; i += 1) {
        this.objects.add(this.geometryToMapObjects(geojson.features[i].geometry,
          geojson.features[i].properties));
      }
    }
    break;

  case 'GeometryCollection':
    if (!geojson.geometries){
      error = this._error('Invalid GeoJSON object: GeometryCollection object missing \'geometries\' member.');
    } else {
      for (i = 0; i < geojson.geometries.length; i += 1) {
        this.objects.add(this.geometryToMapObjects(geojson.geometries[i], null));
      }
    }
    break;

  case 'Feature':
    if (!( geojson.properties && geojson.geometry)) {
      error = this._error('Invalid GeoJSON object: Feature object missing \'properties\' or \'geometry\' member.');
    } else {
      this.objects.add(this.geometryToMapObjects(geojson.geometry, geojson.properties));
    }
    break;

  case 'Point':
  case 'MultiPoint':
  case 'LineString':
  case 'MultiLineString':
  case 'Polygon':
  case 'MultiPolygon':
    if (geojson.coordinates) {
      this.objects.add(this.geometryToMapObjects(geojson, null));
    } else {
      error = this._error('Invalid GeoJSON object: Geometry object missing \'coordinates\' member.');
    }
    break;

  default:
    error = this._error('Invalid GeoJSON object: GeoJSON object must be one of \'Point\',' +
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






