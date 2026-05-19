export function calculateTurn(a, b, c) {
  const angle =
    Math.atan2(
      c.lat - b.lat,
      c.lon - b.lon,
    ) -
    Math.atan2(
      a.lat - b.lat,
      a.lon - b.lon,
    );

  const deg = angle * (180 / Math.PI);

  if (deg > 25) {
    return 'RIGHT';
  }

  if (deg < -25) {
    return 'LEFT';
  }

  return 'STRAIGHT';
}