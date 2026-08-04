'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MustSeeAttractions() {
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const [desktopVisible, setDesktopVisible] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const makeObserver = (setVisible: (v: boolean) => void) =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Toggle both ways so the animation replays every time the
            // section scrolls into view, whether scrolling down or back up.
            // This also fires immediately on mount if the section is
            // already in the viewport on page load/refresh.
            setVisible(entry.isIntersecting);
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

    const desktopObserver = makeObserver(setDesktopVisible);
    const mobileObserver = makeObserver(setMobileVisible);

    if (desktopSectionRef.current) desktopObserver.observe(desktopSectionRef.current);
    if (mobileSectionRef.current) mobileObserver.observe(mobileSectionRef.current);

    return () => {
      desktopObserver.disconnect();
      mobileObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes attractionsFadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes attractionsInLeft {
          0% {
            opacity: 0;
            transform: translateX(-160px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes attractionsInRight {
          0% {
            opacity: 0;
            transform: translateX(160px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes attractionsInTop {
          0% {
            opacity: 0;
            transform: translateY(-120px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes attractionsInBottomLeft {
          0% {
            opacity: 0;
            transform: translate(-90px, 90px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        @keyframes attractionsInBottomRight {
          0% {
            opacity: 0;
            transform: translate(90px, 90px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }

        .attr-anim {
          opacity: 0;
          transform: translateY(24px);
        }
        .attr-anim.is-visible {
          animation: attractionsFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Each attr-tile-* class lives on its own dedicated wrapper. It
           never shares an element with anything that also animates
           transform (hover lifts, active states, etc), so the entrance
           animation's fill-mode: forwards can never block a later
           hover/press transition on that same element. */
        .attr-tile-left,
        .attr-tile-right,
        .attr-tile-top,
        .attr-tile-bottom-left,
        .attr-tile-bottom-right {
          opacity: 0;
        }
        .attr-tile-left {
          transform: translateX(-160px) scale(0.94);
        }
        .attr-tile-right {
          transform: translateX(160px) scale(0.94);
        }
        .attr-tile-top {
          transform: translateY(-120px) scale(0.94);
        }
        .attr-tile-bottom-left {
          transform: translate(-90px, 90px) scale(0.94);
        }
        .attr-tile-bottom-right {
          transform: translate(90px, 90px) scale(0.94);
        }
        .attr-tile-left.is-visible {
          animation: attractionsInLeft 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .attr-tile-right.is-visible {
          animation: attractionsInRight 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .attr-tile-top.is-visible {
          animation: attractionsInTop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .attr-tile-bottom-left.is-visible {
          animation: attractionsInBottomLeft 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .attr-tile-bottom-right.is-visible {
          animation: attractionsInBottomRight 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .attr-card-shell {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
        }
        .group:hover .attr-card-shell {
          transform: translateY(-6px);
          box-shadow: 0 24px 44px -18px rgba(0, 0, 0, 0.4);
        }
        .attr-badge {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .attr-badge {
          transform: scale(1.06);
        }
        .attr-mobile-card {
          transition: transform 0.2s ease, box-shadow 0.35s ease;
        }
        .attr-mobile-card:active {
          transform: scale(0.98);
          box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.3);
        }
        .attr-teaser-tile {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
        }
        .attr-teaser-tile:hover {
          transform: translateY(-4px);
        }
        .attr-teaser-tile:active {
          transform: scale(0.95);
        }
        .attr-teaser-icon {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .attr-teaser-tile:hover .attr-teaser-icon {
          transform: scale(1.1) rotate(-4deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .attr-anim,
          .attr-tile-left,
          .attr-tile-right,
          .attr-tile-top,
          .attr-tile-bottom-left,
          .attr-tile-bottom-right {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .attr-card-shell,
          .attr-badge,
          .attr-mobile-card,
          .attr-teaser-tile,
          .attr-teaser-icon {
            transition: none !important;
          }
        }
      `}</style>

      {/* DESKTOP MUST-SEE ATTRACTIONS SECTION */}
      <section
        ref={desktopSectionRef}
        className="hidden md:block bg-surface-container-low py-section-gap px-container-padding-mobile md:px-container-padding-desktop"
        id="desktop-attractions"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`attr-anim text-center mb-16 ${desktopVisible ? 'is-visible' : ''}`}>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Must-See Attractions</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Selected heritage sites and natural wonders that define the soul of Ghana.</p>
          </div>

          <div className="bento-grid">
            {/* Kakum National Park */}
            <Link
              href="/attractions/kakum-national-park"
              className={`attr-tile-left col-span-2 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer block ${desktopVisible ? 'is-visible' : ''}`}
              style={{ animationDelay: desktopVisible ? '0.1s' : undefined }}
            >
              <div className="attr-card-shell w-full h-full">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_1MffuMUqkEqkEZvUISUOBwm_ylomb9BbGiM4u1O4ehcBksA1wfonv9OXh89FkuEvEqzF_pqAMfFgNoMHsshnTfV-HPSalk11N-lMWnNdB0Vw3eIgZgA5zg0JBqIjO-IZPwSRTY_LbHzmryQUWz_b-wpc4kkiQQED-MuHb_lJ6-Lqjk4Btw8jbletzf4T-NmNuEYz-5oeUQR9J17BuHI_IjK2yp71usfxAY6T1inWMkoiDUpeA4yNPjjnDncA5y_KVEaiArNk6BZb')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="attr-badge inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold mb-3">
                    ADVENTURE
                  </span>
                  <h3 className="font-headline-md text-3xl text-white">Kakum Canopy Walk</h3>
                  <p className="text-white/80 max-w-md mt-2">
                    Walk above the trees and witness the biodiversity of one of West Africa&apos;s last remaining rainforests.
                  </p>
                </div>
              </div>
            </Link>

            {/* Cape Coast Castle */}
            <Link
              href="/attractions/cape-coast-castle"
              className={`attr-tile-top col-span-2 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer block ${desktopVisible ? 'is-visible' : ''}`}
              style={{ animationDelay: desktopVisible ? '0.28s' : undefined }}
            >
              <div className="attr-card-shell w-full h-full">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAl_7iL_2M3m-DbM-CTIwLIQWMc5IzEz-o9VQD2724hsL3QfOpyOrFoJ-QS_tVqmLx4B3x5t2XL584bgAyjFz6zGBZbsAWJMhlRc-KPgudhEHnLTh7kRKNSHQO2S6ePgEzuGtnm0N6vR109XCXrSQ9uCJ3qHlC3DnKRU-dqPenuqn_9eJAsmd2nin9sFFswQ5QlRdMH0RIHT1kRi9751yHuA1yEGETpKrVosMpyBdzUOH9uDW_OYa1wNEA6dOtPzp21rHpjC-snv7s')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="attr-badge inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-bold mb-2">
                    HISTORY
                  </span>
                  <h3 className="font-headline-md text-xl text-white">Cape Coast Castle</h3>
                </div>
              </div>
            </Link>

            {/* Mole National Park */}
            <Link
              href="/attractions/mole-national-park"
              className={`attr-tile-right col-span-2 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer block ${desktopVisible ? 'is-visible' : ''}`}
              style={{ animationDelay: desktopVisible ? '0.46s' : undefined }}
            >
              <div className="attr-card-shell w-full h-full">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDyDRh6mvMUN-lgFOJb07U4DpkLIzdlM9Ju7sbjn5gXT7USYho7m8GBps4KVAzAjq_oo-D3O5Q-CIMFrsjjX_TfguiPWq4XnAU6x0SwE2nGaYcyPjJEldprBggsyugDAejKgwGjRBmOyCAsouV_0gnhkLJ078mLy87k9o9OYQWNYuW1RmKh99V_rL1eiLIOY6z6ZPN1F1Pv0ADV3nC1PS5OghKAMXrZGVN7sc6qktS9Xv_uCOvm-xdgEHCs8gkqVJc0WRt7Lr5tGs8e')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="attr-badge inline-block px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm font-bold mb-2">
                    WILDLIFE
                  </span>
                  <h3 className="font-headline-md text-xl text-white">Mole Safari Experience</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE MUST-SEE ATTRACTIONS SECTION */}
      <section ref={mobileSectionRef} className="md:hidden mt-section-gap px-container-padding-mobile" id="mobile-attractions">
        <h3 className={`attr-anim font-headline-md text-headline-md text-on-surface mb-6 ${mobileVisible ? 'is-visible' : ''}`}>
          Must-See Attractions
        </h3>

        <div className="flex flex-col gap-8">
          {/* Attraction 1: Kakum */}
          <div
            className={`attr-tile-left ${mobileVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: mobileVisible ? '0.08s' : undefined }}
          >
            <Link
              href="/attractions/kakum-national-park"
              className="attr-mobile-card bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/20 group cursor-pointer block"
            >
              <div className="aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfF-vH1tSys3owFF3a-mhp_kSdmbzUe2jWZ1t09l590YIB3EXYD7154WY87eb2VkgUxMe1-MRjB8E5sQOcfjXNqbNQFA9Ju73pofXNF8-vIrH-GYRl8HMgY4uh760ioJbe2JVwzPsus3DUiA2yHd_1CDAuKRriNM1xuzn4o3q6LJs_e396yzIEv2Z3OKP-xQc1COROj98uTDeAXbYV4BZZXCXueI-cAfqXMc-DsomW2-Tn9Wx1-GlPQU4i3_0JCR5wtqUxU9ElVqGn"
                  alt="Kakum Canopy Walk"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-on-surface font-label-sm">4.9</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary text-on-primary font-label-sm px-3 py-1 rounded-full uppercase tracking-wider">Nature</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline-md text-on-surface">Kakum Canopy Walk</h4>
                  <p className="text-primary font-bold">₵45.00</p>
                </div>
                <p className="text-on-surface-variant font-body-md line-clamp-2">
                  Experience the thrill of walking above the rainforest canopy at one of Ghana&apos;s most famous national parks.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]" data-icon="schedule">schedule</span>
                    <span className="font-label-sm">2-3 Hours</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]" data-icon="group">group</span>
                    <span className="font-label-sm">All Ages</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Attraction 2: Makola Market */}
          <div
            className={`attr-tile-right ${mobileVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: mobileVisible ? '0.3s' : undefined }}
          >
            <Link
              href="/attractions/makola-market"
              className="attr-mobile-card bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/20 group cursor-pointer block"
            >
              <div className="aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiB4aCTpXhhQv7-UKa_xEmGMMapmX4OSiKgPmsuhtrjGIbTu9GlNmItLI6p3JdWwGQkPOfzVSVu3-ZNvvNRcaHfzRKvqMPpi0TgdfJ4_mpFs5QoaUnfbnUwN5-ESi3d3FqpxE8cl2vJS9_5w_joR9H5KyHEMJnxYCaGfHM4bnwoURT-BHz_x3kTO0c3EXU7VtqvP9T3qp3Sqkj8dFSvpR1GRNrNosQeHo3Lipz1UuxnpArV1t2dlAc7mmo7hJf8nO4pYkUvbBYmm7D"
                  alt="Makola Market Tour"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-on-surface font-label-sm">4.7</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-secondary text-white font-label-sm px-3 py-1 rounded-full uppercase tracking-wider">Culture</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline-md text-on-surface">Makola Market Tour</h4>
                  <p className="text-primary font-bold">Free Entry</p>
                </div>
                <p className="text-on-surface-variant font-body-md line-clamp-2">
                  Immerse yourself in the heartbeat of Accra. A sensory overload of colors, sounds, and authentic Ghanaian spirit.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]" data-icon="schedule">schedule</span>
                    <span className="font-label-sm">Flexible</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]" data-icon="local_activity">local_activity</span>
                    <span className="font-label-sm">Shopping</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Bento Teaser Tiles */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div
            className={`attr-tile-bottom-left col-span-1 ${mobileVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: mobileVisible ? '0.32s' : undefined }}
          >
            <Link
              href="/attractions"
              className="attr-teaser-tile bg-tertiary text-on-tertiary-container p-6 rounded-3xl flex flex-col justify-between h-48 shadow-lg shadow-tertiary/20 cursor-pointer"
            >
              <span className="attr-teaser-icon material-symbols-outlined text-[32px]" data-icon="restaurant">restaurant</span>
              <h5 className="font-headline-md leading-tight">Taste the Heritage</h5>
            </Link>
          </div>
          <div
            className={`attr-tile-bottom-right col-span-1 ${mobileVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: mobileVisible ? '0.42s' : undefined }}
          >
            <Link
              href="/attractions"
              className="attr-teaser-tile bg-secondary-fixed text-on-secondary-fixed p-6 rounded-3xl flex flex-col justify-between h-48 shadow-lg shadow-secondary/20 cursor-pointer"
            >
              <span className="attr-teaser-icon material-symbols-outlined text-[32px]" data-icon="event">event</span>
              <h5 className="font-headline-md leading-tight">Festivals &amp; Events</h5>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}