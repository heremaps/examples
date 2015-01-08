function randomLocationGenerator(numPoints) {
  var that = this,
    randomPointNear = function (lat, lng, walk, text) {
      var j;
      for (j = 0; j  < 3; j += 1) {
        lat = Math.max(lat - (Math.random() * walk), -80);
        lat = Math.min(lat + (Math.random() * walk), 80);
        lng = Math.max(lng - (Math.random() * walk), -175);
        lng = Math.min(lng + (Math.random() * walk), 175);
      }
      return {lat: lat, lng: lng, text: text};
    },
    createCoordsNear = function (points, lat, long, size, spread, text) {
      var i;
      for (i = 0; i < size; i += 1) {
        points.push(randomPointNear(lat, long, spread, text));
      }
    };

  that.numPoints = numPoints;
  that.create70Coords = function (points) {
      createCoordsNear(points, 38.895111, -77.036667, 10, 1, 'Washington');
      createCoordsNear(points, 43, -75, 5, 1, 'New York');
      createCoordsNear(points, 34.05, -118.25, 10, 1, 'Los Angeles');
      createCoordsNear(points, 32.782778, -96.803889, 10, 1, 'Dallas');
      createCoordsNear(points, 19.433333, -99.133333, 10, 1, 'Mexico City');
      createCoordsNear(points, 29.762778, -95.383056, 5, 1, 'Houston');
      createCoordsNear(points, 52.500556, 13.398889, 20, 3, 'Europe');  // Diffuse Spread of points over Europe
  };

  that.createCoordinates = function (callback) {
    var i, points = [];
    for (i = 0; i  < that.numPoints; i += 1) {
      that.create70Coords(points);
    }
    callback(points);
  };

  that.addPointsAsMarkersToGroup = function (points, callback) {
    var i, marker,
      group = new H.map.Group();
      len = points.length;
    for (i = 0; i  < len; i += 1) {
         marker = new H.map.Marker(
          points[i]
        );
        marker.text = points[i].text;
        group.addObject(marker);
    }
    callback(group);
  };
}


