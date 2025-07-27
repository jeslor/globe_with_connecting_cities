// src/components/SceneSetup.tsx
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber"; // useThree is not strictly needed for this specific logic, but often useful in SceneSetup
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface SceneSetupProps {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}

export function SceneSetup({ controlsRef }: SceneSetupProps) {
  // We use useThree to potentially access renderer, scene, camera if needed for other setup tasks,
  // though not strictly required for just OrbitControls autoRotate.
  const { camera } = useThree();
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const controls = controlsRef.current;

    if (controls) {
      // Set initial auto-rotate properties directly on the controls instance
      controls.autoRotate = true; // Start rotating automatically
      controls.autoRotateSpeed = 0.5; // Set desired speed (adjust this value)

      const handleStart = () => {
        setIsInteracting(true);
        controls.autoRotate = false; // Pause rotation immediately when interaction starts
      };
      const handleEnd = () => {
        setIsInteracting(false);
        // We'll rely on the second useEffect to set autoRotate back to true
        // This allows OrbitControls to finish its damping animation before auto-rotation resumes.
      };

      controls.addEventListener("start", handleStart);
      controls.addEventListener("end", handleEnd);

      // Clean up event listeners when the component unmounts
      return () => {
        controls.removeEventListener("start", handleStart);
        controls.removeEventListener("end", handleEnd);
      };
    }
  }, [controlsRef]); // Re-run effect if controlsRef changes (though it shouldn't for this use case)

  // This useEffect will be triggered when 'isInteracting' state changes.
  // It ensures autoRotate is re-enabled only when interaction has truly ceased.
  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      if (!isInteracting) {
        // After interaction ends, set autoRotate back to true.
        // OrbitControls will respect its dampingFactor first, then autoRotate takes over.
        controls.autoRotate = true;
      }
    }
  }, [isInteracting, controlsRef]); // Dependencies: re-run when isInteracting state changes or controlsRef changes

  // This component doesn't render anything visually in the 3D scene.
  // It's purely for setting up behaviors.
  return null;
}
