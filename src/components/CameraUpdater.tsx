import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cities } from "../utils/globeUtils";
import type { CityWithPosition } from "../utils/globeUtils";

// Define the shape of data that CameraUpdater will pass up to App.tsx
interface CityLabelData {
  name: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

interface CameraUpdaterProps {
  onUpdateCityLabels: (labels: CityLabelData[]) => void;
}

export function CameraUpdater({ onUpdateCityLabels }: CameraUpdaterProps) {
  const { camera, gl } = useThree();

  // Reusable vectors/matrices to avoid constant object creation (and thus garbage collection)
  const tempScreenPosition = useRef(new THREE.Vector3());
  const tempCameraToCityVec = useRef(new THREE.Vector3()); // Re-using this for cameraToOrigin
  const tempCityNormal = useRef(new THREE.Vector3());
  const frustum = useRef(new THREE.Frustum());
  const projScreenMatrix = useRef(new THREE.Matrix4());

  useFrame(() => {
    // 1. Update camera's world matrix and construct frustum for accurate visibility checks
    camera.updateMatrixWorld();
    projScreenMatrix.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.current.setFromProjectionMatrix(projScreenMatrix.current);

    const updatedLabels: CityLabelData[] = [];

    cities.forEach((city: CityWithPosition) => {
      const cityPosition3D = city.position;

      // 2. Check if the city's 3D point is within the camera's view frustum
      const isInFrustum = frustum.current.containsPoint(cityPosition3D);

      // --- MODIFIED isFacingCamera LOGIC ---
      // This is more robust for checking if a point on a sphere is facing the camera.
      // 3. Check if the city is on the "front" side of the globe from the camera's perspective
      // Get the vector from the globe's center (0,0,0) to the city's position. This is the city's normal.
      tempCityNormal.current.copy(cityPosition3D).normalize();

      // Get the vector from the camera's position to the globe's center (0,0,0).
      // We use tempCameraToCityVec to avoid creating a new Vector3 every frame.
      tempCameraToCityVec.current.subVectors(
        new THREE.Vector3(0, 0, 0),
        camera.position
      ); // (0,0,0) - camera.position

      // If the dot product is positive, the city's normal points generally towards the camera,
      // meaning the city is on the front side of the globe relative to the camera.
      const isFacingCamera =
        tempCityNormal.current.dot(tempCameraToCityVec.current) > 0;
      // --- END MODIFIED LOGIC ---

      const isVisible = isInFrustum && isFacingCamera;

      // --- START GUARANTEED DEBUGGING OUTPUT ---
      // IMPORTANT: Choose a city that *should* be visible but isn't showing its label

      // Only add to the list if it's visible. The App.tsx will only render what's in this list.
      // if (isVisible) {
      //   // Calculate 2D screen position if visible
      //   tempScreenPosition.current.copy(cityPosition3D);
      //   tempScreenPosition.current.project(camera);

      //   // Convert NDC to pixel coordinates relative to the canvas
      //   const x =
      //     (tempScreenPosition.current.x * 0.5 + 0.5) *
      //     gl.domElement.clientWidth;
      //   const y =
      //     (-tempScreenPosition.current.y * 0.5 + 0.5) *
      //     gl.domElement.clientHeight;

      //   updatedLabels.push({
      //     name: city.name,
      //     position: { x, y },
      //     isVisible: true,
      //   });
      // }
    });

    // Pass the array of visible city label data up to the parent component (App.tsx)
    onUpdateCityLabels(updatedLabels);
  });

  return null;
}
