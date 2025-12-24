"use client";

// Unified background with radial glows positioned at key points
// This replaces individual section backgrounds for a seamless effect
export function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#010052]" />

      {/* Hero area glow - centered at top */}
      <div
        className="circle-radial"
        style={{
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
        }}
      />

      {/* ValueProp area glow - left side */}
      <div
        className="circle-radial"
        style={{
          top: '900px',
          left: '-300px',
          opacity: 0.3,
        }}
      />

      {/* Features/Modules area glow - right side */}
      <div
        className="circle-radial"
        style={{
          top: '1800px',
          right: '-400px',
          opacity: 0.25,
        }}
      />

      {/* Team area glow - left side */}
      <div
        className="circle-radial"
        style={{
          top: '3200px',
          left: '-300px',
          opacity: 0.3,
        }}
      />

      {/* Testimonials area glow - right side */}
      <div
        className="circle-radial"
        style={{
          top: '4000px',
          right: '-500px',
          opacity: 0.25,
        }}
      />

      {/* FAQ/CTA area glow - centered */}
      <div
        className="circle-radial"
        style={{
          top: '5000px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.3,
        }}
      />
    </div>
  );
}
