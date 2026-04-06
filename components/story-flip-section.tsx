'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function StoryFlipSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInnerRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const image1Ref = useRef<HTMLDivElement>(null)
  const image2Ref = useRef<HTMLDivElement>(null)
  const image3Ref = useRef<HTMLDivElement>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)
  const uiPanelRef = useRef<HTMLDivElement>(null)
  const keeperSymbolRef = useRef<HTMLDivElement>(null)
  
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    const cardInner = cardInnerRef.current
    const front = frontRef.current
    const back = backRef.current
    
    if (!section || !card || !cardInner || !front || !back) {
      console.log('[v0] Missing refs')
      return
    }

    console.log('[v0] StoryFlipSection mounted, setting up animations')

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(back, { rotateY: 180 })
      gsap.set(image1Ref.current, { opacity: 0, scale: 1.1 })
      gsap.set(image2Ref.current, { opacity: 0, yPercent: 100 })
      gsap.set(image3Ref.current, { opacity: 0, yPercent: 100 })
      gsap.set(text1Ref.current, { opacity: 0, y: 50 })
      gsap.set(text2Ref.current, { opacity: 0, y: 50 })
      gsap.set(uiPanelRef.current, { opacity: 0, x: 50 })
      gsap.set(keeperSymbolRef.current, { opacity: 0, scale: 0.5 })

      // Main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            console.log('[v0] ScrollTrigger progress:', self.progress.toFixed(2))
          }
        }
      })

      // Phase 1: Card grows and moves to center (0-10%)
      tl.to(card, {
        scale: 2,
        x: '0%',
        duration: 0.1,
        ease: 'power2.inOut'
      })

      // Phase 2: 3D Flip rotation (10-25%)
      tl.to(cardInner, {
        rotateY: 180,
        duration: 0.15,
        ease: 'power2.inOut',
        onUpdate: function() {
          const progress = this.progress()
          if (progress > 0.5 && !isFlipped) {
            setIsFlipped(true)
          }
        }
      })

      // Phase 3: Card expands to fullscreen (25-35%)
      tl.to(card, {
        width: '100vw',
        height: '100vh',
        scale: 1,
        borderRadius: 0,
        duration: 0.1,
        ease: 'power3.inOut'
      })

      // Phase 4: Show first image and text (35-50%)
      tl.to(image1Ref.current, {
        opacity: 1,
        scale: 1,
        duration: 0.1
      })
      .to(text1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.08
      }, '-=0.05')
      .to(uiPanelRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.08
      }, '-=0.05')
      
      // Hold first image
      tl.to({}, { duration: 0.05 })

      // Phase 5: Second image slides up (50-70%)
      tl.to(image2Ref.current, {
        opacity: 1,
        yPercent: 0,
        duration: 0.15,
        ease: 'power2.out'
      })
      .to([text1Ref.current, uiPanelRef.current], {
        opacity: 0,
        duration: 0.05
      }, '-=0.1')
      .to(text2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.08
      }, '-=0.05')

      // Hold second image
      tl.to({}, { duration: 0.05 })

      // Phase 6: Third image slides up with Keeper symbol (70-90%)
      tl.to(image3Ref.current, {
        opacity: 1,
        yPercent: 0,
        duration: 0.15,
        ease: 'power2.out'
      })
      .to(text2Ref.current, {
        opacity: 0,
        duration: 0.05
      }, '-=0.1')
      .to(keeperSymbolRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.1
      }, '-=0.05')

      // Hold final state
      tl.to({}, { duration: 0.1 })

    }, section)

    return () => {
      console.log('[v0] Cleaning up StoryFlipSection')
      ctx.revert()
    }
  }, [isFlipped])

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full bg-[#050508] overflow-hidden"
    >
      {/* The 3D Card that flips */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
        style={{
          width: '300px',
          height: '400px',
          perspective: '2000px',
        }}
      >
        <div
          ref={cardInnerRef}
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* FRONT - Character card */}
          <div
            ref={frontRef}
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=faces"
              alt="Character"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a15]/90 via-transparent to-[#0a0a15]/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20" />
            
            {/* Card label */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <span className="text-[10px] text-[#6b6b7b] tracking-[0.25em] uppercase">Animus Character</span>
            </div>
            
            {/* Card info bottom */}
            <div className="absolute bottom-4 left-4">
              <div className="font-mono text-[10px] text-[#00d4ff] mb-1">ID: ANM-001</div>
              <div className="text-lg font-bold text-[#e8e8ec]">Nexus Walker</div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#00d4ff]/70" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#00d4ff]/70" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#00d4ff]/70" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#00d4ff]/70" />
          </div>

          {/* BACK - Story images */}
          <div
            ref={backRef}
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Image Layer 1 - Sky/Clouds base */}
            <div
              ref={image1Ref}
              className="absolute inset-0"
            >
              <img
                src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop"
                alt="Dramatic sky"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-transparent to-orange-950/60" />
            </div>

            {/* Text 1 - "You are a Keeper" */}
            <div
              ref={text1Ref}
              className="absolute left-6 md:left-12 lg:left-20 top-[20%] z-20 max-w-[60%]"
            >
              <span className="text-[#00d4ff] text-[10px] md:text-xs tracking-[0.3em] mb-3 block font-mono flex items-center">
                <span className="w-2 h-2 bg-[#00d4ff] mr-3" />
                002
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight uppercase">
                You are a Keeper: an agent of power and change in this world.
              </h2>
            </div>

            {/* UI Panel Right */}
            <div
              ref={uiPanelRef}
              className="absolute right-6 md:right-12 top-[20%] z-20 text-right hidden md:block"
            >
              <div className="space-y-3 text-[10px] md:text-xs text-white/70 font-mono">
                <div>
                  <span className="text-[#00d4ff]">// INITIALIZING</span>
                  <br />
                  <span className="text-white/90">KEEPER_STORY</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-6 h-6 border border-[#00d4ff]/50 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                  </div>
                  <span>LOADING... [47%]</span>
                </div>
                <div className="space-y-0.5 text-[#6b6b7b] text-[9px]">
                  <div>LOCATION_DATA</div>
                  <div>CHARACTER_ATTRIBUTES</div>
                  <div>KLINK_TRANSMISSIONS</div>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[9px]">
                  <div>N: 35°27.37</div>
                  <div>E: 139°38.57</div>
                </div>
                <div className="mt-3">
                  <span className="text-white/40">33.8°</span>
                </div>
              </div>
            </div>

            {/* Image Layer 2 - Mountains */}
            <div
              ref={image2Ref}
              className="absolute inset-0 z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop"
                alt="Mountains at sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            </div>

            {/* Text 2 - "What will you do" */}
            <div
              ref={text2Ref}
              className="absolute right-6 md:right-12 lg:right-20 bottom-[15%] z-30 max-w-[70%] text-right"
            >
              <span className="text-[#00d4ff] text-[10px] md:text-xs tracking-[0.3em] mb-3 block font-mono flex items-center justify-end">
                003
                <span className="w-2 h-2 bg-[#00d4ff] ml-3" />
              </span>
              <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight uppercase">
                What will you do with this power? Will you choose to protect or destroy? To give or to take?
              </h2>
            </div>

            {/* Image Layer 3 - Two people silhouette */}
            <div
              ref={image3Ref}
              className="absolute inset-0 z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&h=1080&fit=crop"
                alt="Two figures looking at landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Keeper Symbol - centered cross */}
            <div
              ref={keeperSymbolRef}
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                {/* Vertical bar */}
                <div className="absolute left-1/2 -translate-x-1/2 w-1 md:w-1.5 bg-white h-48 md:h-72 lg:h-96 -top-24 md:-top-36 lg:-top-48" />
                {/* Horizontal bar */}
                <div className="absolute top-1/2 -translate-y-1/2 h-1 md:h-1.5 bg-white w-48 md:w-72 lg:w-96 -left-24 md:-left-36 lg:-left-48" />
                {/* Center square */}
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 border-[3px] md:border-4 border-white bg-black/30 backdrop-blur-sm" />
                {/* Inner cross - horizontal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 md:w-14 lg:w-18 h-0.5 md:h-1 bg-white" />
                </div>
                {/* Inner cross - vertical */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 md:h-14 lg:h-18 w-0.5 md:w-1 bg-white" />
                </div>
              </div>
              
              {/* Label */}
              <div className="absolute left-[calc(50%-180px)] md:left-[calc(50%-220px)] top-1/2 -translate-y-1/2">
                <span className="text-white text-[9px] md:text-[11px] tracking-[0.15em] font-mono flex items-center">
                  <span className="text-[#00d4ff] mr-2 text-base">■</span>
                  <span>
                    KEEPERS<br/>SYMBOL
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side indicator */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1">
        <div className="w-px h-10 md:h-14 bg-white/20" />
        <div className="w-3 h-3 md:w-4 md:h-4 border border-white/50 rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00d4ff]" />
        </div>
        <div className="w-px h-10 md:h-14 bg-white/20" />
      </div>

      {/* Bottom indicator */}
      <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 z-50">
        <span className="text-white/30 font-mono text-xs tracking-widest">····</span>
      </div>
    </section>
  )
}
