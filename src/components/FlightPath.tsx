import { useMemo, useRef, useEffect } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import {
  type CityWithPosition,
  GLOBE_RADIUS,
  ARC_HEIGHT_FACTOR,
} from "../utils/globeUtils";

interface FlightPathProps {
  id: number;
  start: CityWithPosition;
  end: CityWithPosition;
  progress: number;
  opacity: number;
  onFlightComplete: (id: number) => void;
  lineWidth?: number;
  color?: string | THREE.Color;
}

export function FlightPath({
  id,
  start,
  end,
  progress,
  opacity,
  onFlightComplete,
  lineWidth = 2,
  color = "#00ff00",
}: FlightPathProps) {
  const curvePoints = useMemo(() => {
    const startVec = start.position;
    const endVec = end.position;

    const midPoint = startVec.clone().lerp(endVec, 0.5);
    const midNormalized = midPoint.normalize();
    const arcMid = midNormalized.multiplyScalar(
      GLOBE_RADIUS + ARC_HEIGHT_FACTOR
    );

    const curve = new THREE.QuadraticBezierCurve3(startVec, arcMid, endVec);
    return curve.getPoints(50);
  }, [start, end]);

  const hasCompletedGrowth = useRef(false);

  useEffect(() => {
    if (progress >= 1 && !hasCompletedGrowth.current) {
      onFlightComplete(id);
      hasCompletedGrowth.current = true;
    }
    if (progress < 1) {
      hasCompletedGrowth.current = false;
    }
  }, [progress, id, onFlightComplete]);

  const animatedPoints = useMemo(() => {
    const endIndex = Math.floor(curvePoints.length * progress);
    return curvePoints.slice(0, Math.max(2, endIndex));
  }, [curvePoints, progress]);

  return animatedPoints.length > 1 && opacity > 0 ? (
    <Line
      points={animatedPoints}
      color={color}
      lineWidth={lineWidth}
      opacity={opacity}
      // @ts-ignore
      depthWrite={opacity === 1 ? true : false}
    />
  ) : null;
}
