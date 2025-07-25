import * as THREE from "three";

interface CityPointProps {
  position: THREE.Vector3;
  color?: string | THREE.Color;
  radius?: number;
}

export function CityPoint({
  position,
  color = "yellow",
  radius = 0.02,
}: CityPointProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
