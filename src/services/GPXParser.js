import RNFS from 'react-native-fs';
import {XMLParser} from 'fast-xml-parser';

const parser = new XMLParser();

const GPXParser = {
  parse: async uri => {
    try {
      const file = await RNFS.readFile(uri, 'utf8');

      const parsed = parser.parse(file);

      const trackpoints =
        parsed.gpx.trk.trkseg.trkpt || [];

      const result = trackpoints.map(point => ({
        lat: parseFloat(point['@_lat']),
        lon: parseFloat(point['@_lon']),
      }));

      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

export default GPXParser;