import Geolocation from 'react-native-geolocation-service';

const LocationService = {
  start: callback => {
    Geolocation.watchPosition(
      position => {
        callback(position);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 3000,
        fastestInterval: 2000,
      },
    );
  },
};

export default LocationService;