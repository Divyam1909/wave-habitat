import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface BubbleProps {
  size: number;
  delay: number;
  duration: number;
  positionX: number;
  opacity: number;
  scale: number;
}

const EnhancedBubbles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<BubbleProps[]>([]);
  
  useEffect(() => {
    // Generate random bubble properties
    const generateBubbles = () => {
      const bubbles: BubbleProps[] = [];
      const count = window.innerWidth < 768 ? 15 : 25;
      
      for (let i = 0; i < count; i++) {
        bubbles.push({
          size: 5 + Math.random() * 20,
          delay: Math.random() * 15,
          duration: 8 + Math.random() * 12,
          positionX: Math.random() * 100,
          opacity: 0.1 + Math.random() * 0.4,
          scale: 0.8 + Math.random() * 0.5
        });
      }
      
      bubblesRef.current = bubbles;
    };
    
    generateBubbles();
    
    // Regenerate bubbles on window resize
    const handleResize = () => {
      generateBubbles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <BubblesContainer ref={containerRef}>
      {bubblesRef.current.map((bubble, index) => (
        <Bubble 
          key={index}
          size={bubble.size}
          delay={bubble.delay}
          duration={bubble.duration}
          positionX={bubble.positionX}
          opacity={bubble.opacity}
          scale={bubble.scale}
        />
      ))}
    </BubblesContainer>
  );
};

const rise = keyframes`
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0;
    border-radius: 50%;
  }
  10% {
    opacity: var(--bubble-opacity);
  }
  30% {
    transform: translate(calc(var(--drift-x) * 0.3), -30vh) scale(var(--scale)) rotate(5deg);
    border-radius: 50%;
  }
  50% {
    transform: translate(calc(var(--drift-x) * -0.3), -50vh) scale(var(--scale)) rotate(-5deg);
  }
  70% {
    transform: translate(calc(var(--drift-x) * 0.5), -70vh) scale(var(--scale)) rotate(5deg);
    opacity: var(--bubble-opacity);
  }
  100% {
    transform: translate(calc(var(--drift-x) * -0.2), -100vh) scale(var(--scale) * 0.7) rotate(-10deg);
    opacity: 0;
  }
`;

const BubblesContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  top: 0;
  left: 0;
  pointer-events: none;
`;

interface StyledBubbleProps {
  size: number;
  delay: number;
  duration: number;
  positionX: number;
  opacity: number;
  scale: number;
}

const Bubble = styled.div<StyledBubbleProps>`
  position: absolute;
  bottom: -50px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  left: ${props => props.positionX}%;
  
  /* Custom properties for the animation */
  --bubble-opacity: ${props => props.opacity};
  --scale: ${props => props.scale};
  --drift-x: ${props => (Math.random() * 100) - 50}px;
  
  /* Bubble styling */
  background: radial-gradient(
    circle at 70% 30%, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(255, 255, 255, 0.5) 20%, 
    rgba(14, 165, 233, ${props => props.opacity * 0.5}) 50%, 
    rgba(14, 165, 233, ${props => props.opacity}) 100%
  );
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 
              inset 0 0 10px rgba(255, 255, 255, 0.5);
  
  /* Animation */
  animation: ${rise} ${props => props.duration}s ease-in infinite;
  animation-delay: ${props => props.delay}s;
  
  /* Add subtle glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    filter: blur(2px);
  }
`;

export default EnhancedBubbles;