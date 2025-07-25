import GlobeWithMultipleCitiesConnecting from "./components/GlobeWithMultipleCitiesConnecting";
import SpaceCanvas from "./components/SpaceCanvas";

const App = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute h-full w-full bg-black overflow-hidden">
        <SpaceCanvas />
      </div>
      <div className="absolute h-full w-full z-[2] top-0 left-0 flex items-center justify-center">
        <GlobeWithMultipleCitiesConnecting />
      </div>
    </div>
  );
};

export default App;
