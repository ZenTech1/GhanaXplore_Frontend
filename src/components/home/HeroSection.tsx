'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroSection() {
  const [region, setRegion] = useState('');
  const [activity, setActivity] = useState('');

  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const [desktopVisible, setDesktopVisible] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.25,
    };

    const makeObserver = (setVisible: (v: boolean) => void) =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      }, observerOptions);

    const desktopObserver = makeObserver(setDesktopVisible);
    const mobileObserver = makeObserver(setMobileVisible);

    if (desktopRef.current) desktopObserver.observe(desktopRef.current);
    if (mobileRef.current) mobileObserver.observe(mobileRef.current);

    return () => {
      desktopObserver.disconnect();
      mobileObserver.disconnect();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${region || 'All Regions'} ${activity ? '| ' + activity : ''}`);
  };

  return (
    <>
      <style jsx>{`
        @keyframes heroKenBurns {
          0% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1.14);
          }
        }
        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(28px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .hero-bg-animate {
          animation: heroKenBurns 24s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .hero-anim {
          opacity: 0;
          transform: translateY(28px);
        }
        .hero-anim.is-visible {
          animation: heroFadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-anim-overlay {
          opacity: 0;
        }
        .hero-anim-overlay.is-visible {
          animation: heroFadeIn 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .delay-0 {
          animation-delay: 0.1s !important;
        }
        .delay-1 {
          animation-delay: 0.32s !important;
        }
        .delay-2 {
          animation-delay: 0.54s !important;
        }
        .hero-search-btn {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease,
            background-color 0.25s ease;
        }
        .hero-search-btn:hover {
          box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.4);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-animate,
          .hero-anim,
          .hero-anim-overlay {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* DESKTOP HERO SECTION */}
      <section
        ref={desktopRef}
        className="hidden md:flex relative h-[870px] min-h-[600px] items-center justify-center text-center px-container-padding-mobile overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="hero-bg-animate w-full h-full bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLtE3ONwfECr133C8IjCM9KDiMB2ONFy8EwdGyYljuto88ksLI9RHaPhoa5qF2vVHMYDt3w9GiEnpSsKZyIOqwYlMIYwUx3lfy2tvKq6NUpdyhnxAu6rtkFJT-ReKtQ6yUkPXIXXIpp_-uPIR5RQA-pSEr5TvpbtnJqCKMjiz8kOyYZGsR_bG14Et3SYyj9TL1TooheO5THOjF6prEcp0jx_TSPPHGz6Zwe_N3Hdqx7bStFO2gIUDEN7VikhXBOKlzqCBW58IyMlp3')`,
            }}
          />
          <div className={`hero-anim-overlay absolute inset-0 hero-gradient ${desktopVisible ? 'is-visible' : ''}`} />
        </div>

        <div className="relative z-10 max-w-4xl w-full">
          <h1
            className={`hero-anim delay-0 font-display-lg text-display-lg text-white mb-6 drop-shadow-lg leading-tight ${desktopVisible ? 'is-visible' : ''}`}
          >
            Your Master Guide to Explore Ghana
          </h1>
          <p
            className={`hero-anim delay-1 text-white/90 font-body-lg text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${desktopVisible ? 'is-visible' : ''}`}
          >
            Discover the gold coast&apos;s hidden gems, from the vibrant streets of Accra to the ancient shadows of the Ashanti kingdom.
          </p>

          {/* Centered Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className={`hero-anim delay-2 glass-effect p-2 rounded-full input-focus border-outline-variant flex items-center shadow-xl max-w-3xl mx-auto border border-white/20 ${desktopVisible ? 'is-visible' : ''}`}
          >
            <div className="flex-1 flex items-center px-6 gap-3 border-r border-outline-variant">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Which region?"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-body-md placeholder:text-outline"
              />
            </div>

            <div className="flex-1 flex items-center px-6 gap-3">
              <span className="material-symbols-outlined text-primary">explore</span>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Activity or Landmark"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-body-md placeholder:text-outline"
              />
            </div>

            <button
              type="submit"
              className="hero-search-btn bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined">search</span>
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* MOBILE HERO SECTION */}
      <section ref={mobileRef} className="md:hidden relative h-[751px] w-full overflow-hidden">
        <div
          className="hero-bg-animate absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDX8PQSlVDrJsScenJ-9MYmeFqr4uLLcI6aBk9Os2Dtkn2-G0ljLfdfVYd7SYSjZV6SeiGlf-nt-Fx2lSyns__CWJLfP9pgG4c_NhUcONTsU9MXWAZNcqaV921pDZvpOKaYl1sj752cMDw-Ht3MUmz-YJRQV_lUWODf4M_RthHAFU9FHfPAk2q2ZOY6-BSgLBBlErcm-Q2gxwGGm5o2rWvro0QNUkMKOVQEf7qvV6CgdAY10uXjSvjgvliOsmKxWrDxiANyyxdfYzOE')`,
          }}
        >
          <div className={`hero-anim-overlay absolute inset-0 hero-gradient ${mobileVisible ? 'is-visible' : ''}`} />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-container-padding-mobile flex flex-col gap-6">
          <div className="space-y-2">
            <h2
              className={`hero-anim delay-0 text-white font-display-lg-mobile text-display-lg-mobile leading-tight ${mobileVisible ? 'is-visible' : ''}`}
            >
              Experience <span className="text-secondary-fixed">Ghana</span> <br />
              Beyond Borders
            </h2>
            <p className={`hero-anim delay-1 text-white/90 font-body-md max-w-[85%] ${mobileVisible ? 'is-visible' : ''}`}>
              From the lush Volta highlands to the vibrant pulses of Accra, find your heritage.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className={`hero-anim delay-2 relative w-full ${mobileVisible ? 'is-visible' : ''}`}>
            <div className="bg-surface-container-lowest input-focus border-outline-variant rounded-xl p-2 shadow-xl flex items-center gap-3 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary ml-2" data-icon="location_on">location_on</span>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Which region?"
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full font-label-lg text-on-surface placeholder:text-on-surface-variant/60"
              />
              <button
                type="submit"
                className="hero-search-btn bg-primary text-on-primary p-3 rounded-lg flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
                aria-label="Search"
              >
                <span className="material-symbols-outlined" data-icon="explore">explore</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}