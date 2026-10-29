"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const PLACEHOLDER_MODEL_PATH = null;

function PlaceholderCar({ color = "#e6e6e6", accentColor = "#b3b3b3" }) {
  const carRef = useRef();
  const wheelFL = useRef();
  const wheelFR = useRef();
  const wheelRL = useRef();
  const wheelRR = useRef();
  const wheelRotations = [wheelFL, wheelFR, wheelRL, wheelRR];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    wheelRotations.forEach((wheelRef) => {
      if (wheelRef.current) {
        wheelRef.current.rotation.y = t * 4;
      }
    });
  });

  return (
    <group ref={carRef} position={[0, -0.05, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.45, 4.8]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh position={[0, 0.4, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.35, 2.0]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>

      <mesh
        position={[0, -0.18, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.5, 0.08, 4.9]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <mesh position={[0, 0.05, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.12, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh position={[0, 0.05, -1.7]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh position={[0.55, 0.05, 2.38]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.08, 0.12]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.55, 0.05, -2.38]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.08, 0.12]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.55, 0.05, 2.38]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.08, 0.12]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.55, 0.05, -2.38]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.08, 0.12]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0.55, 0.05, 2.42]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.55, 0.05, 2.42]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.55, 0.05, -2.42]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.55, 0.05, -2.42]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {[
        [-0.65, 0.12, 1.4],
        [0.65, 0.12, 1.4],
        [-0.65, 0.12, -1.4],
        [0.65, 0.12, -1.4],
      ].map((pos, i) => (
        <group key={`wheel-${i}`} position={pos} ref={wheelRotations[i]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.28, 32]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.29, 32]} />
            <meshStandardMaterial
              color="#f2f2f2"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      <mesh
        position={[0.78, -0.1, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.1, 0.2, 4.7]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh
        position={[-0.78, -0.1, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.1, 0.2, 4.7]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Loader() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.05, 16, 64]} />
        <meshStandardMaterial color="#888888" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function CarScene({ car, autoRotate = true, accentColor }) {
  return (
    <>
      <perspectiveCamera
        makeDefault
        position={[5, 2.5, 5]}
        fov={40}
        near={0.1}
        far={100}
      />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[6, 8, 4]}
        angle={0.6}
        penumbra={0.8}
        intensity={180}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-6, 6, -4]}
        angle={0.6}
        penumbra={0.8}
        intensity={120}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 2, 0]} intensity={30} />

      <Suspense fallback={<Loader />}>
        {PLACEHOLDER_MODEL_PATH ? (
          <mesh castShadow receiveShadow />
        ) : (
          <PlaceholderCar
            color={car?.color ?? "#e6e6e6"}
            accentColor={accentColor ?? "#b3b3b3"}
          />
        )}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.35}
          scale={14}
          blur={2.5}
          far={4}
        />
        <Environment preset="city" background={false} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.5}
          maxDistance={14}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          target={[0, 0.25, 0]}
        />
      </Suspense>
    </>
  );
}

export default function CarViewer({
  car,
  autoRotate = true,
  accentColor,
  className,
  style,
}) {
  return (
    <div
      className={className ?? ""}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        ...style,
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
        camera={{ position: [5, 2.5, 5], fov: 40 }}
      >
        <CarScene car={car} autoRotate={autoRotate} accentColor={accentColor} />
      </Canvas>
    </div>
  );
}
