import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface SceneSetupProps {
  // Change the type here to explicitly include 'null'
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export function SceneSetup({ controlsRef }: SceneSetupProps) {
  const { gl } = useThree();
  const zoomState = useRef<"normal" | "zoomedIn">("normal");

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);

    const canvas = gl.domElement;

    // --- Ctrl + Scroll Zoom ---
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) {
        event.preventDefault();
      }
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // --- Double-Click Toggle Zoom ---
    const handleDoubleClick = () => {
      // Keep this null check, it's good practice as controls.current can be null initially
      if (!controlsRef.current) return;

      if (zoomState.current === "normal") {
        controlsRef.current.dollyIn(0.5); // Using dollyIn for zooming in
        zoomState.current = "zoomedIn";
      } else {
        controlsRef.current.dollyOut(0.5); // Using dollyOut for zooming out
        zoomState.current = "normal";
      }
      controlsRef.current.update();
    };
    canvas.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [gl, controlsRef]);

  return null;
}
