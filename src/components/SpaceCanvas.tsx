import React, { useRef, useEffect, useCallback } from "react";

// Define the shape of a Star object
interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  velocity: number;
}

const SpaceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const stars = useRef<Star[]>([]);
  const numStars = 500;

  const createStars = useCallback((width: number, height: number) => {
    const newStars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1 + 0.5,
        alpha: Math.random(),
        velocity:
          (Math.random() * 0.005 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      });
    }
    stars.current = newStars;
  }, []);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr); // scale context to match resolution
    }

    createStars(width, height);
  }, [createStars]);

  const drawStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();

      // Twinkling effect
      star.alpha += star.velocity;
      if (star.alpha > 1 || star.alpha < 0) {
        star.velocity = -star.velocity;
        star.alpha = Math.max(0, Math.min(1, star.alpha));
      }
    });
  }, []);

  const animate = useCallback(() => {
    drawStars();
    animationFrameId.current = requestAnimationFrame(animate);
  }, [drawStars]);

  useEffect(() => {
    setCanvasSize();
    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [setCanvasSize, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        display: "block",
        background: "black",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default SpaceCanvas;
