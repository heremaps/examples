function randomLocationGenerator(numPoints) {

	that = this;
	this.points = [];
	this.numPoints = numPoints;
	this.addCount = 0;
	this.container = new nokia.maps.map.Container();

	// Define the a coroutine - add 70 points.
	this.create70Coords = nokia.maps.util.Coroutine.create("iterator", function(scope, context) {
		createCoordsNear(38.895111, -77.036667, 10, 1, "Washington");
		createCoordsNear(43, -75, 5, 1, "New York");
		createCoordsNear(34.05, -118.25, 10, 1, "Los Angeles");
		createCoordsNear(32.782778, -96.803889, 10, 1, "Houston");
		createCoordsNear(19.433333, -99.133333, 10, 1, "Dallas");
		createCoordsNear(29.762778, -95.383056, 5, 1, "Mexico City");
		createCoordsNear(52.500556, 13.398889, 20, 3, "Europe");
		// Diffuse Spread of points over Europe
	});

	this.add70MarkersToContainer = nokia.maps.util.Coroutine.create("adder", function(scope, context) {
		var start = scope.start * 70;
		for ( j = 0; j < 70; j++) {
			var coord = [that.points[j + start].latitude, that.points[j + start].longitude];
			scope.container.objects.add(new nokia.maps.map.StandardMarker(coord));
		}
	}, "start", "container");

	var randomPointNear = function(lat, lng, walk, text) {
		for ( j = 0; j < 3; j++) {
			lat = Math.max(lat - (Math.random() * walk), -80);
			lat = Math.min(lat + (Math.random() * walk), 80);
			lng = Math.max(lng - (Math.random() * walk), -175);
			lng = Math.min(lng + (Math.random() * walk), 175);
		}
		return {
			latitude : lat,
			longitude : lng,
			text : text
		};
	}
	var createCoordsNear = function(lat, long, size, spread, text) {
		for (var i = 0; i < size; i++) {
			that.points.push(randomPointNear(lat, long, spread, text));
		}
	}

	this.createCoordinates = function(callback) {

		for (var i = 0; i < that.numPoints; i++) {
			var coroutine = that.create70Coords();
			coroutine.addObserver("status", function(context, key, value, oldValue) {
				if (value == nokia.maps.util.Coroutine.TERMINATED) {// When gets terminated
					that.addCount++;
					if (that.addCount == that.numPoints) {
						callback(that.points);
					}
				}
			});
		}
	}

	this.addPointsAsMarkersToContainer = function(points, callback) {
		that.points = points;
		for (var i = 0; i < that.numPoints; i++) {
			var coroutine = that.add70MarkersToContainer(i, that.container);
			coroutine.addObserver("status", function(context, key, value, oldValue) {
				if (value == nokia.maps.util.Coroutine.TERMINATED) {// When gets terminated
					that.addCount--;
					if (that.addCount == 0) {
						callback(that.container);
					}
				}
			});
		}

	}
}