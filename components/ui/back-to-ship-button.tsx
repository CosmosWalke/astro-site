'use client'

import { useEffect, useMemo, useState } from "react";
import { Sparkle, Ship } from "lucide-react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { cn } from "@/lib/utils";

interface BackToShipButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 15,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#00d4ff", "#39ff14", "#ff6b35", "#7c3aed", "#bae6fd", "#a78bfa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 3 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 50,
        y: 50,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 3,
        delay: 0.3,
      },
      position: {
        x: 50,
        y: 50,
      },
    },
  ],
};

export function BackToShipButton({ href = "/", onClick, className }: BackToShipButtonProps) {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "group relative rounded-full bg-gradient-to-r from-[#00d4ff]/30 via-[#00d4ff]/40 via-40% to-[#ff6b35]/30 p-[1.5px] text-white transition-transform hover:scale-105 active:scale-95",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00d4ff] via-[#00d4ff] via-40% to-[#ff6b35] px-6 py-2.5 text-white font-mono text-sm tracking-wider">
        <Ship className="size-4 -translate-y-0.5" />
        
        {/* Sparkle decorations */}
        <Sparkle
          className="absolute -top-2 -right-2 size-3 animate-sparkle fill-white text-white/80"
          style={{
            animationDelay: "0s",
          }}
        />
        <Sparkle
          style={{
            animationDelay: "0.8s",
            animationDuration: "2s",
          }}
          className="absolute -top-1 left-1/2 size-2 animate-sparkle fill-white text-white/60"
        />
        <Sparkle
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute -bottom-2 right-3 size-2.5 animate-sparkle fill-white text-white/70"
        />
        <Sparkle
          style={{
            animationDelay: "0.4s",
            animationDuration: "1.8s",
          }}
          className="absolute top-1/2 -right-3 size-1.5 -translate-y-1/2 animate-sparkle fill-white text-white/50"
        />

        <span className="font-bold tracking-[0.1em]">BACK TO SHIP</span>
      </div>
      
      {!!particleState && (
        <Particles
          id="back-to-ship-particles"
          className={cn(
            "pointer-events-none absolute -inset-4 z-0 opacity-0 transition-opacity duration-300",
            {
              "group-hover:opacity-100": particleState === "ready",
            }
          )}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </a>
  );
}