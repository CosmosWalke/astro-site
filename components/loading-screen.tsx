"use client";

interface LoadingScreenProps {
  progress: number;
  isVisible: boolean;
}

const barcodeWidths = [2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2];

export function LoadingScreen({ progress, isVisible }: LoadingScreenProps) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black transition-opacity duration-500">
      <div className="flex flex-col items-center gap-8">
        {/* Loading triangles SVG - адаптировано под киберпанк стиль */}
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,10 90,90 10,90"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2"
              className="animate-pulse"
            />
            <polygon
              points="50,25 75,75 25,75"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <polygon
              points="50,40 60,60 40,60"
              fill="#00d4ff"
              className="animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </svg>
        </div>

        {/* Progress bar - стили под твою тему */}
        <div className="w-64 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
            <span className="text-[#00d4ff]">LOADING PROTOCOL</span>
            <span className="text-[#00d4ff]">{Math.round(progress)}%</span>
          </div>
          <div className="h-px bg-[#1a1a24] relative overflow-hidden rounded">
            <div
              className="h-full bg-[#00d4ff] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Barcode */}
        <div className="flex gap-[2px] h-9 items-end">
          {barcodeWidths.map((width, i) => (
            <div
              key={i}
              className="bg-[#00d4ff] transition-all duration-150"
              style={{
                width: `${width}px`,
                height: '100%',
                opacity: progress > i * 3.2 ? 1 : 0.25,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}