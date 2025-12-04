import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  // Debug log
  React.useEffect(() => {
    if (project) console.log('Modal rendering for:', project.title);
  }, [project]);

  return createPortal(
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-700 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={24} />
            </button>

          {/* Left: Media / Demo Area */}
          <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-gray-800">
            {project.mediaType === 'component' && project.id === 'kinect' ? (
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-neon-blue flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                  <project.icon size={64} className="text-neon-blue" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">交互式体验中</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  您当前正在使用摄像头进行手势控制。
                  <br/>
                  请尝试在主页使用手势滑动卡片。
                </p>
              </div>
            ) : project.mediaType === 'video' ? (
              <div className="w-full h-full relative group bg-black flex items-center justify-center">
                {/* Use key to force re-render when url changes */}
                <video 
                  key={project.mediaUrl}
                  src={project.mediaUrl} 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-contain"
                >
                  您的浏览器不支持视频播放。
                </video>
              </div>
            ) : (
              <div className="w-full h-full relative group">
                {project.mediaUrl ? (
                  <img 
                    src={project.mediaUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-600">
                    <project.icon size={64} className="mb-4 opacity-50" />
                    <span>暂无演示媒体</span>
                  </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
              </div>
            )}
          </div>            {/* Right: Content Area */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="mb-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg bg-gray-800/50 ${project.color}`}>
                    <project.icon size={24} />
                  </div>
                  <span className="text-sm font-mono text-gray-500 border border-gray-700 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  {project.title}
                </h2>

                <div className="prose prose-invert prose-lg">
                  <p className="text-gray-300 leading-relaxed">
                    {project.details || project.description}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-800">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  技术栈 / 关键词
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Python', 'AI Model', 'Data Analysis'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded hover:bg-gray-700 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full mt-8 py-4 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-xl font-bold transition-all flex items-center justify-center gap-2 group">
                  <span>查看源码 / 论文</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
