import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = []; // For mouse trail
    let floatingParticles = []; // For background floating dots
    let waves = []; // For bottom waves
    let mouse = { x: -100, y: -100 };
    let time = 0;

    const initFloatingParticles = () => {
      floatingParticles = [];
      const count = 500; // Number of floating particles
      for (let i = 0; i < count; i++) {
        floatingParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5, // Small size
          speedX: (Math.random() - 0.5) * 0.5, // Very slow horizontal movement
          speedY: (Math.random() - 0.5) * 0.5, // Very slow vertical movement
          opacity: Math.random() * 0.5 + 0.1, // Random transparency
        });
      }
    };

    const initWaves = () => {
      waves = [];
      const waveCount = 3;
      // 增加点间距，让线条更平滑宽大
      const pointsCount = Math.ceil(canvas.width / 60); 

      for (let w = 0; w < waveCount; w++) {
        const wavePoints = [];
        for (let i = 0; i <= pointsCount; i++) {
          wavePoints.push({
            x: (canvas.width / pointsCount) * i,
            baseY: canvas.height - (40 + w * 60), // 拉开层级间距
            // 基础角度
            angle: i * 0.15 + w, 
            // 极慢的基础速度
            speed: 0.001 + Math.random() * 0.002,
            // 基础振幅
            amp: 20 + w * 15,
            // 叠加波的参数，增加随机性
            offset: Math.random() * Math.PI * 2,
            freq: 0.5 + Math.random() * 0.5
          });
        }
        waves.push(wavePoints);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initWaves();
      initFloatingParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Add particles on move for trail effect
      for (let i = 0; i < 2; i++) {
        particles.push(createParticle(mouse.x, mouse.y));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle factory for trail
    const createParticle = (x, y) => {
      return {
        x,
        y,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: 100,
        opacity: 1,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005; // 全局时间缓慢流动
      
      // 1. Draw Waves (Points and Lines)
      waves.forEach((wave, wIndex) => {
        ctx.beginPath();
        // Line style - 更柔和的透明度
        ctx.strokeStyle = `rgba(0, 243, 255, ${0.08 + wIndex * 0.04})`; 
        ctx.lineWidth = 1;

        wave.forEach((p, i) => {
          // 复杂的波动公式：主波 + 叠加波 + 噪声模拟
          // 使用 time 让波浪整体缓慢移动
          const wave1 = Math.sin(p.angle + time + p.offset);
          const wave2 = Math.sin(p.angle * p.freq - time * 0.5);
          
          // 组合波形，让运动不再是简单的上下
          const y = p.baseY + (wave1 * p.amp) + (wave2 * p.amp * 0.4);
          
          // Draw point
          ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + wIndex * 0.1})`;
          const circle = new Path2D();
          circle.arc(p.x, y, 1.5, 0, Math.PI * 2);
          ctx.fill(circle);

          // Connect line
          if (i === 0) {
            ctx.moveTo(p.x, y);
          } else {
            // 使用贝塞尔曲线连接，更平滑
            // 简单的直线连接也可以，因为点够密
            ctx.lineTo(p.x, y);
          }
          
          // Vertical connections (Mesh effect)
          if (wIndex > 0) {
             const prevWave = waves[wIndex - 1];
             const prevP = prevWave[i];
             // 重新计算上一层对应点的 y (因为是实时计算的)
             const prevWave1 = Math.sin(prevP.angle + time + prevP.offset);
             const prevWave2 = Math.sin(prevP.angle * prevP.freq - time * 0.5);
             const prevY = prevP.baseY + (prevWave1 * prevP.amp) + (prevWave2 * prevP.amp * 0.4);

             const meshLine = new Path2D();
             meshLine.moveTo(p.x, y);
             meshLine.lineTo(prevP.x, prevY);
             ctx.save();
             ctx.strokeStyle = `rgba(0, 243, 255, 0.03)`; // 非常淡的纵向连线
             ctx.stroke(meshLine);
             ctx.restore();
          }
        });
        ctx.stroke();
      });

      // 2. Draw Floating Particles
      floatingParticles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Mouse Trail Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 2;
        p.opacity = p.life / 100;
        
        ctx.fillStyle = `rgba(188, 19, 254, ${p.opacity})`; // Neon purple
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      particles = particles.filter(p => p.life > 0);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
