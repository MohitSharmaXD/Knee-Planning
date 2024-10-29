// import React from 'react';
// import './LandmarkButtons.css';
// export default function LandmarkButtons() {
//   return (
//     <div className="landmark-buttons">
//       <div className="radio-group">
//         <input 
//           type="radio" 
//           id="femurCenter" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="femurCenter" className="landmark-btn">Femur Center</label>

//         <input 
//           type="radio" 
//           id="hipCenter" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="hipCenter" className="landmark-btn">Hip Center</label>

//         <input 
//           type="radio" 
//           id="femurProximalCanal" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="femurProximalCanal" className="landmark-btn">Femur Proximal Canal</label>

//         <input 
//           type="radio" 
//           id="femurDistalCanal" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="femurDistalCanal" className="landmark-btn">Femur Distal Canal</label>

//         <input 
//           type="radio" 
//           id="medialEpicondyle" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="medialEpicondyle" className="landmark-btn">Medial Epicondyle</label>

//         <input 
//           type="radio" 
//           id="lateralEpicondyle" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="lateralEpicondyle" className="landmark-btn">Lateral Epicondyle</label>

//         <input 
//           type="radio" 
//           id="distalMedialPt" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="distalMedialPt" className="landmark-btn">Distal Medial Pt</label>

//         <input 
//           type="radio" 
//           id="distalLateralPt" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="distalLateralPt" className="landmark-btn">Distal Lateral Pt</label>

//         <input 
//           type="radio" 
//           id="posteriorMedialPt" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="posteriorMedialPt" className="landmark-btn">Posterior Medial Pt</label>

//         <input 
//           type="radio" 
//           id="posteriorLateralPt" 
//           name="landmark" 
//           className="landmark-radio"
//         />
//         <label htmlFor="posteriorLateralPt" className="landmark-btn">Posterior Lateral Pt</label>
//       </div>
//       <button className="update-btn">Update</button>
//     </div>
//   );
// }










import React from 'react';
import './LandmarkButtons.css';
import { useLandmarks} from './context/LandmarkContext';
export default function LandmarkButtons() {
  const { 
    activeLandmark, 
    setActiveLandmark, 
    setShowTransformControls 
  } = useLandmarks();

  const handleLandmarkSelect = (landmarkId) => {
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
      <div className="radio-group">
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
              type="radio" 
              id={landmarkId} 
              name="landmark" 
              className="landmark-radio"
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
      <button className="update-btn">Update</button>
    </div>
  );
}
