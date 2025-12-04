import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">项目未找到</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-neon-blue hover:underline"
          >
            返回主页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 overflow-y-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-neon-blue hover:text-white transition-colors mb-8 z-50 relative"
      >
        <ArrowLeft size={24} />
        返回主页
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Media Section */}
        <div className="bg-black/50 rounded-xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center shadow-2xl">
           {project.mediaType === 'video' ? (
              <video 
                src={project.mediaUrl} 
                controls 
                autoPlay 
                loop 
                muted
                className="w-full h-full object-contain"
              >
                您的浏览器不支持视频播放。
              </video>
           ) : (
              <img 
                src={project.mediaUrl} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
           )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-xl bg-white/5 ${project.color}`}>
              <project.icon size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-white/10">
                {project.category}
              </span>
            </div>
          </div>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {project.description}
          </p>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-neon-blue flex items-center gap-2">
              <span className="w-1 h-6 bg-neon-blue rounded-full"></span>
              项目详情
            </h3>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {project.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
