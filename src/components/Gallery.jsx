import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const Gallery = ({ scrollRef }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleProjectClick = (project) => {
    console.log('Project clicked:', project);
    navigate(`/project/${project.id}`);
  };

  return (
    <>
      <div 
        ref={scrollRef}
      className="flex overflow-x-auto h-screen items-center px-20 gap-16 snap-x snap-mandatory scroll-smooth no-scrollbar py-10 perspective-1000"
      style={{ scrollBehavior: 'smooth', perspective: '1000px' }}
    >
      {/* Intro Card */}
      <div className="min-w-[600px] h-[70vh] snap-center flex flex-col justify-center items-start p-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl shadow-2xl flex-shrink-0">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-6">
          项目展览廊
        </h1>
        <p className="text-3xl text-gray-400 max-w-2xl leading-relaxed">
          欢迎来到2024-2025 年度项目展示。
          <br/><br/>
          这里汇集了在应用开发与算法研究领域的探索成果。
          <br/><br/>
          👉 向右滑动开始探索。
        </p>
      </div>

      {projects.map((project, index) => {
        const isHovered = hoveredIndex === index;
        const isAnyHovered = hoveredIndex !== null;
        
        // Calculate offset for 3D effect
        let offset = 0;
        if (hoveredIndex !== null) {
          offset = index - hoveredIndex;
        }

        return (
          <motion.div
            key={project.id}
            layout
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              layout: { duration: 0.4, type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.5 },
              rotateY: { duration: 0.4 },
              x: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            className={`relative group perspective-1000 snap-center flex-shrink-0 h-[70vh] antialiased cursor-pointer
              ${isHovered ? 'z-50' : 'z-0'}
            `}
            onClick={() => handleProjectClick(project)}
            style={{
              minWidth: isHovered ? '700px' : '600px', // 增大基础尺寸
              zIndex: isHovered ? 50 : (isAnyHovered ? 40 - Math.abs(offset) : 0), // Ensure correct stacking
              willChange: 'transform, opacity, filter', // 优化渲染性能，防止模糊
            }}
            animate={isHovered ? {
              y: [0, -20, 0], // Floating effect
              scale: 1, // 关键修改：聚焦时保持原始比例(1.0)，不再放大，从而保证清晰度
              rotateY: 0,
              x: 0,
              filter: 'none', // 明确移除滤镜
              opacity: 1,
              transition: {
                y: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                },
                scale: { duration: 0.3 }
              }
            } : {
              y: 0,
              scale: isAnyHovered ? 0.75 : 0.85, // 关键修改：默认状态改为缩小，以缩代放
              rotateY: isAnyHovered ? (offset < 0 ? 25 : -25) : 0, // Rotate towards center
              x: isAnyHovered ? (offset < 0 ? 50 : -50) : 0, // Push closer to center (overlap slightly)
              filter: isAnyHovered ? 'blur(2px)' : 'none',
              opacity: isAnyHovered ? 0.6 : 1,
            }}
          >
            <div className="w-full h-full bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-3xl p-8 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-3 rounded-xl bg-gray-800 ${project.color}`}>
                  <project.icon size={32} />
                </div>
                <span className="px-3 py-1 text-xs font-mono border border-gray-600 rounded-full text-gray-400">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <h2 className="text-5xl font-bold mb-8 text-white group-hover:text-neon-blue transition-colors relative z-10 text-center w-full">
                {project.title}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 flex-grow relative z-10">
                {project.description}
              </p>

              {/* Interactive Area Placeholder */}
              <div className="w-full h-48 bg-black/50 rounded-xl border border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden group-hover:border-gray-500 transition-colors z-10">
                {project.demoType === 'interactive' && (
                  <div className="text-center">
                    <p className="text-neon-blue font-mono text-sm animate-pulse">
                      &lt; 正在运行 Kinect 模拟核心 /&gt;
                    </p>
                    <p className="text-xs text-gray-500 mt-2">尝试在摄像头前捏合手指</p>
                  </div>
                )}
                {project.demoType === 'chat' && (
                  <div className="w-full p-4 space-y-2">
                    <div className="bg-gray-800 p-2 rounded-lg rounded-tl-none text-xs w-3/4">你好，我是小唐。</div>
                    <div className="bg-neon-purple/20 p-2 rounded-lg rounded-tr-none text-xs w-3/4 ml-auto text-right">今天心情怎么样？</div>
                  </div>
                )}
                {project.demoType === 'static' && (
                  <div className="text-gray-600 text-sm">
                    [ 数据可视化面板 ]
                  </div>
                )}
                {project.demoType === 'academic' && (
                  <div className="text-gray-600 text-sm font-serif italic">
                    "Abstract: We propose a novel..."
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick(project);
                }}
                className="mt-6 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 relative z-10"
              >
                查看详情
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* End Card */}
      <div className="min-w-[300px] h-[70vh] snap-center flex items-center justify-center flex-shrink-0">
        <p className="text-gray-500 font-mono">more.......</p>
      </div>
    </div>
    </>
  );
};

export default Gallery;
