"use client";

interface LoadingScreenProps {
  progress: number;
  isVisible: boolean;
}

const barcodeWidths = [2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2];

export function LoadingScreen({ progress, isVisible }: LoadingScreenProps) {
  console.log('LoadingScreen render:', { progress, isVisible });
  
  if (!isVisible) return null;
  
  return (
    <div 
      id="loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Loading triangles SVG */}
        <div style={{ width: '64px', height: '64px', position: 'relative' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon
              points="50,10 90,90 10,90"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2"
            />
            <polygon
              points="50,25 75,75 25,75"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1"
            />
            <polygon
              points="50,40 60,60 40,60"
              fill="#00d4ff"
            />
          </svg>
        </div>

        {/* Progress bar */}
        <div style={{ width: '256px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#00d4ff', fontSize: '12px', fontFamily: 'monospace' }}>LOADING PROTOCOL</span>
            <span style={{ color: '#00d4ff', fontSize: '12px', fontFamily: 'monospace' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '1px', backgroundColor: '#1a1a24', overflow: 'hidden', borderRadius: '2px' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#00d4ff',
                width: `${progress}%`,
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>
        </div>

        {/* Barcode */}
        <div style={{ display: 'flex', gap: '2px', height: '36px', alignItems: 'flex-end' }}>
          {barcodeWidths.map((width, i) => (
            <div
              key={i}
              style={{
                width: `${width}px`,
                height: '100%',
                backgroundColor: '#00d4ff',
                opacity: progress > i * 3.2 ? 1 : 0.25,
                transition: 'opacity 0.15s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}