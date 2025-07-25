import React, { useState, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { CityWithPosition } from "../utils/globeUtils";
import { cities } from "../utils/globeUtils";
import { CityPoint } from "./CityPoint";
import { FlightPath } from "./FlightPath";

interface ActiveFlight {
  id: number;
  from: CityWithPosition;
  to: CityWithPosition;
  progress: number;
  speed: number;
  status: "growing" | "fadingOut" | "done";
  opacity: number;
}

export function FlightCoordinator() {
  const MAX_ACTIVE_FLIGHTS = 20;
  const FADE_OUT_DURATION = 0.6;
  const FADE_IN_DURATION = 0.4;
  const MIN_FLIGHT_DURATION = 1.5;
  const MAX_FLIGHT_DURATION = 3.0;

  const [activeFlights, setActiveFlights] = useState<ActiveFlight[]>([]);
  const nextFlightId = useRef(0);

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
    (id: number) => {
      setActiveFlights((prevFlights) =>
        prevFlights.map((flight) =>
          flight.id === id
            ? { ...flight, status: "fadingOut", progress: 1 }
            : flight
        )
      );
      addNewFlight();
    },
    [addNewFlight]
  );

  useFrame((_, delta) => {
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
          onFlightComplete={handleFlightGrowthComplete}
          lineWidth={2}
          color={"#00ff00"}
        />
      ))}
    </>
  );
}
