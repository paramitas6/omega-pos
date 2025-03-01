// components/CatAnimation.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";


type CatState = 'appearing' | 'stalking' | 'attacking' | 'fleeing';

export default function CatChase({
  imageSrc = "/cat/cat1.png",
  size = 192,
  stalkSpeed = 0.08,
  fleeSpeed = 0.2
}: {
  imageSrc?: string;
  size?: number;
  stalkSpeed?: number;
  fleeSpeed?: number;
}) {
  const catRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CatState>('appearing');
  const targetPos = useRef({ x: 0, y: 0 });
  const fleeDirection = useRef({ x: 0, y: 0 });

  // Initial appearance from random edge (fully off-screen)
  useEffect(() => {
    if (!catRef.current) return;
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Start positions well outside viewport
    let startX = 0, startY = 0;
    switch(edge) {
      case 'top':
        startX = Math.random() * viewportWidth;
        startY = -size * 2; // Double the size offset
        break;
      case 'bottom':
        startX = Math.random() * viewportWidth;
        startY = viewportHeight + size * 2;
        break;
      case 'left':
        startX = -size * 2;
        startY = Math.random() * viewportHeight;
        break;
      case 'right':
        startX = viewportWidth + size * 2;
        startY = Math.random() * viewportHeight;
        break;
    }

    catRef.current.style.left = `${startX}px`;
    catRef.current.style.top = `${startY}px`;

    // Random target within 75% of viewport
    targetPos.current = {
      x: viewportWidth/2 + (Math.random() - 0.5) * viewportWidth * 0.75,
      y: viewportHeight/2 + (Math.random() - 0.5) * viewportHeight * 0.75
    };

    const entranceAnimation = () => {
      if (!catRef.current) return;
      
      const rect = catRef.current.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;
      
      const dx = targetPos.current.x - currentX;
      const dy = targetPos.current.y - currentY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      if (distance > 5) {
        catRef.current.style.left = `${currentX + dx * 0.1}px`;
        catRef.current.style.top = `${currentY + dy * 0.1}px`;
        requestAnimationFrame(entranceAnimation);
      } else {
        setState('stalking');
      }
    };

    requestAnimationFrame(entranceAnimation);
  }, [size]);

  // Hunting behavior
  useEffect(() => {
    if (state !== 'stalking') return;
    
    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
    let animationFrameId: number;

    const hunt = (e: MouseEvent) => {
      if (!catRef.current || state !== 'stalking') return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const rect = catRef.current.getBoundingClientRect();
      const catX = rect.left + rect.width/2;
      const catY = rect.top + rect.height/2;

      const dx = mouseX - catX;
      const dy = mouseY - catY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      const newX = lerp(catX, mouseX, stalkSpeed);
      const newY = lerp(catY, mouseY, stalkSpeed);

      catRef.current.style.left = `${newX - rect.width/2}px`;
      catRef.current.style.top = `${newY - rect.height/2}px`;

      const angle = Math.atan2(dy, dx);
      catRef.current.style.transform = `rotate(${angle + Math.PI/2}rad)`;

      if (distance < 100) {
        setState('attacking');
        setTimeout(() => {
          setState('fleeing');
          // Calculate flee direction away from cursor
          const fleeAngle = Math.atan2(catY - mouseY, catX - mouseX);
          fleeDirection.current = {
            x: Math.cos(fleeAngle) * 10, // Stronger flee direction
            y: Math.sin(fleeAngle) * 10
          };
        }, 300);
      }

      animationFrameId = requestAnimationFrame(() => hunt(e));
    };

    const handleMouseMove = (e: MouseEvent) => hunt(e);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, stalkSpeed]);

  // Fleeing behavior (with proper off-screen detection)
  useEffect(() => {
    if (state !== 'fleeing') return;
    
    let animationFrameId: number;
    const flee = () => {
      if (!catRef.current) return;

      const rect = catRef.current.getBoundingClientRect();
      const newX = rect.left + fleeDirection.current.x * fleeSpeed * 50; // Faster fleeing
      const newY = rect.top + fleeDirection.current.y * fleeSpeed * 50;

      catRef.current.style.left = `${newX}px`;
      catRef.current.style.top = `${newY}px`;

      // Check if completely off-screen with buffer
      const buffer = size * 2;
      if (newX < -buffer || 
          newX > window.innerWidth + buffer ||
          newY < -buffer || 
          newY > window.innerHeight + buffer) {
        setState('appearing');
      } else {
        animationFrameId = requestAnimationFrame(flee);
      }
    };

    animationFrameId = requestAnimationFrame(flee);
    return () => cancelAnimationFrame(animationFrameId);
  }, [state, fleeSpeed, size]);

  return (
    <div 
      ref={catRef}
      className="fixed z-20 cursor-pointer transition-all duration-300 ease-out"
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: 'center',
      }}
    >
      <Image
        src={imageSrc}
        alt="Hunting cat"
        width={size}
        height={size}
        className={`object-cover ${
          state === 'attacking' ? 'animate-paw-scale' : ''
        } ${
          state === 'fleeing' ? 'grayscale-[75%] brightness-125' : ''
        }`}
      />
    </div>
  );
}

