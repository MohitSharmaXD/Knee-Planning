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

  return (
    <LandmarkContext.Provider 
      value={{
        landmarks,
        activeLandmark,
        showTransformControls,
        setActiveLandmark,
        setShowTransformControls,
        addLandmark,
        updateLandmarkPosition
      }}
    >
      {children}
    </LandmarkContext.Provider>
  );
}

export const useLandmarks = () => useContext(LandmarkContext);