"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function makeSphere(count: number, radius: number, squash: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.5 + Math.random() * 0.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * squash;
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function Cloud() {
  const group = useRef<THREE.Group>(null);
  const goldGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(makeSphere(1600, 1.75, 0.76), 3));
    return g;
  }, []);
  const orangeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(makeSphere(420, 1.1, 0.68), 3));
    return g;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.08 + pointer.x * 0.4;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.08 + pointer.y * 0.2;
  });

  return (
    <group ref={group}>
      <points geometry={goldGeom}>
        <pointsMaterial
          color="#F59E0B"
          size={0.02}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
      <points geometry={orangeGeom}>
        <pointsMaterial
          color="#BE5205"
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.08, 1]} />
        <meshBasicMaterial color="#BE5205" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0.5, 0.2, 0.1]}>
        <torusGeometry args={[1.62, 0.007, 8, 90]} />
        <meshBasicMaterial color="#FFFDE1" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export function NeuralScene({ className = "h-full w-full" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.1, 4.5], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Cloud />
      </Canvas>
    </div>
  );
}
