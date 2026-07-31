import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function DirectionHUD({
  direction,
  distance,
}) {

  return (
    <View style={styles.container}>

      <Text style={styles.arrow}>
        {direction}
      </Text>

      <Text style={styles.distance}>
        {distance}
      </Text>

    </View>
  );

}

const styles = StyleSheet.create({

  container: {
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

  distance: {
    color: 'white',
    marginTop: 10,
    fontSize: 18,
  },

});