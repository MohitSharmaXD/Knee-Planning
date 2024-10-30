
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLandmarks } from './context/LandmarkContext';
import { Html } from '@react-three/drei';

export function PlaneSystem() {
  const { landmarks, showLines, angles, distances, showResection } = useLandmarks();

  const createPlaneMaterial = (color, opacity = 0.3) => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  };


  const getMechanicalAxis = () => {
    if (!landmarks.femurCenter || !landmarks.hipCenter) return null;
    return new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(...landmarks.hipCenter),
        new THREE.Vector3(...landmarks.femurCenter)
      )
      .normalize();
  };

  
  const getTEAVector = () => {
    if (!landmarks.medialEpicondyle || !landmarks.lateralEpicondyle) return null;
    return new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(...landmarks.lateralEpicondyle),
        new THREE.Vector3(...landmarks.medialEpicondyle)
      )
      .normalize();
  };


  const getAnteriorDirection = useMemo(() => {
    const mechanicalAxis = getMechanicalAxis();
    const teaVector = getTEAVector();
    
    if (!mechanicalAxis || !teaVector) return null;


    const projectedTEA = teaVector.clone()
      .projectOnPlane(mechanicalAxis)
      .normalize();

 
    return new THREE.Vector3()
      .crossVectors(mechanicalAxis, projectedTEA)
      .normalize();
  }, [landmarks]);


  const PerpendicularPlane = () => {
    const mechanicalAxis = getMechanicalAxis();
    if (!mechanicalAxis || !landmarks.femurCenter) return null;

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(...mechanicalAxis), mechanicalAxis);

    return (
 
        <mesh  position={new THREE.Vector3(...landmarks.femurCenter)} quaternion={quaternion} >
          <planeGeometry args={[2, 2]} />
          <primitive object={createPlaneMaterial('#ffff00')} attach="material" />
        </mesh>
      
    );
  };

const AnteriorLine = () => {
    const anteriorDirection = getAnteriorDirection; 
    if (!anteriorDirection || !landmarks.femurCenter) return null;


    const startPoint = new THREE.Vector3(...landmarks.femurCenter);
    const endPoint = startPoint.clone().add(
        anteriorDirection.clone().multiplyScalar(1) 
    );

    const points = [startPoint, endPoint];

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="red" linewidth={3} />
        </line>
    );
};


