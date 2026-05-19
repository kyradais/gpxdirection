import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';

import OverlayModule from '../native/OverlayModule';

import {pick} from '@react-native-documents/picker';

import GPXParser from '../services/GPXParser';

export default function HomeScreen() {

  const [routeData, setRouteData] = useState([]);

  const pickGPX = async () => {

    try {

      const res = await pick({
        type: ['*/*'],
      });

      console.log('PICKED FILE = ', res);

      const parsed = await GPXParser.parse(
        res[0].uri,
      );

      console.log('PARSED GPX = ', parsed);

      setRouteData(parsed);

    } catch (err) {

      console.log('GPX ERROR = ', err);

    }

  };

  const requestOverlayPermission = async () => {

    try {

      if (Platform.OS === 'android') {

        console.log('OPENING SETTINGS');

        await Linking.openSettings();

      }

    } catch (err) {

      console.log('OVERLAY PERMISSION ERROR = ', err);

    }

  };

  const startOverlay = async () => {

    try {

      console.log('START OVERLAY CLICKED');

      await requestOverlayPermission();

      console.log('CALLING NATIVE MODULE');

      OverlayModule.startOverlay(
        '⬅ Left 120m',
      );

    } catch (err) {

      console.log('OVERLAY START ERROR = ', err);

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        GPX Direction
      </Text>

      {/* IMPORT GPX */}
      {/* 
      <TouchableOpacity
        style={styles.button}
        onPress={pickGPX}>
        <Text style={styles.buttonText}>
          Import GPX
        </Text>
      </TouchableOpacity>
      */}

      {/* START OVERLAY */}
      <TouchableOpacity
        style={styles.button}
        onPress={startOverlay}>

        <Text style={styles.buttonText}>
          Start Overlay
        </Text>

      </TouchableOpacity>

      <Text style={styles.info}>
        Total Point: {routeData.length}
      </Text>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },

  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#2b7cff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  info: {
    marginTop: 20,
    color: 'white',
  },

});