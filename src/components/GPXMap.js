import React from 'react';

import MapView, {
  Marker,
  Polyline,
  UrlTile,
} from 'react-native-maps';

export default function GPXMap({
  routePoints,
  currentLocation,
}) {

  const startPoint =
    routePoints.length > 0
      ? routePoints[0]
      : null;

  const endPoint =
    routePoints.length > 0
      ? routePoints[routePoints.length - 1]
      : null;

  return (

    <MapView
      style={{flex: 1}}
      initialRegion={{
        latitude:
          currentLocation?.latitude ||
          -0.0263,

        longitude:
          currentLocation?.longitude ||
          109.3425,

        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>

      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
      />

      {/* USER */}
      {currentLocation && (
        <Marker
          coordinate={{
            latitude:
              currentLocation.latitude,
            longitude:
              currentLocation.longitude,
          }}
          title="You"
        />
      )}

      {/* ROUTE */}
      {routePoints.length > 0 && (
        <Polyline
          coordinates={routePoints.map(
            p => ({
              latitude: p.lat,
              longitude: p.lon,
            }),
          )}
          strokeWidth={5}
          strokeColor="blue"
        />
      )}

      {/* START */}
      {startPoint && (
        <Marker
          coordinate={{
            latitude: startPoint.lat,
            longitude: startPoint.lon,
          }}
          title="Start"
        />
      )}

      {/* FINISH */}
      {endPoint && (
        <Marker
          coordinate={{
            latitude: endPoint.lat,
            longitude: endPoint.lon,
          }}
          title="Finish"
        />
      )}

    </MapView>

  );

}