const VarusValgusPlane = () => {
  const mechanicalAxis = getMechanicalAxis();
  const teaVector = getTEAVector();
  const anteriorDirection = getAnteriorDirection;
  if (!mechanicalAxis || !teaVector || !landmarks.femurCenter || !anteriorDirection) return null;

  const projectedTEA = teaVector.clone()
      .projectOnPlane(mechanicalAxis)
      .normalize();

  const rotationQuaternion = new THREE.Quaternion();
  rotationQuaternion.setFromAxisAngle(
      anteriorDirection, 
      THREE.MathUtils.degToRad(angles.varusValgus)
  );

  const baseQuaternion = new THREE.Quaternion();
  baseQuaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), 
      mechanicalAxis
  );

  
  const finalQuaternion = rotationQuaternion.multiply(baseQuaternion); 

  return (
      <mesh position={new THREE.Vector3(...landmarks.femurCenter)} quaternion={finalQuaternion}>
          <planeGeometry args={[2, 2]} />
          <primitive 
              object={createPlaneMaterial('#00ff00')} 
              attach="material" 
          />
      </mesh>
  );
};

  const ProjectedTEALine = () => {
    const mechanicalAxis = getMechanicalAxis();
    const teaVector = getTEAVector();
    if (!mechanicalAxis || !teaVector || !landmarks.femurCenter) return null;

    const projectedTEA = teaVector.clone()
      .projectOnPlane(mechanicalAxis)
      .normalize()
      .multiplyScalar(1);

    const startPoint = new THREE.Vector3(...landmarks.femurCenter);
    const endPoint = startPoint.clone().add(projectedTEA);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint,endPoint]);

    return (


        <line geometry={lineGeometry}>
        <lineBasicMaterial color="purple" linewidth={3} />
      </line>

    );
  };



  const getProjectedAnteriorOnVarusValgus = () => {
    const anteriorDirection = getAnteriorDirection;
    if (!anteriorDirection) return null;

    const varusValgusRotation = new THREE.Quaternion().setFromAxisAngle(
      anteriorDirection.normalize(),
      THREE.MathUtils.degToRad(angles.varusValgus)
    );

    return anteriorDirection.clone().applyQuaternion(varusValgusRotation);
  };

  const getLateralLine = () => {
    const projectedAnterior = getProjectedAnteriorOnVarusValgus();
    const mechanicalAxis = getMechanicalAxis();
    
    if (!projectedAnterior || !mechanicalAxis) return null;

    return new THREE.Vector3()
      .crossVectors(mechanicalAxis, projectedAnterior)
      .normalize()
      .multiplyScalar(1); 
  };
  const LateralLine = () => {
    const lateralLine = getLateralLine();
    const mechanicalAxis = getMechanicalAxis();

    if (!lateralLine || !mechanicalAxis || !landmarks.femurCenter) return null;

    const startPoint = new THREE.Vector3(...landmarks.femurCenter);
    const endPoint = startPoint.clone().add(lateralLine);

    return (
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="purple" linewidth={3} />
      </line>
    );
  };
  const ProjectedAnteriorOnVarusValgusLine = () => {
    const projectedAnterior = getProjectedAnteriorOnVarusValgus();
    const mechanicalAxis = getMechanicalAxis();

    if (!projectedAnterior || !mechanicalAxis || !landmarks.femurCenter) return null;

    const startPoint = new THREE.Vector3(...landmarks.femurCenter);
    const endPoint = startPoint.clone().add(projectedAnterior.multiplyScalar(1));

    return (
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="orange" linewidth={3} />
      </line>
    );
  };

  const PerpendicularToProjectedAnteriorLine = () => {
    const projectedAnterior = getProjectedAnteriorOnVarusValgus();
    const mechanicalAxis = getMechanicalAxis();

    if (!projectedAnterior || !mechanicalAxis || !landmarks.femurCenter) return null;

    const startPoint = new THREE.Vector3(...landmarks.femurCenter);
    const endPoint = startPoint.clone().add(
      new THREE.Vector3()
        .crossVectors(mechanicalAxis, projectedAnterior)
        .normalize()
        .multiplyScalar(1)
    );

    return (
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="green" linewidth={3} />
      </line>
    );
  };

  const FlexionExtensionPlane = () => {
    const lateralLine = getLateralLine();
    const projectedAnterior = getProjectedAnteriorOnVarusValgus();
    
    if (!lateralLine || !projectedAnterior || !landmarks.femurCenter) return null;

    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      lateralLine.normalize(),
      THREE.MathUtils.degToRad(angles.flexionExtension)
    );

    const planeNormal = new THREE.Vector3()
      .crossVectors(lateralLine, projectedAnterior)
      .applyQuaternion(rotationQuaternion);

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      planeNormal
    );

    return (
      <mesh position={new THREE.Vector3(...landmarks.femurCenter)} quaternion={quaternion}>
        <planeGeometry args={[2, 2]} />
        <primitive object={createPlaneMaterial('#0000ff')} attach="material" />
      </mesh>
    );
  };

  const getDistalMedialPlaneNormal = () => {
    if (!landmarks.distalMedialPt || !landmarks.distalLateralPt) return null;
  
    const distalMedialVector = new THREE.Vector3(...landmarks.distalMedialPt);
    const distalLateralVector = new THREE.Vector3(...landmarks.distalLateralPt);
  
    const planeNormal = new THREE.Vector3()
      .crossVectors(
        distalMedialVector.clone().sub(distalLateralVector),
        new THREE.Vector3(0, 0, 1)
      )
      .normalize();
  
    return planeNormal;
  };
  const DistalMedialPlane = () => {
    if (!landmarks.distalMedialPt) return null;
  
    const planeNormal = getDistalMedialPlaneNormal();
    if (!planeNormal) return null;
  
    const offset = new THREE.Vector3(0, 0, distances.distalMedialResection / 100);
    const position = new THREE.Vector3(...landmarks.distalMedialPt).add(offset);
  
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      planeNormal
    );
  
    return (
      <mesh position={position} quaternion={quaternion}>
        <planeGeometry args={[2, 2]} />
        <primitive object={createPlaneMaterial('#ff00ff')} attach="material" />
      </mesh>
    );
  };
  
  const DistalResectionPlane = () => {
    if (!landmarks.distalMedialPt || !showResection) return null;
  
    const planeNormal = getDistalMedialPlaneNormal();
    if (!planeNormal) return null;
  
    const lateralOffset = new THREE.Vector3(distances.distalMedialResection / 100, 0, 0);
    const position = new THREE.Vector3(...landmarks.distalMedialPt).add(lateralOffset);
  
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      planeNormal.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(90))
    );
  
    return (
      <mesh position={position} quaternion={quaternion}>
        <planeGeometry args={[2, 2]} />
        <primitive object={createPlaneMaterial('#ff0000')} attach="material" />
      </mesh>
    );
  };

  const Measurements = () => {
    if (!landmarks.distalMedialPt || !landmarks.distalLateralPt) return null;

    const resectionPlaneHeight = distances.distalMedialResection;
    
    const distalMedialDistance = Math.abs(resectionPlaneHeight);
    const distalLateralDistance = Math.abs(
      new THREE.Vector3(...landmarks.distalLateralPt).y - resectionPlaneHeight
    );

    return (
      <group>
        <Html>
          <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px' }}>
            <div>Distal Medial: {distalMedialDistance.toFixed(1)}mm</div>
            <div>Distal Lateral: {distalLateralDistance.toFixed(1)}mm</div>
          </div>
        </Html>
      </group>
    );
  };

  if (!showLines) return null;

  return (
    <group>
    <PerpendicularPlane />
    <ProjectedTEALine />
    <AnteriorLine />
    <LateralLine/>
    <VarusValgusPlane />
    <ProjectedAnteriorOnVarusValgusLine />
    <PerpendicularToProjectedAnteriorLine />
    <FlexionExtensionPlane />
    <DistalMedialPlane />
    <DistalResectionPlane />
    <Measurements /> 
  </group>
  );
}