import Geolocation from 'react-native-geolocation-service';

const LocationService = {

  watchId: null,

  start: callback => {

    this.watchId =
      Geolocation.watchPosition(

        position => {

          callback({
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          });

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
          showsBackgroundLocationIndicator: true,
        },
      );
  },

  stop: () => {

    if (this.watchId !== null) {

      Geolocation.clearWatch(
        this.watchId,
      );

    }

  },

};

export default LocationService;