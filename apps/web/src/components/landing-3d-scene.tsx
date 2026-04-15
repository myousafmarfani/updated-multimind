"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Line, OrbitControls, Stars, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function LLMConstellation({ immersive = false }: { immersive?: boolean }) {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Group>(null);

  const yOffset = immersive ? -1.15 : -0.2;
  const sceneScale = immersive ? 1.42 : 1.25;

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.45;
      coreRef.current.rotation.x += delta * 0.18;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.25;
      ringRef.current.rotation.z += delta * 0.08;
    }
  });

  const modelNodes = useMemo(
    () => [
      { name: "Gemini", position: [2.7, 0.55, 0.1] as [number, number, number], color: "#62f0cf" },
      { name: "ChatGPT", position: [-2.5, 1.1, -0.8] as [number, number, number], color: "#76ccff" },
      { name: "Claude", position: [0.6, -2.1, 1.3] as [number, number, number], color: "#7ae7ff" },
      { name: "Grok", position: [-2.1, -1, 1] as [number, number, number], color: "#4fe0ff" },
    ],
    [],
  );

  return (
    <group position={[0, yOffset, 0]} scale={sceneScale}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={coreRef} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#a8f6ff"
            metalness={0.7}
            roughness={0.1}
            emissive="#0f4a62"
            emissiveIntensity={0.85}
            wireframe
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.42, 30, 30]} />
          <meshStandardMaterial color="#c8fbff" emissive="#2f89a7" emissiveIntensity={0.55} transparent opacity={0.4} />
        </mesh>

        <Text
          position={[0, -1.45, 0]}
          color="#d6f5ff"
          fontSize={0.25}
          letterSpacing={0.06}
          anchorX="center"
          anchorY="middle"
        >
          MULTIMIND CORE
        </Text>
      </Float>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2.2, 0.1, 0.2]}>
          <torusGeometry args={[2.15, 0.03, 16, 240]} />
          <meshStandardMaterial color="#77d8ff" emissive="#0f3650" emissiveIntensity={0.65} />
        </mesh>
        <mesh rotation={[Math.PI / 1.5, 0.7, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 240]} />
          <meshStandardMaterial color="#7fffd4" emissive="#0c4c42" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {modelNodes.map((node) => (
        <Float key={node.name} speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
          <group position={node.position}>
            <Line
              points={[
                [0, 0, 0],
                [-node.position[0], -node.position[1], -node.position[2]],
              ]}
              color="#8ddfff"
              lineWidth={1}
              transparent
              opacity={0.48}
            />

            <mesh>
              <sphereGeometry args={[0.23, 28, 28]} />
              <meshStandardMaterial
                color={node.color}
                metalness={0.4}
                roughness={0.2}
                emissive={node.color}
                emissiveIntensity={0.55}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.36, 0.022, 16, 96]} />
              <meshStandardMaterial color="#d9f6ff" emissive="#20526e" emissiveIntensity={0.35} />
            </mesh>

            <Text
              position={[0, 0.52, 0]}
              color="#f0fbff"
              fontSize={0.2}
              letterSpacing={0.04}
              anchorX="center"
              anchorY="middle"
            >
              {node.name}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}

type Landing3DSceneProps = {
  immersive?: boolean;
};

export function Landing3DScene({ immersive = false }: Landing3DSceneProps) {
  const containerClass = immersive
    ? "landing-panel relative h-full min-h-screen w-full overflow-hidden rounded-none shadow-none"
    : "landing-panel relative h-105 w-full overflow-hidden rounded-4xl shadow-[0_30px_90px_rgba(0,0,0,0.38)] sm:h-120 lg:h-128";

  const camera = immersive ? { position: [0, -0.8, 6.2] as [number, number, number], fov: 44 } : { position: [0, 0, 5.8] as [number, number, number], fov: 44 };
  const orbitTarget = immersive ? ([0, -1.1, 0] as [number, number, number]) : ([0, -0.2, 0] as [number, number, number]);

  return (
    <div className={containerClass}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/5 to-transparent" />

      <Canvas camera={camera} dpr={[1, 2]}>
        <color attach="background" args={["#040a14"]} />
        <fog attach="fog" args={["#040a14", 8, 18]} />

        <ambientLight intensity={0.42} />
        <directionalLight position={[5.4, 4, 4]} intensity={1.15} color="#9ee8ff" />
        <pointLight position={[-4.5, -2.2, 3]} intensity={0.55} color="#43ffe1" />

        <LLMConstellation immersive={immersive} />
        <Stars radius={44} depth={24} count={1300} factor={2.2} saturation={0} fade speed={0.3} />
        <Environment preset="city" />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.5}
          target={orbitTarget}
          minDistance={4.2}
          maxDistance={10.2}
          maxPolarAngle={Math.PI * 0.78}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/38 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-slate-300">
        Drag to rotate • Scroll to zoom • Shift-drag to pan
      </div>
    </div>
  );
}
