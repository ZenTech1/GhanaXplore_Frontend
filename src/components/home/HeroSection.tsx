'use client';

import { useState } from 'react';

export function HeroSection() {
  const [region, setRegion] = useState('');
  const [activity, setActivity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${region || 'All Regions'} ${activity ? '| ' + activity : ''}`);
  };

  return (
    <>
      {/* DESKTOP HERO SECTION */}
      <section className="hidden md:flex relative h-[870px] min-h-[600px] items-center justify-center text-center px-container-padding-mobile overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLtE3ONwfECr133C8IjCM9KDiMB2ONFy8EwdGyYljuto88ksLI9RHaPhoa5qF2vVHMYDt3w9GiEnpSsKZyIOqwYlMIYwUx3lfy2tvKq6NUpdyhnxAu6rtkFJT-ReKtQ6yUkPXIXXIpp_-uPIR5RQA-pSEr5TvpbtnJqCKMjiz8kOyYZGsR_bG14Et3SYyj9TL1TooheO5THOjF6prEcp0jx_TSPPHGz6Zwe_N3Hdqx7bStFO2gIUDEN7VikhXBOKlzqCBW58IyMlp3')`,
            }}
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative z-10 max-w-4xl w-full">
          <h1 className="font-display-lg text-display-lg text-white mb-6 drop-shadow-lg leading-tight">
            Your Master Guide to Explore Ghana
          </h1>
          <p className="text-white/90 font-body-lg text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover the gold coast&apos;s hidden gems, from the vibrant streets of Accra to the ancient shadows of the Ashanti kingdom.
          </p>

          {/* Centered Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="glass-effect p-2 rounded-full input-focus border-outline-variant flex items-center shadow-xl max-w-3xl mx-auto border border-white/20"
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
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined">search</span>
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* MOBILE HERO SECTION */}
      <section className="md:hidden relative h-[751px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDX8PQSlVDrJsScenJ-9MYmeFqr4uLLcI6aBk9Os2Dtkn2-G0ljLfdfVYd7SYSjZV6SeiGlf-nt-Fx2lSyns__CWJLfP9pgG4c_NhUcONTsU9MXWAZNcqaV921pDZvpOKaYl1sj752cMDw-Ht3MUmz-YJRQV_lUWODf4M_RthHAFU9FHfPAk2q2ZOY6-BSgLBBlErcm-Q2gxwGGm5o2rWvro0QNUkMKOVQEf7qvV6CgdAY10uXjSvjgvliOsmKxWrDxiANyyxdfYzOE')`,
          }}
        >
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-container-padding-mobile flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-white font-display-lg-mobile text-display-lg-mobile leading-tight">
              Experience <span className="text-secondary-fixed">Ghana</span> <br />
              Beyond Borders
            </h2>
            <p className="text-white/90 font-body-md max-w-[85%]">
              From the lush Volta highlands to the vibrant pulses of Accra, find your heritage.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative w-full">
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
                className="bg-primary text-on-primary p-3 rounded-lg flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
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

