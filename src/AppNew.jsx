import React, { useRef, useState } from 'react';
import Gallery from './components/Gallery';
import HandController from './components/HandController';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const scrollContainerRef = useRef(null);
  const [useHandControl, setUseHandControl] = useState(true);

  const handleHandScroll = (delta) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += delta;
    }
  };

  const handleHandPinch = () => {
    console.log("Pinch detected!");
    // 可以添加点击交互逻辑，比如选中当前卡片
  };

  return (
    <div className="w-screen h-screen bg-dark-bg overflow-hidden relative font-sans text-white selection:bg-neon-purple selection:text-white">
      {/* Background Effects */}
      <ParticleBackground />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Gallery */}
      <Gallery scrollRef={scrollContainerRef} />

      {/* Hand Controller Overlay */}
      {useHandControl && (
        <HandController 
          onScroll={handleHandScroll} 
          onPinch={handleHandPinch} 
        />
      )}

      {/* Toggle Control */}
      <div className="fixed top-6 right-6 z-40">
        <button 
          onClick={() => setUseHandControl(!useHandControl)}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            useHandControl 
              ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
              : 'bg-gray-800 border-gray-700 text-gray-400'
          }`}
        >
          {useHandControl ? 'Kinect 模拟开启' : 'Kinect 模拟关闭'}
        </button>
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-6 left-6 text-xs text-gray-600 font-mono z-40">
        2024 Project Showcase • React + MediaPipe
      </div>
    </div>
  );
}

export default App;
