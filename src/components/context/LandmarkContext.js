
import React, { createContext, useContext, useState } from 'react';

const LandmarkContext = createContext();

export function LandmarkProvider({ children }) {

  const [landmarks, setLandmarks] = useState({
    femurCenter: null,
    hipCenter: null,
    femurProximalCanal: null,
    femurDistalCanal: null,
    medialEpicondyle: null,
    lateralEpicondyle: null,
    distalMedialPt: null,
    distalLateralPt: null,
    posteriorMedialPt: null,
    posteriorLateralPt: null
  });

  const [activeLandmark, setActiveLandmark] = useState(null);
  const [showTransformControls, setShowTransformControls] = useState(false);
  const [showLines, setShowLines] = useState(false);


  const [angles, setAngles] = useState({
    varusValgus: 0,
    flexionExtension: 0
  });

  const [distances, setDistances] = useState({
    distalMedialResection: 10
  });

  const [showResection, setShowResection] = useState(false);

  
  const [measurements, setMeasurements] = useState({
    distalMedial: 0,
    distalLateral: 0
  });

  const addLandmark = (type, position) => {
    setLandmarks(prev => ({
      ...prev,
      [type]: position
    }));
  };

  const updateLandmarkPosition = (type, newPosition) => {
    setLandmarks(prev => ({
      ...prev,
      [type]: newPosition
    }));
  };

  const handleUpdateClick = () => {
    setShowLines(true);
  };


  







  const updateAngle = (type, value) => {
    setAngles(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const updateDistance = (type, value) => {
    setDistances(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const toggleResection = () => {
    setShowResection(prev => !prev);
  };










  return (
    <LandmarkContext.Provider
      value={{
   
        landmarks,
        activeLandmark,
        showTransformControls,
        showLines,
        setActiveLandmark,
        setShowTransformControls,
        addLandmark,
        updateLandmarkPosition,
        handleUpdateClick,

        angles,
        distances,
        showResection,
        measurements,
        updateAngle,
        updateDistance,
        toggleResection,
        setMeasurements

      }}
    >
      {children}
    </LandmarkContext.Provider>
  );
}

export const useLandmarks = () => useContext(LandmarkContext);