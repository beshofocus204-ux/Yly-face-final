import React, { useMemo } from "react";

export const CosmicBackground: React.FC = () => {
  // Generate random static stars to prevent re-renders
  const stars = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 53) % 100,
      size: (i % 3) + 1.2,
      opacity: ((i % 5) + 3) / 10,
      duration: (i % 4) + 3,
      delay: (i % 5) * 0.7,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep cosmic base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#07132a] to-[#04091a]" />

      {/* Subtle blue nebula glows */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[130px]" />
      <div className="absolute -bottom-24 left-1/4 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[150px]" />

      {/* Cosmic stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
