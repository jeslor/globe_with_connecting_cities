import GlobeWithMultipleCitiesConnecting from "./components/GlobeWithMultipleCitiesConnecting";

const App = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      <div className="absolute h-full w-full z-[2] top-0 left-0 flex items-center justify-center">
        <GlobeWithMultipleCitiesConnecting />
      </div>
    </div>
  );
};

export default App;
