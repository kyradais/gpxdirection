import {calculateDistance}
from '../utils/distance';

import {
  calculateTurn,
} from '../utils/turnCalculator';

const NavigationService = {

  findNearestPoint(
    currentLocation,
    routePoints,
  ) {

    let nearestIndex = 0;

    let nearestDistance =
      Number.MAX_VALUE;

    routePoints.forEach(
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

          nearestIndex = index;

        }

      },
    );

    return {
      nearestIndex,
      nearestDistance,
    };
  },

  getNextDirection(
    currentLocation,
    routePoints,
  ) {

    const {
      nearestIndex,
    } = this.findNearestPoint(
      currentLocation,
      routePoints,
    );

    const a =
      routePoints[nearestIndex];

    const b =
      routePoints[nearestIndex + 1];

    const c =
      routePoints[nearestIndex + 2];

    if (!a || !b || !c) {

      return {
        direction: 'FINISH',
        distance: 0,
      };

    }

    const turn =
      calculateTurn(a, b, c);

    const distance =
      calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        b.lat,
        b.lon,
      );

    if (distance <= 15) {

      return {
        direction: turn,
        distance:
          Math.round(distance),
      };

    }

    return {
      direction: 'STRAIGHT',
      distance:
        Math.round(distance),
    };
  },

};

export default NavigationService;