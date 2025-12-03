import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const HandController = ({ onScroll, onPinch }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [handVisible, setHandVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    let handLandmarker = null;
    let animationFrameId = null;

    const setupMediaPipe = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      
      setLoaded(true);
      startWebcam();
    };

    const startWebcam = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("loadeddata", predictWebcam);
          }
        });
      }
    };

    const predictWebcam = () => {
      if (!handLandmarker || !videoRef.current) return;
      
      let startTimeMs = performance.now();
      if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
          setHandVisible(true);
          const landmarks = results.landmarks[0];
          
          // 8: Index finger tip, 4: Thumb tip
          const indexTip = landmarks[8];
          const thumbTip = landmarks[4];
          
          // Calculate pinch distance
          const distance = Math.sqrt(
            Math.pow(indexTip.x - thumbTip.x, 2) + 
            Math.pow(indexTip.y - thumbTip.y, 2)
          );
          
          const pinching = distance < 0.1; // Threshold
          setIsPinching(pinching);
          if (pinching && onPinch) onPinch();

          // Map hand position (index tip) to screen coordinates
          // Mirror x axis because webcam is mirrored
          const x = (1 - indexTip.x) * window.innerWidth;
          const y = indexTip.y * window.innerHeight;
          
          setCursorPos({ x, y });

          // Scroll logic based on hand position
          // If hand is on the edges (left 20% or right 20%), scroll
          if (indexTip.x < 0.2) {
             // Hand on right side of camera (left side of screen mirrored) -> Scroll Right
             onScroll(15); 
          } else if (indexTip.x > 0.8) {
             // Hand on left side of camera (right side of screen mirrored) -> Scroll Left
             onScroll(-15);
          } else {
             // Center area - maybe map to precise scroll if pinched?
             if (pinching) {
                // Implement drag scroll logic here if needed
             }
          }

        } else {
          setHandVisible(false);
        }
      }
      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    setupMediaPipe();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handLandmarker) handLandmarker.close();
      // Stop webcam
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScroll, onPinch]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      {/* Webcam Preview */}
      <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
        />
        {!loaded && <div className="absolute inset-0 flex items-center justify-center text-xs text-white">Loading AI...</div>}
        {loaded && !handVisible && <div className="absolute inset-0 flex items-center justify-center text-xs text-red-400 bg-black/50">No Hand Detected</div>}
        {handVisible && (
          <div className="absolute top-2 left-2 text-[10px] text-green-400 font-mono">
            Tracking Active<br/>
            {isPinching ? "PINCHING" : "OPEN"}
          </div>
        )}
      </div>
      
      {/* Virtual Cursor */}
      {handVisible && (
        <div 
          className={`fixed w-6 h-6 rounded-full border-2 transition-colors duration-100 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 ${isPinching ? 'bg-neon-purple border-white' : 'border-neon-blue bg-transparent'}`}
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white whitespace-nowrap">
            {isPinching ? "Grab" : ""}
          </div>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-400 bg-black/80 p-2 rounded">
        <p>👋 举起手来控制</p>
        <p>👈 👉 移动到边缘滚动</p>
        <p>👌 捏合点击(模拟)</p>
      </div>
    </div>
  );
};

export default HandController;
