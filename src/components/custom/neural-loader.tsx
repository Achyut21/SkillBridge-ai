'use client';

export function NeuralLoader() {
  return (
    <div className="relative w-32 h-32">
      {/* Orbital dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-brand-500 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 45}deg) translateY(-40px)`,
            animation: `neural-pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            ['--rotation' as any]: `${i * 45}deg`
          }}
        />
      ))}
      
      {/* Center pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-brand-500/20 rounded-full animate-ping" />
        <div className="absolute w-8 h-8 bg-brand-500/40 rounded-full animate-pulse" />
        <div className="absolute w-4 h-4 bg-brand-500 rounded-full" />
      </div>
      
      {/* Loading text */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-brand-600 dark:text-brand-400 font-medium">
        Loading...
      </div>
    </div>
  );
}