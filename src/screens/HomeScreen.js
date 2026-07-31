import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MapView, {
  Marker,
  Polyline,
  UrlTile,
} from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';

import {pick} from '@react-native-documents/picker';

import RNFS from 'react-native-fs';

import {XMLParser} from 'fast-xml-parser';

export default function HomeScreen() {

  const [routeData, setRouteData] =
    useState([]);

  const [currentLocation,
  setCurrentLocation] =
    useState(null);

  const [navigationStarted,
  setNavigationStarted] =
    useState(false);

  const [direction,
  setDirection] =
    useState('⬆');

  const [directionText,
  setDirectionText] =
    useState('Waiting');

  const [finished,
  setFinished] =
    useState(false);

  /*
  =========================================
  GPS WATCH
  =========================================
  */

  useEffect(() => {

    const watchId =
      Geolocation.watchPosition(

        position => {

          const location = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          };

          setCurrentLocation(
            location,
          );

          if (
            navigationStarted &&
            routeData.length > 0
          ) {

            handleNavigation(
              location,
            );

          }

        },

        error => {

          console.log(
            'GPS ERROR = ',
            error,
          );

        },

        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 1000,
        },
      );

    return () => {

      Geolocation.clearWatch(
        watchId,
      );

    };

  }, [
    navigationStarted,
    routeData,
  ]);

  /*
  =========================================
  GPX IMPORT
  =========================================
  */

  const pickGPX = async () => {

    try {

      const res = await pick({
        type: ['*/*'],
      });

      console.log(
        'PICKED FILE = ',
        res,
      );

      const uri = res[0].uri;

      const file =
        await RNFS.readFile(
          uri,
          'utf8',
        );

      const parser =
        new XMLParser();

      const parsed =
        parser.parse(file);

      const trackpoints =
        parsed.gpx.trk.trkseg
          .trkpt || [];

      const result =
        trackpoints.map(
          point => ({
            lat: parseFloat(
              point['@_lat'],
            ),

            lon: parseFloat(
              point['@_lon'],
            ),
          }),
        );

      console.log(
        'PARSED GPX = ',
        result,
      );

      setRouteData(result);

    } catch (err) {

      console.log(
        'GPX ERROR = ',
        err,
      );

    }

  };

  /*
  =========================================
  DISTANCE
  =========================================
  */

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2,
  ) => {

    const R = 6371e3;

    const φ1 =
      lat1 * Math.PI / 180;

    const φ2 =
      lat2 * Math.PI / 180;

    const Δφ =
      (lat2 - lat1) *
      Math.PI / 180;

    const Δλ =
      (lon2 - lon1) *
      Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) *
      Math.sin(Δφ / 2) +

      Math.cos(φ1) *
      Math.cos(φ2) *

      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a),
      );

    return R * c;
  };

  /*
  =========================================
  TURN CALCULATOR
  =========================================
  */

  const calculateTurn = (
    a,
    b,
    c,
  ) => {

    const angle =

      Math.atan2(
        c.lat - b.lat,
        c.lon - b.lon,
      ) -

      Math.atan2(
        a.lat - b.lat,
        a.lon - b.lon,
      );

    const deg =
      angle *
      (180 / Math.PI);

    if (deg > 25) {

      return 'RIGHT';

    }

    if (deg < -25) {

      return 'LEFT';

    }

    return 'STRAIGHT';
  };

  /*
  =========================================
  FIND NEAREST POINT
  =========================================
  */

  const findNearestPoint =
    currentLocation => {

      let nearestIndex = 0;

      let nearestDistance =
        Number.MAX_VALUE;

      routeData.forEach(
        (point, index) => {

          const distance =
            calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              point.lat,
              point.lon,
            );

          if (
            distance <
            nearestDistance
          ) {

            nearestDistance =
              distance;

            nearestIndex =
              index;

          }

        },
      );

      return {
        nearestIndex,
        nearestDistance,
      };
    };

  /*
  =========================================
  NAVIGATION ENGINE
  =========================================
  */

  const handleNavigation =
    location => {

      const {
        nearestIndex,
      } = findNearestPoint(
        location,
      );

      const a =
        routeData[nearestIndex];

      const b =
        routeData[
          nearestIndex + 1
        ];

      const c =
        routeData[
          nearestIndex + 2
        ];

      if (!a || !b || !c) {

        setDirection('🏁');

        setDirectionText(
          'Finish',
        );

        setFinished(true);

        return;
      }

      const turn =
        calculateTurn(
          a,
          b,
          c,
        );

      const distance =
        calculateDistance(
          location.latitude,
          location.longitude,
          b.lat,
          b.lon,
        );

      console.log({
        turn,
        distance,
      });

      if (distance <= 15) {

        if (
          turn === 'LEFT'
        ) {

          setDirection('⬅');

        } else if (
          turn === 'RIGHT'
        ) {

          setDirection('➡');

        } else {

          setDirection('⬆');

        }

      } else {

        setDirection('⬆');

      }

      setDirectionText(
        `${Math.round(
          distance,
        )}m`,
      );
    };

  /*
  =========================================
  START NAVIGATION
  =========================================
  */

  const startNavigation =
    () => {

      if (
        !currentLocation
      ) {

        Alert.alert(
          'GPS belum aktif',
        );

        return;
      }

      if (
        routeData.length === 0
      ) {

        Alert.alert(
          'GPX belum dipilih',
        );

        return;
      }

      const startPoint =
        routeData[0];

      const distance =
        calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          startPoint.lat,
          startPoint.lon,
        );

      console.log(
        'DISTANCE TO START = ',
        distance,
      );

      if (distance > 10) {

        Alert.alert(
          'Anda terlalu jauh dari titik start',
        );

        return;
      }

      setNavigationStarted(
        true,
      );
    };

  /*
  =========================================
  FINISH NAVIGATION
  =========================================
  */

  const finishNavigation =
    () => {

      setFinished(false);

      setNavigationStarted(
        false,
      );

      setRouteData([]);

      setDirection('⬆');

      setDirectionText(
        'Waiting',
      );
    };

  /*
  =========================================
  MAP DATA
  =========================================
  */

  const startPoint =
    routeData.length > 0
      ? routeData[0]
      : null;

  const endPoint =
    routeData.length > 0
      ? routeData[
          routeData.length - 1
        ]
      : null;

  /*
  =========================================
  UI
  =========================================
  */

  return (

    <View style={styles.container}>

      {/* HUD */}
      <View style={styles.hud}>

        <Text style={styles.arrow}>
          {direction}
        </Text>

        <Text style={styles.hudText}>
          {directionText}
        </Text>

      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>

        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          initialRegion={{
            latitude:
              currentLocation
                ?.latitude ||
              -0.0263,

            longitude:
              currentLocation
                ?.longitude ||
              109.3425,

            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>

          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />

          {/* ROUTE */}
          {routeData.length >
            0 && (

            <Polyline
              coordinates={routeData.map(
                p => ({
                  latitude:
                    p.lat,

                  longitude:
                    p.lon,
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
                latitude:
                  startPoint.lat,

                longitude:
                  startPoint.lon,
              }}
              title="Start"
            />

          )}

          {/* FINISH */}
          {endPoint && (

            <Marker
              coordinate={{
                latitude:
                  endPoint.lat,

                longitude:
                  endPoint.lon,
              }}
              title="Finish"
            />

          )}

        </MapView>

      </View>

      {/* UPLOAD */}
      <TouchableOpacity
        style={styles.button}
        onPress={pickGPX}>

        <Text style={styles.buttonText}>
          Upload GPX
        </Text>

      </TouchableOpacity>

      {/* START */}
      {routeData.length > 0 &&
        !navigationStarted && (

        <TouchableOpacity
          style={styles.button}
          onPress={
            startNavigation
          }>

          <Text
            style={
              styles.buttonText
            }>

            Start

          </Text>

        </TouchableOpacity>

      )}

      {/* FINISH */}
      {finished && (

        <TouchableOpacity
          style={styles.button}
          onPress={
            finishNavigation
          }>

          <Text
            style={
              styles.buttonText
            }>

            Finish

          </Text>

        </TouchableOpacity>

      )}

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
  },

  hud: {
    width: '92%',
    height: 120,
    backgroundColor: '#1b1b1b',
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },

  hudText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },

  mapContainer: {
    width: '92%',
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
  },

  map: {
    flex: 1,
  },

  button: {
    width: '92%',
    height: 55,
    backgroundColor: '#2b7cff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

});