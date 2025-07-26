import { useState, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { CityWithPosition } from "../utils/globeUtils";
import { cities } from "../utils/globeUtils";
import { CityPoint } from "./CityPoint";
import { FlightPath } from "./FlightPath";
import * as THREE from "three"; // Import THREE for Vector3, Frustum, Matrix4

interface ActiveFlight {
  id: number;
  from: CityWithPosition;
  to: CityWithPosition;
  progress: number;
  speed: number;
  status: "growing" | "fadingOut" | "done";
  opacity: number;
}

export interface DisplayedCity {
  name: string;
  position: { x: number; y: number }; // 2D screen position
  timestamp: number; // For fading out
}

const DISPLAY_DURATION = 2000; // milliseconds for city name to be visible

interface FlightCoordinatorProps {
  onCityPopup: (city: DisplayedCity | null) => void;
}

export function FlightCoordinator({ onCityPopup }: FlightCoordinatorProps) {
  const MAX_ACTIVE_FLIGHTS = 20;
  const FADE_OUT_DURATION = 0.6;
  const FADE_IN_DURATION = 0.4;
  const MIN_FLIGHT_DURATION = 1.5;
  const MAX_FLIGHT_DURATION = 3.0;

  const [activeFlights, setActiveFlights] = useState<ActiveFlight[]>([]);
  const nextFlightId = useRef(0);

  // Ref to hold the candidate city for popup, regardless of its current visibility
  const candidateCityForPopup = useRef<{
    name: string;
    position3D: THREE.Vector3;
    timestamp: number;
  } | null>(null);

  const addNewFlight = useCallback(() => {
    if (
      activeFlights.filter((f) => f.status !== "done").length >=
      MAX_ACTIVE_FLIGHTS
    ) {
      return;
    }

    let from = cities[Math.floor(Math.random() * cities.length)];
    let to;
    do {
      to = cities[Math.floor(Math.random() * cities.length)];
    } while (to.name === from.name);

    const randomSpeed =
      1 /
      (MIN_FLIGHT_DURATION +
        Math.random() * (MAX_FLIGHT_DURATION - MIN_FLIGHT_DURATION));

    setActiveFlights((prevFlights) => [
      ...prevFlights,
      {
        id: nextFlightId.current++,
        from,
        to,
        progress: 0,
        speed: randomSpeed,
        status: "growing",
        opacity: 0,
      },
    ]);
  }, [activeFlights]);

  useEffect(() => {
    if (activeFlights.length < MAX_ACTIVE_FLIGHTS) {
      const flightsToAdd = MAX_ACTIVE_FLIGHTS - activeFlights.length;
      for (let i = 0; i < flightsToAdd; i++) {
        addNewFlight();
      }
    }
  }, [addNewFlight, activeFlights.length]);

  const handleFlightGrowthComplete = useCallback(
    (id: number, arrivedCity: CityWithPosition) => {
      setActiveFlights((prevFlights) =>
        prevFlights.map((flight) =>
          flight.id === id
            ? { ...flight, status: "fadingOut", progress: 1 }
            : flight
        )
      );
      // Set the candidate city for popup, storing its 3D position and timestamp
      candidateCityForPopup.current = {
        name: arrivedCity.name,
        position3D: arrivedCity.position,
        timestamp: Date.now(),
      };
      addNewFlight();
    },
    [addNewFlight]
  );

  useFrame(({ camera, gl }, delta) => {
    setActiveFlights((prevFlights) => {
      const updatedFlights = prevFlights
        .map((flight) => {
          let newProgress = flight.progress;
          let newOpacity = flight.opacity;
          let newStatus = flight.status;

          if (flight.status === "growing") {
            newProgress = Math.min(flight.progress + delta * flight.speed, 1);
            newOpacity = Math.min(flight.opacity + delta / FADE_IN_DURATION, 1);
            if (newProgress >= 1 && newOpacity >= 1) {
              newStatus = "fadingOut";
            }
          } else if (flight.status === "fadingOut") {
            newOpacity = Math.max(
              flight.opacity - delta / FADE_OUT_DURATION,
              0
            );
            if (newOpacity <= 0) {
              newStatus = "done";
            }
          }
          return {
            ...flight,
            progress: newProgress,
            opacity: newOpacity,
            status: newStatus,
          };
        })
        .filter((flight) => flight.status !== "done");

      return updatedFlights;
    });

    let currentCityIsVisibleThisFrame = false; // Flag to track visibility for current frame

    if (candidateCityForPopup.current) {
      const cityData = candidateCityForPopup.current;
      const cityPosition3D = cityData.position3D;

      // --- Perform Visibility Checks ---
      // 1. Update camera frustum (crucial for accurate containsPoint check)
      camera.updateMatrixWorld(); // Ensure camera's world matrix is up-to-date
      const frustum = new THREE.Frustum();
      const projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(projScreenMatrix);

      // 2. Check if the city's 3D point is within the camera's view frustum
      const isInFrustum = frustum.containsPoint(cityPosition3D);

      // 3. Check if the city is on the "front" side of the globe from the camera's perspective
      // Calculate vector from camera to city
      const cameraToCityVec = new THREE.Vector3().subVectors(
        cityPosition3D,
        camera.position
      );
      // Get the city's normal (its normalized position vector for a globe centered at origin)
      const cityNormal = cityPosition3D.clone().normalize();
      // If dot product > 0, the city is generally facing the camera
      const isFacingCamera = cameraToCityVec.dot(cityNormal) > 0;

      const combinedVisibility = isInFrustum && isFacingCamera;

      // If visible, calculate screen position and send data to parent
      if (combinedVisibility) {
        const screenPosition = new THREE.Vector3();
        screenPosition.copy(cityPosition3D);
        screenPosition.project(camera); // Project 3D world coordinates to NDC

        const x = (screenPosition.x * 0.5 + 0.5) * gl.domElement.clientWidth;
        const y = (-screenPosition.y * 0.5 + 0.5) * gl.domElement.clientHeight;

        onCityPopup({
          name: cityData.name,
          position: { x, y },
          timestamp: cityData.timestamp,
        });
        currentCityIsVisibleThisFrame = true; // Set flag
      }

      // Hide the candidate city if its display duration has passed
      if (Date.now() - cityData.timestamp > DISPLAY_DURATION) {
        candidateCityForPopup.current = null;
      }
    }

    // If there's no candidate city, or if the candidate city is not visible this frame,
    // ensure the popup in the parent is hidden.
    if (!candidateCityForPopup.current || !currentCityIsVisibleThisFrame) {
      onCityPopup(null);
    }
  });

  return (
    <>
      {cities.map((city) => (
        <CityPoint key={city.name} position={city.position} color="yellow" />
      ))}
      {activeFlights.map((flight) => (
        <FlightPath
          key={flight.id}
          id={flight.id}
          start={flight.from}
          end={flight.to}
          progress={flight.progress}
          opacity={flight.opacity}
          onFlightComplete={(id) => handleFlightGrowthComplete(id, flight.to)}
          lineWidth={2}
          color={"#00ff00"}
        />
      ))}
      {/* The HTML div for the pop-up is now rendered in App.tsx */}
    </>
  );
}
