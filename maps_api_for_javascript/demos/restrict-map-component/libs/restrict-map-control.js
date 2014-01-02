function extend(B, A) {
  function I() {}
  I.prototype = A.prototype;
  B.prototype = new I();
  B.prototype.constructor = B;
}

function RestrictMap(minZoom, maxZoom, boundingBox) {
  nokia.maps.map.component.Component.call(this);
  this.init(minZoom, maxZoom, boundingBox);
}
extend(RestrictMap,
    nokia.maps.map.component.Component);


RestrictMap.prototype.init = function (minZoom, maxZoom, boundingBox) {
  var that = this;
  that.set('boundingBox', boundingBox);
  that.set('minZoom', minZoom);
  that.set('maxZoom', maxZoom);


  that.eventHandlers = {
    restrictCenter : function (evt) {
      if (that.__map.center.latitude > that.boundingBox.topLeft.latitude
          || that.__map.center.longitude < that.boundingBox.topLeft.longitude
          || that.__map.center.latitude < that.boundingBox.bottomRight.latitude
          || that.__map.center.longitude > that.boundingBox.bottomRight.longitude) {
        var latitude =  Math.max(Math.min(that.__map.center.latitude,
            that.boundingBox.topLeft.latitude), that.boundingBox.bottomRight.latitude),
          longitude = Math.min(Math.max(that.__map.center.longitude,
            that.boundingBox.topLeft.longitude), that.boundingBox.bottomRight.longitude);
        that.__map.setCenter(new nokia.maps.geo.Coordinate(latitude, longitude));
        evt.cancel();
      }
    },
    baseMapTypeObserver : function (obj, key, newValue, oldValue) {
      if (oldValue) {
        oldValue.min = that.unrestrictedMin;
        oldValue.max = that.unrestrictedMax;
      }
      if (newValue) {
        that.unrestrictedMin = newValue.min;
        that.unrestrictedMax = newValue.max;
        if (that.minZoom) {
          newValue.min = that.minZoom;
        }
        if (that.maxZoom) {
          newValue.max = that.maxZoom;
        }
      }
    }
  };
};

RestrictMap.prototype.attach = function (map) {
  this.__map = map;
  map.addListener('dragend', this.eventHandlers.restrictCenter);
  map.addListener('mapviewchangeend', this.eventHandlers.restrictCenter);
  map.addObserver('baseMapType', this.eventHandlers.baseMapTypeObserver);
  this.eventHandlers.baseMapTypeObserver(map, 'baseMapType', map.get('baseMapType'), null);
};

RestrictMap.prototype.detach = function (map) {
  map.removeListener('dragend',  this.eventHandlers.restrictCenter);
  map.removeListener('mapviewchangeend',  this.eventHandlers.restrictCenter);
  this.eventHandlers.baseMapTypeObserver(map, 'baseMapType', null, map.get('baseMapType'));
  map.removeObserver('baseMapType', this.eventHandlers.baseMapTypeObserver);
  this.__map = null;

};

RestrictMap.prototype.getId = function () {
  return 'RestrictMap';
};
RestrictMap.prototype.getVersion = function () {
  return '1.0.0';
};