export function CatChase1({
  imageSrc = "/cat/cat1.png",
  size = 192,
  stalkSpeed = 0.08,
  fleeSpeed = 0.2
}: {
  imageSrc?: string;
  size?: number;
  stalkSpeed?: number;
  fleeSpeed?: number;
}) {
  const catRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CatState>('appearing');
  const targetPos = useRef({ x: 0, y: 0 });
  const fleeDirection = useRef({ x: 0, y: 0 });

  // Initial appearance from random edge
  useEffect(() => {
    if (!catRef.current) return;
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let startX = 0, startY = 0;
    switch(edge) {
      case 'top':
        startX = Math.random() * viewportWidth;
        startY = -size;
        break;
      case 'bottom':
        startX = Math.random() * viewportWidth;
        startY = viewportHeight + size;
        break;
      case 'left':
        startX = -size;
        startY = Math.random() * viewportHeight;
        break;
      case 'right':
        startX = viewportWidth + size;
        startY = Math.random() * viewportHeight;
        break;
    }

    // Set initial position
    catRef.current.style.left = `${startX}px`;
    catRef.current.style.top = `${startY}px`;

    // Calculate middle screen target
    targetPos.current = {
      x: viewportWidth/2 + (Math.random() - 0.5) * viewportWidth/2,
      y: viewportHeight/2 + (Math.random() - 0.5) * viewportHeight/2
    };

    // Animate entrance
    const entranceAnimation = () => {
      if (!catRef.current) return;
      
      const rect = catRef.current.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;
      
      const dx = targetPos.current.x - currentX;
      const dy = targetPos.current.y - currentY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      if (distance > 5) {
        catRef.current.style.left = `${currentX + dx * 0.1}px`;
        catRef.current.style.top = `${currentY + dy * 0.1}px`;
        requestAnimationFrame(entranceAnimation);
      } else {
        setState('stalking');
      }
    };

    requestAnimationFrame(entranceAnimation);
  }, [size]);

  // Hunting behavior
  useEffect(() => {
    if (state !== 'stalking') return;
    
    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
    let animationFrameId: number;

    const hunt = (e: MouseEvent) => {
      if (!catRef.current || state !== 'stalking') return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const rect = catRef.current.getBoundingClientRect();
      const catX = rect.left + rect.width/2;
      const catY = rect.top + rect.height/2;

      const dx = mouseX - catX;
      const dy = mouseY - catY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      // Stalking movement
      const newX = lerp(catX, mouseX, stalkSpeed);
      const newY = lerp(catY, mouseY, stalkSpeed);

      catRef.current.style.left = `${newX - rect.width/2}px`;
      catRef.current.style.top = `${newY - rect.height/2}px`;

      // Rotation
      const angle = Math.atan2(dy, dx);
      catRef.current.style.transform = `rotate(${angle + Math.PI/2}rad)`;

      // Attack trigger
      if (distance < 100) {
        setState('attacking');
        setTimeout(() => {
          setState('fleeing');
          fleeDirection.current = {
            x: Math.sign(catX - mouseX) * 2,
            y: Math.sign(catY - mouseY) * 2
          };
        }, 500);
      }

      animationFrameId = requestAnimationFrame(() => hunt(e));
    };

    const handleMouseMove = (e: MouseEvent) => hunt(e);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, stalkSpeed]);

  // Fleeing behavior
  useEffect(() => {
    if (state !== 'fleeing') return;
    
    let animationFrameId: number;
    const flee = () => {
      if (!catRef.current) return;

      const rect = catRef.current.getBoundingClientRect();
      const newX = rect.left + fleeDirection.current.x * fleeSpeed * 30;
      const newY = rect.top + fleeDirection.current.y * fleeSpeed * 30;

      catRef.current.style.left = `${newX}px`;
      catRef.current.style.top = `${newY}px`;

      // Reset when offscreen
      if (newX < -size*2 || newX > window.innerWidth + size*2 ||
          newY < -size*2 || newY > window.innerHeight + size*2) {
        setState('appearing');
      } else {
        animationFrameId = requestAnimationFrame(flee);
      }
    };

    animationFrameId = requestAnimationFrame(flee);
    return () => cancelAnimationFrame(animationFrameId);
  }, [state, fleeSpeed, size]);

  return (
    <div 
      ref={catRef}
      className="fixed z-20 cursor-pointer transition-all duration-300 ease-out"
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: 'center',
      }}
    >
      <Image
        src={imageSrc}
        alt="Hunting cat"
        width={size}
        height={size}
        className={`object-cover ${
          state === 'attacking' ? 'animate-paw' : ''
        } ${
          state === 'fleeing' ? 'grayscale-[50%]' : ''
        }`}
      />
    </div>
  );
}