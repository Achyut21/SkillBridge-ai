'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Neural nodes with organic movement
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;      radius: number;
      connections: Array<{ other: any; distance: number }>;
      pulsePhase: number;
      opacity: number;
    }> = [];

    // Create neural network nodes
    for (let i = 0; i < 25; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        radius: Math.random() * 3 + 2,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Subtle trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update nodes with organic movement
      nodes.forEach((node, i) => {
        // Sinusoidal movement for organic feel
        node.vx += Math.sin(Date.now() * 0.0001 + node.pulsePhase) * 0.01;
        node.vy += Math.cos(Date.now() * 0.0001 + node.pulsePhase) * 0.01;
        
        // Mouse attraction
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          node.vx += dx * 0.00002;
          node.vy += dy * 0.00002;
        }
        
        // Apply gentle friction
        node.vx *= 0.99;
        node.vy *= 0.99;        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Soft boundaries with repulsion
        const margin = 50;
        if (node.x < margin) node.vx += (margin - node.x) * 0.001;
        if (node.x > canvas.width - margin) node.vx -= (node.x - canvas.width + margin) * 0.001;
        if (node.y < margin) node.vy += (margin - node.y) * 0.001;
        if (node.y > canvas.height - margin) node.vy -= (node.y - canvas.height + margin) * 0.001;
        
        // Dynamic connections
        node.connections = [];
        nodes.forEach((other, j) => {
          if (i !== j) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              node.connections.push({ other, distance });
            }
          }
        });
      });
      // Draw connections with gradient
      nodes.forEach(node => {
        node.connections.forEach(({ other, distance }) => {
          const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
          const opacity = (1 - distance / 150) * 0.2;
          
          gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(147, 51, 234, ${opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity})`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });
      });

      // Draw nodes with glow effect
      nodes.forEach(node => {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4
        );        glowGradient.addColorStop(0, `rgba(168, 85, 247, ${node.opacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner node with pulse
        const pulseScale = 1 + Math.sin(Date.now() * 0.001 + node.pulsePhase) * 0.1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(168, 85, 247, ${node.opacity})`;
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright center
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.arc(node.x, node.y, node.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30 dark:opacity-50"
      style={{ pointerEvents: 'none' }}
    />
  );
}