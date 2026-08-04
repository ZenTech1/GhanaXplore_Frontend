'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function TopRegions() {
  const desktopRegions = [
    {
      id: 'accra',
      name: 'Greater Accra',
      tagline: 'The Hub of Energy & Modernity',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTEzH5043nPHj_k04NxPDwsjUVqa27ZBELhbRaTVtZ7TNqd4k3LK9zG-RtKw2OCK7mcby7o4OwbYes4f1BxTcgrevoXwrWP4fnzR51GwY3X-TQ2ZkTBjjHHmMjZOWex7p_w-3ZZ7S7lMrIQX0d4qLk7Q2NNIR6j6e_xcFoDJqGjiAnkHNTlTMAaWJwKh6BNReZSqzADcHlSkBtu1gQbBn__7Z-BetQSxRmmwwXALWFzp8wrn-Q7UxQoeYD1XLebuAZ7WcuPV-mAeen',
    },
    {
      id: 'ashanti',
      name: 'Ashanti',
      tagline: 'The Kingdom of Gold & Tradition',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAhWVZrpX_TX_CtkDfwbAS6mp2gZyqvWAkx8RpIgvWNswWm_ShrWrI4eVYMI93WAQnyqfEFJKMEsliiN-UtBvm4srfECQchoh6_Ji6dq5o5mg0U-7xah1dPRb-dcFK4DE3TabUvWYb23_gGlg50KVsvg_q7n6be_u0POMouUi9R5qT0-_2CT4bnS1jTeNrJdSPlHwUqI3gnpqF3zwuBIIZZsNWveUFQ7ci4jf3dSAtQg9Bvsfz0Kmj_CNug1k4xU61dlKkQl0sInDzl',
    },
    {
      id: 'volta',
      name: 'Volta',
      tagline: 'The Land of Peaks & Cascades',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAakLQGpe6ovUPRw9Hdw6E4FzK-p6-gU6VgFeOrualoXcuyZ_mrhLcdoco6ZpvN6giubA1emK5c1Uk6UzJhqU6b9DhnKTGVGvbaPaWFauFH6RwTOA-OR3NFhOpg37G97_FTuT2hea5A4xjPseFdW3kMBtoHfLfHdZfuhRTPF3eNwZeHp5k6F6YRvIJX2gcC_81QP5lz-fWJ5aVPqDDItSWXyuFUKN8eqpXiQHmAJ73pwgAHUvQ1SNyDlvpKtJnW_IFUF4JHXO_QFqqa',
    },
  ];

  const mobileRegions = [
    {
      id: 'volta',
      name: 'Volta',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA_3-J-3NPL97Au5T4mGjwWU5AQjL38V0I8G9iXfxfDaBL8aURwCpgGIaoS2mMJDjpYpr2ZH296n6hLB7nZbHB0_AsiF_Li_yKc-NQymMfKqKk7RABstS8TSGhDSztu09AmeQhBXop5io9ihIevu74q53uOP0gKdY4yXcPTZAYgz35bdofcSUC-9Oo8xRA_pRwvf4jO2yF9d0hULmkI6a2urQT1QuXJ9fmyrmq2WOF3iPghUU4AXJH_Gc4JE1Ov3krrBtaC7ag5bMC6',
    },
    {
      id: 'accra',
      name: 'Greater Accra',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQ2zymT4Dy8-eloasl-57qHrXUIpPDr5tgGP3EGHXShm7XwKYjL_hw8F9t9UycVI670YTphvCuForeaQ542l6xGjyFuPKZrWfWk7O1OBkzNvQwnW4Xt9sLCOHXemD-gUO0M8gDCuyQ8hUa7NVM5U0C8I-JU52XFfYqUW0GK2Kwus3nu6gGclE9RF9xxn2hOALA0Fnc5T_GlCH0LQU027QEU66pic2EnqtUknpTYrzT9UYVvcj8AP9zGNN89VBLGlZ8cQ7Lc85wNIl',
    },
    {
      id: 'ashanti',
      name: 'Ashanti',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEhHUzcQkT0rJOsvlL1O_3dMaPfHZJ9-R68HH4hDrsU9H6_C_UHfGICSSHeXSzoa8MEJTrYeH-bOgCzTJ44uAoPJxr_F8R5gS6Ym8EIeLrty9tlAJJrwpEEosjbyM-fdL2E8kbcXf2L0Y7URTIu4ic5If6MP2bF9lZzCibXVYu4-6N_7nrYEvglhMU0WWcdu1ZX0EUnn06Ef629kFH44G_4_yNO7qG4RAhxQdIT82VqvCYfg7mAE2phGYIPypYO1y36KWy-8WPzInL',
    },
    {
      id: 'savannah',
      name: 'Savannah',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHWYzUzhRSZaFdoooxRvUVq_mlIXWheFB9Y54C2l9MF3a7wyjzfr_mWCWsVFIHAjNcQCKrB_vTtSKBsFf0Yuk7Jx5IErsCoU3rBOomxYMxwB3a2o-cvFPm01GBhlEJglyFFnZ4B8Kx6mhzHgOtDjJYxxQDsfe-N3hCdY0wC1BYBHNmhQuCOUmCVs9pR2-2MlbijM8N-EqhLkK9BLxdiQevx5BM3U_QrYe1bRDQ-Qy813JkpCzhS1-kDllqfmYxwF3Iinz2uVxS97ft',
    },
  ];

  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const [desktopVisible, setDesktopVisible] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = { threshold: 0.15 };

    const makeObserver = (setVisible: (v: boolean) => void) =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      }, observerOptions);

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
        @keyframes regionsFadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes regionsCardIn {
          0% {
            opacity: 0;
            transform: translateY(36px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .regions-anim {
          opacity: 0;
          transform: translateY(24px);
        }
        .regions-anim.is-visible {
          animation: regionsFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .regions-card {
          opacity: 0;
          transform: translateY(36px) scale(0.97);
        }
        .regions-card.is-visible {
          animation: regionsCardIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .regions-card-delay-0.is-visible {
          animation-delay: 0.05s;
        }
        .regions-card-delay-1.is-visible {
          animation-delay: 0.18s;
        }
        .regions-card-delay-2.is-visible {
          animation-delay: 0.31s;
        }
        .regions-card-delay-3.is-visible {
          animation-delay: 0.44s;
        }
        @media (prefers-reduced-motion: reduce) {
          .regions-anim,
          .regions-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* DESKTOP TOP REGIONS SECTION */}
      <section
        ref={desktopSectionRef}
        className="hidden md:block py-section-gap px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto"
      >
        <div
          className={`regions-anim flex flex-col md:flex-row justify-between items-end mb-12 gap-4 ${desktopVisible ? 'is-visible' : ''}`}
        >
          <div>
            <span className="text-primary font-label-lg tracking-widest uppercase mb-2 block">
              Cradle of Culture
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Top Regions</h2>
          </div>
          <Link href="#" className="text-primary font-label-lg flex items-center gap-2 hover:underline">
            View all regions <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {desktopRegions.map((region, i) => (
            <div
              key={region.id}
              className={`regions-card regions-card-delay-${i} group cursor-pointer ${desktopVisible ? 'is-visible' : ''}`}
            >
              <div className="relative h-96 rounded-xl overflow-hidden mb-4 shadow-sm border border-outline-variant/10">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${region.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-headline-md text-xl mb-1">{region.name}</h3>
                  <p className="font-label-sm opacity-80">{region.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE TOP REGIONS SECTION */}
      <section ref={mobileSectionRef} className="md:hidden mt-section-gap px-container-padding-mobile">
        <div className={`regions-anim flex justify-between items-end mb-6 ${mobileVisible ? 'is-visible' : ''}`}>
          <div className="space-y-1">
            <h3 className="font-headline-md text-headline-md text-on-surface">Top Regions</h3>
            <p className="text-on-surface-variant font-label-sm">Explore our 16 vibrant destinations</p>
          </div>
          <Link href="#" className="text-primary font-label-lg flex items-center gap-1">
            See All <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-container-padding-mobile px-container-padding-mobile snap-x snap-mandatory">
          {mobileRegions.map((region, i) => (
            <div
              key={region.id}
              className={`regions-card regions-card-delay-${i} snap-start flex-shrink-0 w-44 group cursor-pointer ${mobileVisible ? 'is-visible' : ''}`}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-3 border border-outline-variant/10 shadow-sm transition-transform group-active:scale-95">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={region.image}
                  alt={region.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-label-lg">{region.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}