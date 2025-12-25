// Background with radial glows that scroll with content
// Glows are positioned throughout the page and come into view as user scrolls
export function PageBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base background color - fixed to always cover viewport */}
      <div className="fixed inset-0 bg-[#010052]" />

      {/* Top center glow - near hero */}
      <div
        className="circle-radial"
        style={{
          top: '-300px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
        }}
      />

      {/* Left side glow - around middle sections */}
      <div
        className="circle-radial"
        style={{
          top: '1500px',
          left: '-400px',
          opacity: 0.3,
        }}
      />

      {/* Right side glow - around features/modules */}
      <div
        className="circle-radial"
        style={{
          top: '3000px',
          right: '-400px',
          opacity: 0.25,
        }}
      />

      {/* Bottom center glow - near footer */}
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
