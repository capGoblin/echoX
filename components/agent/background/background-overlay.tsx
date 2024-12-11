'use client';

export function BackgroundOverlay() {
  return (
    <>
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0F12]/90 backdrop-blur-xl" />
      
      {/* Noise texture */}
      <div 
        className="fixed inset-0 opacity-[0.15] mix-blend-soft-light backdrop-blur-3xl"
        style={{ 
          backgroundImage: 'url("/noise.png")',
          backgroundRepeat: 'repeat',
        }} 
      />
      
      {/* Center spotlight */}
      <div 
        className="fixed inset-0 opacity-30 backdrop-blur-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 70%)',
        }}
      />
    </>
  );
}