import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { 
  Center,
  Stage,
  OrbitControls,
  PivotControls
} from '@react-three/drei';
import { useLandmarks } from './context/LandmarkContext';

function Landmark({ position, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Model({ url, color }) {
  const geometry = useLoader(STLLoader, url);
  const { activeLandmark, addLandmark } = useLandmarks();
  
  const handleClick = (event) => {
    if (activeLandmark) {
      event.stopPropagation();
      const point = event.point;
      console.log("point",point)
      addLandmark(activeLandmark, [point.x, point.y, point.z]);
    }
  };
  
  return (
    <mesh  scale={0.005}  onClick={handleClick}>
      <primitive object={geometry} attach="geometry"/>
      <meshStandardMaterial color={color}/> 
    </mesh>
  );
}

function LandmarkPoints() {
  const { landmarks, showTransformControls, updateLandmarkPosition } = useLandmarks();
  
  return Object.entries(landmarks).map(([key, position]) => {
    if (!position) return null;
    
    return (
      <group key={key}>
        {showTransformControls ? (
          <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            // fixed={true}
            scale={1}
            // position={position}
            disableSliders
            disableScaling
            disableRotations
            activeAxes={[true, true, true]}
            onDrag={(matrix) => {
              const newPosition = [matrix.elements[12], matrix.elements[13], matrix.elements[14]];
              updateLandmarkPosition(key, newPosition);
            }}
          >
            <Landmark position={position} />
          </PivotControls>
        ) : (
          <Landmark position={position} />
        )}
      </group>
    );
  });
}

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [0,4,2],
        fov: 75,
        up: [0, 0, 1],
        near: 0.1,
        far: 10000
      }}
    >
    <ambientLight intensity={1} />
    <directionalLight intensity={3} distance={1} position={[0.5, 0.3, 0]} />
    <directionalLight intensity={1} distance={1} position={[0.5, 1.15, 0]} />
    <directionalLight intensity={1} distance={1} position={[-0.5, -0.3, 0]} />
    <directionalLight  intensity={1} distance={1} position={[-0.5, -1.15, 0]}/>

  <group position={[0,0,-4]} >
  <Model color={"darkGreen"} url="3DAssets/Right_Femur.stl" />
  <Model color={"hotpink"} url="3DAssets/Right_Tibia.stl" />
  </group>
  <LandmarkPoints />
      <ambientLight intensity={1}/>
     

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