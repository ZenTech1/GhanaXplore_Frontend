'use client';

export function MustSeeAttractions() {
  return (
    <>
      {/* DESKTOP MUST-SEE ATTRACTIONS SECTION */}
      <section className="hidden md:block bg-surface-container-low py-section-gap px-container-padding-mobile md:px-container-padding-desktop">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Must-See Attractions</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Selected heritage sites and natural wonders that define the soul of Ghana.</p>
          </div>

          <div className="bento-grid">
            {/* Kakum National Park */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_1MffuMUqkEqkEZvUISUOBwm_ylomb9BbGiM4u1O4ehcBksA1wfonv9OXh89FkuEvEqzF_pqAMfFgNoMHsshnTfV-HPSalk11N-lMWnNdB0Vw3eIgZgA5zg0JBqIjO-IZPwSRTY_LbHzmryQUWz_b-wpc4kkiQQED-MuHb_lJ6-Lqjk4Btw8jbletzf4T-NmNuEYz-5oeUQR9J17BuHI_IjK2yp71usfxAY6T1inWMkoiDUpeA4yNPjjnDncA5y_KVEaiArNk6BZb')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold mb-3">
                  ADVENTURE
                </span>
                <h3 className="font-headline-md text-3xl text-white">Kakum Canopy Walk</h3>
                <p className="text-white/80 max-w-md mt-2">
                  Walk above the trees and witness the biodiversity of one of West Africa&apos;s last remaining rainforests.
                </p>
              </div>
            </div>

            {/* Cape Coast Castle */}
            <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAl_7iL_2M3m-DbM-CTIwLIQWMc5IzEz-o9VQD2724hsL3QfOpyOrFoJ-QS_tVqmLx4B3x5t2XL584bgAyjFz6zGBZbsAWJMhlRc-KPgudhEHnLTh7kRKNSHQO2S6ePgEzuGtnm0N6vR109XCXrSQ9uCJ3qHlC3DnKRU-dqPenuqn_9eJAsmd2nin9sFFswQ5QlRdMH0RIHT1kRi9751yHuA1yEGETpKrVosMpyBdzUOH9uDW_OYa1wNEA6dOtPzp21rHpjC-snv7s')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-bold mb-2">
                  HISTORY
                </span>
                <h3 className="font-headline-md text-xl text-white">Cape Coast Castle</h3>
              </div>
            </div>

            {/* Mole National Park */}
            <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group shadow-lg border border-outline-variant/20 cursor-pointer">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDyDRh6mvMUN-lgFOJb07U4DpkLIzdlM9Ju7sbjn5gXT7USYho7m8GBps4KVAzAjq_oo-D3O5Q-CIMFrsjjX_TfguiPWq4XnAU6x0SwE2nGaYcyPjJEldprBggsyugDAejKgwGjRBmOyCAsouV_0gnhkLJ078mLy87k9o9OYQWNYuW1RmKh99V_rL1eiLIOY6z6ZPN1F1Pv0ADV3nC1PS5OghKAMXrZGVN7sc6qktS9Xv_uCOvm-xdgEHCs8gkqVJc0WRt7Lr5tGs8e')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm font-bold mb-2">
                  WILDLIFE
                </span>
                <h3 className="font-headline-md text-xl text-white">Mole Safari Experience</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE MUST-SEE ATTRACTIONS SECTION */}
      <section className="md:hidden mt-section-gap px-container-padding-mobile">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Must-See Attractions</h3>
        
        <div className="flex flex-col gap-8">
          {/* Attraction 1: Kakum */}
          <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/20 group cursor-pointer active:scale-[0.98] transition-all">
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
          </div>

          {/* Attraction 2: Makola Market */}
          <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/20 group cursor-pointer active:scale-[0.98] transition-all">
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
          </div>
        </div>

        {/* Mobile Bento Teaser Tiles */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="col-span-1 bg-tertiary text-on-tertiary-container p-6 rounded-3xl flex flex-col justify-between h-48 shadow-lg shadow-tertiary/20 cursor-pointer active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[32px]" data-icon="restaurant">restaurant</span>
            <h5 className="font-headline-md leading-tight">Taste the Heritage</h5>
          </div>
          <div className="col-span-1 bg-secondary-fixed text-on-secondary-fixed p-6 rounded-3xl flex flex-col justify-between h-48 shadow-lg shadow-secondary/20 cursor-pointer active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[32px]" data-icon="event">event</span>
            <h5 className="font-headline-md leading-tight">Festivals &amp; Events</h5>
          </div>
        </div>
      </section>
    </>
  );
}

