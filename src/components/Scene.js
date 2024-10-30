import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls, PivotControls } from "@react-three/drei";
import { useLandmarks } from "./context/LandmarkContext";
import * as THREE from "three";
import { PlaneSystem } from "./PlaneSystem";

function Model({ url, color }) {
  const geometry = useLoader(STLLoader, url);

  const { activeLandmark, addLandmark, setShowTransformControls } =
    useLandmarks();

  const handleClick = (event) => {
    if (activeLandmark) {
      event.stopPropagation();
      const point = event.point;

      addLandmark(activeLandmark, [point.x, point.y, point.z]);

      setShowTransformControls(true);
    }
  };

  return (
    <mesh scale={0.005} onClick={handleClick}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial depthTest={false} color={color} />
    </mesh>
  );
}
function Landmark() {
  return (
    <mesh>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function LandmarkPoints() {
  const {
    landmarks,
    showTransformControls,
    updateLandmarkPosition,
    activeLandmark,
  } = useLandmarks();

  return Object.entries(landmarks).map(([key, position]) => {
    if (!position) return null;

    return (
      <PivotControls
        key={key}
        visible={showTransformControls && activeLandmark === key}
        enabled={showTransformControls && activeLandmark === key} // Add this line
        depthTest={false}
        scale={1}
        disableSliders
        disableScaling
        disableRotations
        activeAxes={[true, true, true]}
        onDrag={(matrix) => {
          const newPosition = [
            matrix.elements[12],
            matrix.elements[13],
            matrix.elements[14],
          ];
          updateLandmarkPosition(key, newPosition);
        }}
        matrix={new THREE.Matrix4().setPosition(
          position[0],
          position[1],
          position[2]
        )}
      >
        <Landmark />
      </PivotControls>
    );
  });
}
function AxisLines({ landmarks }) {
  const createLine = (start, end, color = "blue") => {
    if (!landmarks[start] || !landmarks[end]) return null;

    const points = [
      new THREE.Vector3(...landmarks[start]),
      new THREE.Vector3(...landmarks[end]),
    ];

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>
    );
  };

  return (
    <group>
      {/* Mechanical Axis  */}
      {createLine("femurCenter", "hipCenter", "blue")}

      {/* Anatomical Axis  */}
      {createLine("femurProximalCanal", "femurDistalCanal", "blue")}

      {/* TEA - Trans epicondyle Axis  */}
      {createLine("medialEpicondyle", "lateralEpicondyle", "blue")}

      {/* PCA - Posterior Condyle Axis */}
      {createLine("posteriorMedialPt", "posteriorLateralPt", "blue")}
    </group>
  );
}




export default function Scene() {
  const { landmarks, showLines } = useLandmarks();
  return (
    <Canvas
      camera={{
        position: [0, 4, 2],
        fov: 75,
        up: [0, 0, 1],
        near: 0.1,
        far: 10000,
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight intensity={3} distance={1} position={[0.5, 0.3, 0]} />
      <directionalLight intensity={1} distance={1} position={[0.5, 1.15, 0]} />
      <directionalLight intensity={1} distance={1} position={[-0.5, -0.3, 0]} />
      <directionalLight
        intensity={1}
        distance={1}
        position={[-0.5, -1.15, 0]}
      />

      <group position={[0, 0, -4]}>
        <Model color={"darkGreen"} url="3DAssets/Right_Femur.stl" />
        <Model color={"hotpink"} url="3DAssets/Right_Tibia.stl" />
      </group>
      <LandmarkPoints />
      {showLines && (
  <>
    <AxisLines landmarks={landmarks} />
    <PlaneSystem />
  </>
)}


      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.3}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}





