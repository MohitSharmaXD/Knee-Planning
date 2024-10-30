import React from 'react';
import { useLandmarks } from './context/LandmarkContext';
import './ControlPanel.css';

export function ControlPanel() {
  const {
    showLines,
    angles,
    distances,
    showResection,
    updateAngle,
    updateDistance,
    toggleResection
  } = useLandmarks();


  if (!showLines) return null;

  return (
    <div className="control-panel">
     
      <div className="angle-controls">
        <h3>Varus/Valgus</h3>
        <div className="control-group">
          <button onClick={() => updateAngle('varusValgus', angles.varusValgus - 1)}>-</button>
          <span>{angles.varusValgus}°</span>
          <button onClick={() => updateAngle('varusValgus', angles.varusValgus + 1)}>+</button>
        </div>

        <h3>Flexion/Extension</h3>
        <div className="control-group">
          <button onClick={() => updateAngle('flexionExtension', angles.flexionExtension - 1)}>-</button>
          <span>{angles.flexionExtension}°</span>
          <button onClick={() => updateAngle('flexionExtension', angles.flexionExtension + 1)}>+</button>
        </div>
      </div>

      <div className="distance-controls">
        <h3>Distal Resection</h3>
        <div className="control-group">
          <button onClick={() => updateDistance('distalMedialResection', distances.distalMedialResection - 1)}>-</button>
          <span>{distances.distalMedialResection} mm</span>
          <button onClick={() => updateDistance('distalMedialResection', distances.distalMedialResection + 1)}>+</button>
        </div>
      </div>

      <div className="toggle-controls">
        <h3>Show Resection</h3>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showResection}
            onChange={toggleResection}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}
