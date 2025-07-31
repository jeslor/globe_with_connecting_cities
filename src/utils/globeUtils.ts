import * as THREE from "three";

export interface LatLon {
  lat: number;
  lon: number;
}

let GLOBE_RADIUS: any; // Default radius for larger screens
const width = window.innerWidth;
if (width < 480) {
  // Smaller radius for mobile
  GLOBE_RADIUS = 1; // Adjusted radius for mobile
} else if (width < 768) {
  // Smaller radius for mobile landscapes
  GLOBE_RADIUS = 1.5; // Adjusted radius for mobile
} else if (width < 1024) {
  // Medium radius for tablets
  GLOBE_RADIUS = 2.0; // Adjusted radius for tablets
} else {
  GLOBE_RADIUS = 2.4; // Default radius for larger screens
}
export { GLOBE_RADIUS };
export const ARC_HEIGHT_FACTOR = 0.5; // Controls the height of the flight path arc

export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Pre-calculate city positions for performance
export interface CityWithPosition extends LatLon {
  name: string;
  position: THREE.Vector3;
}

export const cities: CityWithPosition[] = [
  {
    name: "Lagos",
    lat: 6.5244,
    lon: 3.3792,
    position: latLonToVector3(6.5244, 3.3792), // Murtala Muhammed International Airport (LOS)
  },
  {
    name: "Accra",
    lat: 5.6037,
    lon: -0.187,
    position: latLonToVector3(5.6037, -0.187), // Kotoka International Airport (ACC)
  },
  {
    name: "Kampala",
    lat: 0.3476,
    lon: 32.5825,
    position: latLonToVector3(0.3476, 32.5825), // Served by Entebbe International Airport (EBB)
  },
  {
    name: "Addis Ababa",
    lat: 9.03,
    lon: 38.74,
    position: latLonToVector3(9.03, 38.74), // Bole International Airport (ADD)
  },
  {
    name: "Algiers",
    lat: 36.7538,
    lon: 3.0588,
    position: latLonToVector3(36.7538, 3.0588), // Houari Boumediene Airport (ALG)
  },
  {
    name: "Dakar",
    lat: 14.7167,
    lon: -17.4677,
    position: latLonToVector3(14.7167, -17.4677), // Blaise Diagne International Airport (DSS)
  },
  {
    name: "Kinshasa",
    lat: -4.4419,
    lon: 15.2663,
    position: latLonToVector3(-4.4419, 15.2663), // N'djili International Airport (FIH)
  },
  {
    name: "Abidjan",
    lat: 5.3599,
    lon: -4.0083,
    position: latLonToVector3(5.3599, -4.0083), // Félix-Houphouët-Boigny International Airport (ABJ)
  },
  {
    name: "Khartoum",
    lat: 15.5007,
    lon: 32.5599,
    position: latLonToVector3(15.5007, 32.5599), // Khartoum International Airport (KRT)
  },
  {
    name: "Johannesburg",
    lat: -26.2041,
    lon: 28.0473,
    position: latLonToVector3(-26.2041, 28.0473), // O.R. Tambo International Airport (JNB)
  },
  {
    name: "Chicago",
    lat: 41.8781,
    lon: -87.6298,
    position: latLonToVector3(41.8781, -87.6298), // O'Hare (ORD)
  },
  {
    name: "Houston",
    lat: 29.7604,
    lon: -95.3698,
    position: latLonToVector3(29.7604, -95.3698), // George Bush Intercontinental (IAH)
  },
  {
    name: "Atlanta",
    lat: 33.749,
    lon: -84.388,
    position: latLonToVector3(33.749, -84.388), // Hartsfield–Jackson (ATL)
  },
  {
    name: "San Francisco",
    lat: 37.7749,
    lon: -122.4194,
    position: latLonToVector3(37.7749, -122.4194), // SFO
  },
  {
    name: "Seattle",
    lat: 47.6062,
    lon: -122.3321,
    position: latLonToVector3(47.6062, -122.3321), // SEA
  },
  {
    name: "Boston",
    lat: 42.3601,
    lon: -71.0589,
    position: latLonToVector3(42.3601, -71.0589), // BOS
  },
  {
    name: "Dallas",
    lat: 32.7767,
    lon: -96.797,
    position: latLonToVector3(32.7767, -96.797), // DFW
  },
  {
    name: "Vancouver",
    lat: 49.2827,
    lon: -123.1207,
    position: latLonToVector3(49.2827, -123.1207), // YVR
  },
  {
    name: "Montreal",
    lat: 45.5017,
    lon: -73.5673,
    position: latLonToVector3(45.5017, -73.5673), // YUL
  },
  {
    name: "Calgary",
    lat: 51.0447,
    lon: -114.0719,
    position: latLonToVector3(51.0447, -114.0719), // YYC
  },
  {
    name: "Frankfurt",
    lat: 50.1109,
    lon: 8.6821,
    position: latLonToVector3(50.1109, 8.6821),
  },
  {
    name: "New York",
    lat: 40.7128,
    lon: -74.006,
    position: latLonToVector3(40.7128, -74.006),
  },
  {
    name: "Tokyo",
    lat: 35.6895,
    lon: 139.6917,
    position: latLonToVector3(35.6895, 139.6917),
  },
  {
    name: "Sydney",
    lat: -33.8688,
    lon: 151.2093,
    position: latLonToVector3(-33.8688, 151.2093),
  },
  {
    name: "Cape Town",
    lat: -33.9249,
    lon: 18.4241,
    position: latLonToVector3(-33.9249, 18.4241),
  },
  {
    name: "Melbourne",
    lat: -37.8136,
    lon: 144.9631,
    position: latLonToVector3(-37.8136, 144.9631), // MEL
  },
  {
    name: "Brisbane",
    lat: -27.4698,
    lon: 153.0251,
    position: latLonToVector3(-27.4698, 153.0251), // BNE
  },
  {
    name: "Perth",
    lat: -31.9505,
    lon: 115.8605,
    position: latLonToVector3(-31.9505, 115.8605), // PER
  },
  {
    name: "Nairobi",
    lat: -1.2921,
    lon: 36.8219,
    position: latLonToVector3(-1.2921, 36.8219),
  },
  {
    name: "Toronto",
    lat: 43.65107,
    lon: -79.347015,
    position: latLonToVector3(43.65107, -79.347015),
  },
  {
    name: "Rio de Janeiro",
    lat: -22.9068,
    lon: -43.1729,
    position: latLonToVector3(-22.9068, -43.1729),
  },
  {
    name: "Paris",
    lat: 48.8566,
    lon: 2.3522,
    position: latLonToVector3(48.8566, 2.3522),
  },
  {
    name: "Dubai",
    lat: 25.2048,
    lon: 55.2708,
    position: latLonToVector3(25.2048, 55.2708),
  },
  {
    name: "Bangkok",
    lat: 13.7563,
    lon: 100.5018,
    position: latLonToVector3(13.7563, 100.5018), // BKK
  },
  {
    name: "Jakarta",
    lat: -6.2088,
    lon: 106.8456,
    position: latLonToVector3(-6.2088, 106.8456), // CGK
  },
  {
    name: "Hanoi",
    lat: 21.0285,
    lon: 105.8542,
    position: latLonToVector3(21.0285, 105.8542), // HAN
  },
  {
    name: "Manila",
    lat: 14.5995,
    lon: 120.9842,
    position: latLonToVector3(14.5995, 120.9842), // MNL
  },
  {
    name: "London",
    lat: 51.5074,
    lon: -0.1278,
    position: latLonToVector3(51.5074, -0.1278),
  },
  {
    name: "Los Angeles",
    lat: 34.0522,
    lon: -118.2437,
    position: latLonToVector3(34.0522, -118.2437),
  },
  {
    name: "Moscow",
    lat: 55.7558,
    lon: 37.6173,
    position: latLonToVector3(55.7558, 37.6173),
  },
  {
    name: "Kingston",
    lat: 17.9712,
    lon: -76.7936,
    position: latLonToVector3(17.9712, -76.7936), // Norman Manley (KIN)
  },
  {
    name: "Port of Spain",
    lat: 10.6549,
    lon: -61.5019,
    position: latLonToVector3(10.6549, -61.5019), // Piarco (POS)
  },
  {
    name: "Havana",
    lat: 23.1136,
    lon: -82.3666,
    position: latLonToVector3(23.1136, -82.3666), // José Martí (HAV)
  },
  {
    name: "Bogotá",
    lat: 4.711,
    lon: -74.0721,
    position: latLonToVector3(4.711, -74.0721), // El Dorado (BOG)
  },
  {
    name: "Caracas",
    lat: 10.4806,
    lon: -66.9036,
    position: latLonToVector3(10.4806, -66.9036), // Simón Bolívar (CCS)
  },

  {
    name: "Mexico City",
    lat: 19.4326,
    lon: -99.1332,
    position: latLonToVector3(19.4326, -99.1332),
  },
  {
    name: "Mumbai",
    lat: 19.076,
    lon: 72.8777,
    position: latLonToVector3(19.076, 72.8777),
  },
  // --- Additional 10 Cities ---
  {
    name: "Beijing",
    lat: 39.9042,
    lon: 116.4074,
    position: latLonToVector3(39.9042, 116.4074),
  },
  {
    name: "Santiago",
    lat: -33.4489,
    lon: -70.6693,
    position: latLonToVector3(-33.4489, -70.6693),
  },
  {
    name: "Berlin",
    lat: 52.52,
    lon: 13.405,
    position: latLonToVector3(52.52, 13.405),
  },
  {
    name: "Istanbul",
    lat: 41.0082,
    lon: 28.9784,
    position: latLonToVector3(41.0082, 28.9784),
  },
  {
    name: "Lima",
    lat: -12.0464,
    lon: -77.0428,
    position: latLonToVector3(-12.0464, -77.0428),
  },
  {
    name: "Cairo",
    lat: 30.0444,
    lon: 31.2357,
    position: latLonToVector3(30.0444, 31.2357),
  },
  {
    name: "Seoul",
    lat: 37.5665,
    lon: 126.978,
    position: latLonToVector3(37.5665, 126.978),
  },
  {
    name: "Buenos Aires",
    lat: -34.6037,
    lon: -58.3816,
    position: latLonToVector3(-34.6037, -58.3816),
  },
  {
    name: "Wellington",
    lat: -41.2865,
    lon: 174.7762,
    position: latLonToVector3(-41.2865, 174.7762),
  },
  {
    name: "Stockholm",
    lat: 59.3293,
    lon: 18.0686,
    position: latLonToVector3(59.3293, 18.0686),
  },
];
