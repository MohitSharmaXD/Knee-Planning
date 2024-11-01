import "./App.css";
import { ControlPanel } from "./components/ControlPanel";
import LandmarkButtons from "./components/LandmarkButtons";
import Scene from "./components/Scene";
import { LandmarkProvider } from "./components/context/LandmarkContext";
function App() {
  return (
    <LandmarkProvider>
      <div className="App">
        <div className="section buttons-section">
          <LandmarkButtons />
        </div>

        <div className="section canvas-section">
          <Scene />
        </div>

        <div className="section other-functionality-section"><ControlPanel/></div>
      </div>
    </LandmarkProvider>
  );
}

export default App;
