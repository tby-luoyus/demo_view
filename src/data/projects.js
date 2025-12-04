import { Monitor, Cpu, Bot, FileText, Eye, Share2 } from 'lucide-react';

const BASE_URL = import.meta.env.BASE_URL;

export const projects = [
  {
    id: 'kinect',
    title: 'Kinect 教学系统',
    category: '应用层',
    description: '结合 Kinect v1 深度摄像头做的教学系统。支持手势操控网页，捏住滑动，捕捉手部坐标映射鼠标。',
    icon: Eye,
    color: 'text-blue-400',
    demoType: 'interactive', // 特殊标记，用于触发手势控制演示
    details: '本项目利用 Kinect v1 深度摄像头获取人体骨骼数据，通过坐标映射算法将手部位置转换为屏幕坐标，实现了隔空鼠标控制。系统包含手势识别模块（捏合、挥动）和平滑滤波算法，有效解决了抖动问题。',
    mediaType: 'video', // 改为视频展示
    mediaUrl: `${BASE_URL}resources/Kinect 教学系统.mp4`,
  },
  {
    id: 'traffic',
    title: '车流量分析监控平台',
    category: '应用层',
    description: '基于融合神经网络 DenseNet-Inception 与 LSTM 的智慧交通识别系统，实时分析车流量与车牌信息。',
    icon: Monitor,
    color: 'text-green-400',
    demoType: 'static',
    details: `【智慧交通识别系统】
    
1. 背景与目标：
随着城市化进程加速，传统交通管理难以应对庞大复杂的车流。本项目旨在打造一套高精度、强适应性的智慧交通识别系统，解决实时、精准管理的痛点。

2. 核心技术栈：
- 语言与框架：Python, Qt (LGPL协议) UI框架。
- 算法模型：
  * 创新性融合神经网络 DenseNet-Inception：结合 DenseNet 的特征复用与 Inception 的多尺度提取能力，实现高性能目标检测。
  * 垂直投影算法：优化车牌定位与字符分割。
  * LSTM 长短期记忆网络：处理时间序列数据，提升动态场景下的识别稳定性。

3. 系统功能：
实现交通数据的高效采集与智能分析，支持车流量统计、车型识别及车牌追踪，为智慧城市交通管理提供数据支撑。`,
    mediaType: 'video',
    mediaUrl: `${BASE_URL}resources/车流识别+牌识别视频演示.mp4`,
  },
  {
    id: 'tang',
    title: '智能体小唐',
    category: '应用层',
    description: '基于 LLM 制作的可培养型陪伴智能体。',
    icon: Bot,
    color: 'text-pink-400',
    demoType: 'chat',
    details: '集成了 LangChain 框架与本地部署的 ChatGLM 模型。小唐拥有长期记忆模块（Vector DB），能够记住用户的喜好与过往对话。支持性格培养系统，根据用户交互反馈动态调整回复语气。',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'doc-analysis',
    title: '智能文档平台',
    category: '应用层',
    description: '集成 OCR、版面分析与 LLM 的全链路文档处理系统，实现非结构化文档的智能解析与知识提取。',
    icon: FileText,
    color: 'text-yellow-400',
    demoType: 'static',
    details: `【智能文档处理全流程】

1. 核心能力：
   - 多模态解析：融合 OCR 文字识别与计算机视觉技术，精准还原文档中的表格、公式及复杂排版。
   - 语义理解：基于大语言模型（LLM）对文档内容进行深度理解，支持自动摘要、关键信息提取及合规性审查。
   - 格式重构：一键将扫描件或混乱文档转换为标准格式（如 Word/Markdown），自动校正字体、行距与标题层级。

2. 应用场景：
   广泛应用于学术论文排版、企业合同审核、档案数字化管理等场景，大幅提升文档处理效率与准确率。`,
    mediaType: 'video',
    mediaUrl: `${BASE_URL}resources/智能文档平台.mp4`,
  },
  {
    id: 'densenet',
    title: 'DenseNet-Inception 优化',
    category: '算法层',
    description: '密集连接神经网络结构设计和优化，针对 CIFAR-10 等数据集的高效图像识别。',
    icon: Cpu,
    color: 'text-purple-400',
    demoType: 'academic',
    details: '提出了一种混合网络架构，结合了 DenseNet 的特征复用优势与 Inception 的多尺度特征提取能力。在 CIFAR-10 数据集上，相比原版 DenseNet-121，参数量减少 15%，准确率提升 0.8%。',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'hypergraph',
    title: '超图卷积 NLP 方法',
    category: '算法层',
    description: '融合节点-超边注意力机制，利用超图结构建模社交网络中文本语义传播关系。',
    icon: Share2,
    color: 'text-indigo-400',
    demoType: 'academic',
    details: '针对传统图神经网络无法有效建模高阶关联的问题，引入超图卷积网络（HGCN）。设计了节点-超边双向注意力机制，有效捕捉了社交网络中复杂的话题传播路径。',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
  }
];
