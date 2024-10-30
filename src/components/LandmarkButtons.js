


import React from 'react';
import './LandmarkButtons.css';
import { useLandmarks } from './context/LandmarkContext';

export default function LandmarkButtons() {
  const { 
    activeLandmark, 
    setActiveLandmark, 
    setShowTransformControls,
    handleUpdateClick
  } = useLandmarks();


  const handleLandmarkSelect = (landmarkId) => {
    console.log("landmarkId", landmarkId);
    if (activeLandmark === landmarkId) {
     
      setActiveLandmark(null);
      setShowTransformControls(false);
    } else {

      setActiveLandmark(landmarkId);
      setShowTransformControls(true);
    }
  };

  return (
    <div className="landmark-buttons">
      <div className="checkbox-group">
        {[
          'femurCenter',
          'hipCenter',
          'femurProximalCanal',
          'femurDistalCanal',
          'medialEpicondyle',
          'lateralEpicondyle',
          'distalMedialPt',
          'distalLateralPt',
          'posteriorMedialPt',
          'posteriorLateralPt'
        ].map(landmarkId => (
          <div key={landmarkId}>
            <input 
              type="checkbox" // Change to checkbox
              id={landmarkId} 
              className="landmark-checkbox"
              checked={activeLandmark === landmarkId}
              onChange={() => handleLandmarkSelect(landmarkId)}
            />
            <label 
              htmlFor={landmarkId} 
              className={`landmark-btn ${activeLandmark === landmarkId ? 'active' : ''}`}
            >
              {landmarkId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          </div>
        ))}
      </div>
      <button 
        className="update-btn"
        onClick={handleUpdateClick}
      >
        Update
      </button>
    </div>
  );
}
