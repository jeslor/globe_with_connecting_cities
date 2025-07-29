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
