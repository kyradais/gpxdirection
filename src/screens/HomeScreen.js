import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

      console.log(res);

      const parsed = await GPXParser.parse(
        res[0].uri,
      );

      setRouteData(parsed);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPX Direction</Text>

      {/* <TouchableOpacity style={styles.button} onPress={pickGPX}>
        <Text style={styles.buttonText}>Import GPX</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          OverlayModule.startOverlay('⬅ Left 120m');
        }}>
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
    padding: 15,
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