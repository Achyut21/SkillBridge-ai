'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    // Set dimensions after component mounts to avoid SSR mismatch
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Neural nodes with organic movement
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
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

    // Floating particles for depth
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.2 + 0.05,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions with organic movement
      nodes.forEach((node, i) => {
        // Add some organic movement
        const time = Date.now() * 0.001;
        node.vx += Math.sin(time + i) * 0.01;
        node.vy += Math.cos(time + i) * 0.01;

        // Apply mouse influence
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          node.vx += (dx / distance) * force * 0.02;
          node.vy += (dy / distance) * force * 0.02;
        }

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Bounce off edges softly
        if (node.x < 50) node.vx += 0.5;
        if (node.x > canvas.width - 50) node.vx -= 0.5;
        if (node.y < 50) node.vy += 0.5;
        if (node.y > canvas.height - 50) node.vy -= 0.5;

        // Update pulse
        node.pulsePhase += 0.02;
      });

      // Find connections between nodes
      nodes.forEach((node) => {
        node.connections = [];
        nodes.forEach((other) => {
          if (node !== other) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
              node.connections.push({ other, distance });
            }
          }
        });
      });

      // Draw connections with neural network aesthetic
      nodes.forEach((node) => {
        node.connections.forEach((connection) => {
          const opacity = (1 - connection.distance / 200) * 0.3;
          
          // Neural connection with gradient
          const gradient = ctx.createLinearGradient(
            node.x, node.y,
            connection.other.x, connection.other.y
          );
          gradient.addColorStop(0, `rgba(147, 51, 234, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(147, 51, 234, ${opacity})`);

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connection.other.x, connection.other.y);
          ctx.stroke();
        });
      });

      // Draw neural nodes with pulsing effect
      nodes.forEach((node) => {
        const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.1;
        const radius = node.radius * pulseScale;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 4
        );
        glowGradient.addColorStop(0, `rgba(168, 85, 247, ${node.opacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.fillStyle = `rgba(168, 85, 247, ${node.opacity})`;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spot
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.5})`;
        ctx.arc(node.x, node.y, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw background particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  // Don't render anything on server side
  if (dimensions.width === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-background opacity-70"
      style={{ pointerEvents: 'none' }}
      width={dimensions.width}
      height={dimensions.height}
    />
  );
}