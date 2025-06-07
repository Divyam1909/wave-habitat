import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const EnhancedOceanBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas size
    setCanvasDimensions();

    // Update canvas size on window resize
    window.addEventListener('resize', setCanvasDimensions);

    // Wave parameters
    const waves = [
      { y: 0.5, length: 0.01, amplitude: 10, speed: 0.01 },
      { y: 0.6, length: 0.02, amplitude: 15, speed: 0.007 },
      { y: 0.7, length: 0.015, amplitude: 8, speed: 0.015 }
    ];

    let animationFrameId: number;
    let time = 0;

    // Animation function
    const animate = () => {
      time += 0.05;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#041c2c');
      gradient.addColorStop(1, '#0a2d4a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        
        // Wave gradient
        const waveGradient = ctx.createLinearGradient(0, wave.y * canvas.height, 0, wave.y * canvas.height + 50);
        waveGradient.addColorStop(0, `rgba(14, 165, 233, ${0.2 - index * 0.05})`);
        waveGradient.addColorStop(1, `rgba(14, 165, 233, ${0.05 - index * 0.02})`);
        
        ctx.strokeStyle = waveGradient;
        ctx.lineWidth = 50 - index * 10;
        
        // Draw wave path
        ctx.moveTo(0, wave.y * canvas.height);
        
        for (let x = 0; x < canvas.width; x++) {
          const dx = x * wave.length;
          const dy = Math.sin(dx + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, wave.y * canvas.height + dy);
        }
        
        ctx.stroke();
      });
      
      // Add subtle particles
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />
      <Overlay />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

const gradientAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(4, 28, 44, 0), rgba(4, 28, 44, 0.4));
  animation: ${gradientAnimation} 8s ease-in-out infinite;
  pointer-events: none;
`;

export default EnhancedOceanBackground;