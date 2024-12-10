'use client';

import dynamic from 'next/dynamic';

// Dynamically import heavy components
const NeuralNetwork = dynamic(() => import('./neural-network').then(mod => mod.NeuralNetwork), {
  ssr: false,
});

const WaveEffect = dynamic(() => import('./wave-effect').then(mod => mod.WaveEffect), {
  ssr: false,
});

const Particles = dynamic(() => import('./particles').then(mod => mod.Particles), {
  ssr: false,
});

const MouseGlow = dynamic(() => import('./mouse-glow').then(mod => mod.MouseGlow), {
  ssr: false,
});

export function BackgroundEffects() {
  return (
    <>
      <div className="absolute inset-0 -z-30">
        <MouseGlow />
      </div>
      <div className="absolute inset-0 -z-20">
        <NeuralNetwork />
      </div>
      <div className="absolute inset-0 -z-10">
        <WaveEffect />
      </div>
      <div className="absolute inset-0 -z-10">
        <Particles />
      </div>
    </>
  );
}