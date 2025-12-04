import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const HandController = ({ onScroll, onPinch, onDrag }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [handVisible, setHandVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  // Refs for tracking state across frames without re-renders
  const lastCursorPos = useRef({ x: 0, y: 0 });
  const isPinchingRef = useRef(false);
  const isGrabbingRef = useRef(false);

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
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.addEventListener("loadeddata", predictWebcam);
            }
            setCameraError(null);
          })
          .catch((err) => {
            // Only log if it's not a "device not found" error which is common on dev machines without cams
            if (err.name !== 'NotFoundError') {
              console.error("Error accessing webcam:", err);
            }
            setCameraError("无法访问摄像头: " + (err.message || "设备未找到"));
          });
      } else {
         setCameraError("浏览器不支持摄像头访问");
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
          const wrist = landmarks[0];
          
          // Calculate pinch distance (Index to Thumb)
          const pinchDistance = Math.sqrt(
            Math.pow(indexTip.x - thumbTip.x, 2) + 
            Math.pow(indexTip.y - thumbTip.y, 2)
          );
          
          // Calculate Grab (Fist) - Check if all finger tips are close to wrist
          // Tips: 8, 12, 16, 20
          const tips = [8, 12, 16, 20];
          const avgDistToWrist = tips.reduce((acc, idx) => {
            const tip = landmarks[idx];
            return acc + Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2));
          }, 0) / 4;

          const pinching = pinchDistance < 0.08; 
          const grabbing = avgDistToWrist < 0.4; // Heuristic for fist

          // Update States
          setIsPinching(pinching);
          setIsGrabbing(grabbing);
          
          // Map hand position (index tip) to screen coordinates
          // Mirror x axis because webcam is mirrored
          const x = (1 - indexTip.x) * window.innerWidth;
          const y = indexTip.y * window.innerHeight;
          
          setCursorPos({ x, y });

          // --- Interaction Logic ---

          // 1. Dragging (Grab)
          if (grabbing) {
            if (isGrabbingRef.current) {
               // Calculate delta
               const deltaX = x - lastCursorPos.current.x;
               const deltaY = y - lastCursorPos.current.y;
               if (onDrag) onDrag(deltaX, deltaY);
            }
            isGrabbingRef.current = true;
          } else {
            isGrabbingRef.current = false;
          }

          // 2. Clicking (Pinch)
          if (pinching && !isPinchingRef.current) {
             // Trigger click on fresh pinch
             if (onPinch) onPinch();
             
             // Simulate actual click on element
             const element = document.elementFromPoint(x, y);
             if (element) {
               element.click();
               // Add visual ripple or effect here if needed
             }
          }
          isPinchingRef.current = pinching;

          // 3. Edge Scrolling (Only if not grabbing)
          if (!grabbing) {
            if (indexTip.x < 0.15) {
               onScroll(15); 
            } else if (indexTip.x > 0.85) {
               onScroll(-15);
            }
          }

          // Update last cursor pos
          lastCursorPos.current = { x, y };

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
        {!loaded && !cameraError && <div className="absolute inset-0 flex items-center justify-center text-xs text-white">Loading AI...</div>}
        {cameraError && <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500 bg-black/80 p-2 text-center">{cameraError}</div>}
        {loaded && !handVisible && !cameraError && <div className="absolute inset-0 flex items-center justify-center text-xs text-red-400 bg-black/50">No Hand Detected</div>}
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
          className={`fixed w-8 h-8 rounded-full border-2 transition-all duration-100 pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
            ${isGrabbing 
              ? 'bg-neon-blue border-white scale-125 shadow-[0_0_20px_rgba(0,243,255,0.8)]' 
              : isPinching 
                ? 'bg-neon-purple border-white scale-90' 
                : 'border-neon-blue bg-transparent'
            }`}
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-white whitespace-nowrap font-bold bg-black/50 px-2 py-1 rounded">
            {isGrabbing ? "DRAG" : isPinching ? "CLICK" : ""}
          </div>
          {/* Crosshair center */}
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-400 bg-black/80 p-2 rounded">
        <p>👋 举手控制</p>
        <p>✊ 握拳拖拽</p>
        <p>👌 捏合点击</p>
        <p>👈👉 边缘滚动</p>
      </div>
    </div>
  );
};

export default HandController;
