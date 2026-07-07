"use client";

// #2 — Interactive 3D t-shirt preview (react-three-fiber + drei, all OSS).
// Customer's uploaded design is decal-mapped onto the chest of a real
// 3D shirt model (CC0, from the open-source project_threejs_ai repo).
// Drag to rotate · scroll/pinch is disabled so page scrolling stays smooth.

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Decal,
  Environment,
  Center,
  OrbitControls,
} from "@react-three/drei";

const SHIRT_COLORS = {
  Black: "#1b1b1f",
  White: "#e8e8e8",
  Gold: "#f5b52e",
  Navy: "#1f2a44",
  Red: "#8f2430",
  "Heather Gray": "#8a8a90",
  Teal: "#1f6f6b",
};

function ChestDecal({ designUrl }) {
  const texture = useTexture(designUrl);
  return (
    <Decal
      position={[0, 0.06, 0.13]}
      rotation={[0, 0, 0]}
      scale={0.14}
      map={texture}
    />
  );
}

function ShirtModel({ designUrl, color }) {
  const { nodes, materials } = useGLTF("/models/shirt_baked.glb");
  const ref = useRef();

  // gentle idle sway
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t / 3) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-color={color}
        material-roughness={1}
        dispose={null}
      >
        {designUrl && <ChestDecal designUrl={designUrl} />}
      </mesh>
    </group>
  );
}

export default function Shirt3D({ designUrl, color = "Black", className = "" }) {
  const hex = SHIRT_COLORS[color] || color || "#1b1b1f";

  return (
    <div
      className={`relative ${className}`}
      aria-label="Interactive 3D t-shirt preview — drag to rotate"
      role="img"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 0.62], fov: 30 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[1, 1.5, 1]} intensity={1.1} castShadow />
        <directionalLight position={[-1, 0.5, -1]} intensity={0.35} color="#f5b52e" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Center>
            <ShirtModel designUrl={designUrl} color={hex} />
          </Center>
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        Drag to rotate
      </p>
    </div>
  );
}

useGLTF.preload("/models/shirt_baked.glb");
