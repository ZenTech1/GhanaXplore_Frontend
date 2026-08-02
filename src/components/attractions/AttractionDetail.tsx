'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AttractionDetailProps {
  id?: string;
}

export function AttractionDetail({ id = 'kakum-national-park' }: AttractionDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadOffline = () => {
    setDownloadingOffline(true);
    setTimeout(() => {
      setDownloadingOffline(false);
      setDownloaded(true);
    }, 1500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Kakum National Park — GhanaXplore',
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-background font-body-md text-on-background selection:bg-secondary-container/30 pb-24 md:pb-0">
      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-surface/90 backdrop-blur-md px-container-padding-mobile py-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between border-t border-outline-variant/20 md:hidden">
        <div>
          <p className="font-label-sm text-on-surface-variant">Starting from</p>
          <p className="font-headline-md text-primary">GH₵ 60.00</p>
        </div>
        <button className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container px-8 py-3 rounded-xl font-label-lg font-bold shadow-sm transition-transform active:scale-95">
          Book Now
        </button>
      </div>

      {/* Desktop & Mobile Hero Section */}
      <section className="relative w-full h-[574px] md:h-[716px] min-h-[480px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHCkS-Pw7QHhrP5YBKBQGLUc7TULvmUs1SVn-FRj5cs169Ow44GHNpIHSc2JklUPv_xgfnBc4fLjQFpJkIA0R0i_OoDZWpKIbVgP5vRYHnhXjGjqDR8QY6-ysNztk2yRjg4AG3uGDW5YXV0esFmxo87xhbjVnibRsrDksjYOSFoXRv-g47xuzgwb-kRQenwxuHB8yo4QcVnv-twYzu7f-MfIMeGmff-TKWnnhJAY2TqmOghfTd57piPi7M8SE5GguQbO-MOLM6bms4')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Mobile Top Overlay Controls */}
        <div className="md:hidden absolute top-0 left-0 right-0 px-container-padding-mobile py-6 flex justify-between items-center z-20">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 active:scale-90 transition-all"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 active:scale-90 transition-all ${
                isFavorite ? 'text-error' : 'text-white'
              }`}
              aria-label="Save to favorite"
            >
              <span className="material-symbols-outlined" style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                favorite
              </span>
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 active:scale-90 transition-all"
              aria-label="Share"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* Desktop & Mobile Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop pb-8 md:pb-12">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-label-lg text-label-lg flex items-center gap-1 shadow-md">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
                Must Visit
              </span>
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm md:hidden flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                4.8 (1.2k Reviews)
              </span>
              <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold md:hidden">
                Top Rated
              </span>
              <span className="hidden md:flex text-white/80 font-label-lg text-label-lg uppercase tracking-widest items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Central Region
              </span>
            </div>

            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
              Kakum National Park
            </h1>
            <p className="text-white/90 font-body-lg text-body-lg max-w-xl hidden md:block">
              Walk among the giants on Africa's most iconic canopy walkway, suspended 40 meters above the forest floor.
            </p>
            <p className="font-body-md text-white/90 flex items-center gap-1 mt-1 md:hidden">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              Central Region, Ghana
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12">
        {/* Mobile Quick Stats Bento Row & Features Bar */}
        <div className="md:hidden space-y-6 -mt-8 relative z-10 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="font-label-lg text-on-surface">Readiness</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">94</span>
                <span className="text-on-surface-variant font-label-sm">/100</span>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-1">Ready for visitors today</p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden bg-primary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfrmUxozhCfkDvByI9bIBYsl8Dyj6E110SARSC2I1A69JurIL89x8GX3oQd1bphWKFEWKBuPuBRUjCaTr-D2FjKEdHzTXakvST-2meyYI4fTi7Tyt7Dd1LuP_-ulXmsPhEBOHZPTYGP225p-CHWQcMav_pTXDYRDvQctZJysLGPYJqeBkpSHEssK3_YwAs83NxJSxeb2PNlp7haeAthQSeQfcN9nWupMeO7leeP0m6FDD_BVY7z36WzcH0uu34NATGMPk8x2Nd7vwT"
                    alt="Tour guide avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden bg-secondary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxBlF6ZVtb-mKB1IfrGGTLuJcN5NRZASkydMHaF8HYHcp10R2_ram0m6URTxUsucPfu8gRs3HOxxAY7wADIziN3KQOORag7ypZO3tcLP7C5fDGhkr-3fkvP5TnSuivo5S47Hn1GrTGLHSNP68a355Xl728i_bPhbKs8kZ84rFVx9GvDvFjDYZFv3kbUtLQTp2dGXCTmE72kyUqbcPHCPcu-Vfyw6e4qcdozyZS5RNAszWNQKCoC7sP5uPwOxtnuOPsaxHDPrfD0Y9P"
                    alt="Traveler avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold">
                  +8
                </div>
              </div>
              <p className="text-label-sm text-on-surface-variant">Active tours right now</p>
            </div>
          </div>

          {/* Features Bar Horizontal */}
          <div className="flex justify-between items-center py-4 px-2 bg-surface border-y border-outline-variant/20 overflow-x-auto hide-scrollbar gap-6">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">download_for_offline</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Offline Guide</span>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">account_balance_wallet</span>
              <span className="text-[10px] font-bold text-on-surface-variant">MoMo Supported</span>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">wifi_off</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Low Signal Area</span>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">stroller</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Family Friendly</span>
            </div>
          </div>
        </div>

        {/* Desktop & Mobile Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-8 md:gap-section-gap">
            {/* Essential Stats (Desktop) */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <span className="text-outline font-label-lg text-label-lg uppercase">Entry Fee</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md text-primary">GHS 60</span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm">/ adult</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-outline font-label-lg text-label-lg uppercase">Readiness Score</span>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md text-primary">94%</span>
                  <span className="text-primary font-label-sm text-label-sm">Excellent</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <span className="text-outline font-label-lg text-label-lg uppercase">Categories</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-label-sm font-label-sm">
                    Wildlife
                  </span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-label-sm font-label-sm">
                    Adventure
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section (Desktop) */}
            <div className="hidden md:flex flex-col gap-6">
              <h2 className="font-headline-lg text-headline-lg text-primary">A Journey Above the Canopy</h2>
              <div className="space-y-4 text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
                <p>
                  Established in 1932, Kakum National Park is home to one of only three canopy walkways in Africa. This pristine
                  rainforest spans 375 square kilometers and serves as a sanctuary for endangered species including forest elephants and
                  Diana monkeys.
                </p>
                <p>
                  The highlight of the park is the suspension bridge, consisting of seven bridges and spanning 330 meters. It offers a
                  unique vantage point to witness the diverse birdlife and lush vegetation of the Guinea-Congolian forest ecosystem.
                  Whether you're an avid hiker or a culture enthusiast, the park offers a transformative experience connecting you to
                  Ghana's natural heritage.
                </p>
              </div>
            </div>

            {/* Bento Grid: Tips & Etiquette (Desktop) */}
            <div className="hidden md:grid bento-grid">
              <div className="col-span-12 md:col-span-7 bg-primary-container text-on-primary-container p-8 rounded-[32px] flex flex-col justify-between min-h-[300px]">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-4">Local Guide: Pro Tips</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="material-symbols-outlined text-secondary-fixed-dim">restaurant</span>
                      <p className="font-body-md text-body-md">
                        <span className="font-bold">Eat:</span> Try the authentic{' '}
                        <span className="underline decoration-secondary-fixed-dim">Fante Kenkey</span> at the nearby roadside stalls for
                        a true Central Region taste.
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <span className="material-symbols-outlined text-secondary-fixed-dim">eco</span>
                      <p className="font-body-md text-body-md">
                        <span className="font-bold">Wear:</span> Comfortable hiking boots and lightweight, breathable cotton clothing to
                        manage the humidity.
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 flex items-center gap-2 font-label-lg text-label-lg opacity-80">
                  <span className="material-symbols-outlined">info</span>
                  Verified by Ghana Tourism Authority
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 bg-secondary-container p-8 rounded-[32px] flex flex-col gap-6">
                <h3 className="font-headline-md text-headline-md text-on-secondary-container">Etiquette</h3>
                <p className="text-on-secondary-container/90 font-body-md text-body-md italic">
                  &quot;Respect the Silence of the Trees.&quot;
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-on-secondary-container font-label-lg">
                    <span className="material-symbols-outlined">do_not_disturb_on</span>
                    No littering (Fine enforced)
                  </div>
                  <div className="flex items-center gap-3 text-on-secondary-container font-label-lg">
                    <span className="material-symbols-outlined">camera_enhance</span>
                    Commercial filming needs permit
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Expandable Accordions */}
            <div className="md:hidden space-y-4 mb-6">
              {/* Description Accordion */}
              <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden" open>
                <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                  <h3 className="font-headline-md text-on-surface">Description</h3>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-5 pb-5 text-on-surface-variant leading-relaxed">
                  Kakum National Park is a pristine rainforest reserve located in the Central Region of Ghana. It is most famous for its
                  world-renowned Canopy Walkway, which consists of seven bridges hanging 40 meters above the forest floor. Beyond the
                  walkway, visitors can enjoy guided nature walks to discover rare flora and fauna, including forest elephants and over
                  300 bird species.
                </div>
              </details>

              {/* Local Food Guide Accordion */}
              <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                  <h3 className="font-headline-md text-on-surface">Local Food Guide</h3>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-5 pb-5">
                  <div className="flex gap-4 p-3 bg-surface-container-low rounded-xl mb-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzqfoUKB-JluYhQRkpZF78-0zcXj7KCpby5g10mX5au4llfw_IL2GNeZmz4C-7mvScYGHObIaY0xMbB8CiieG_ruA8m37MtvE8TjdJnnm1-O0lIFz_oJWurAX3vgwmfCC5lUmchKQVMj-IZtn5SjjQ8efR5Yz7fMEZIJyua5qLCQJt5j9K5Bx4O-_r7DlIV7KmCI4WBxxjbhp_PsFvsz-0r9SsOf5xhA87rSZ5aiav1u7waJAtbwwxppGOe1uq3N4Zkl2GVwBKwtX3"
                        alt="Ghanaian Fufu and Light Soup"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Fufu &amp; Light Soup</p>
                      <p className="text-sm text-on-surface-variant">
                        Found at the park&apos;s local chop bars. A must-try Central Region specialty.
                      </p>
                    </div>
                  </div>
                </div>
              </details>

              {/* Culture Tips Accordion */}
              <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                  <h3 className="font-headline-md text-on-surface">Culture Tips</h3>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-5 pb-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary">info</span>
                    <p className="text-on-surface-variant">Always greet the guides with &apos;Akwaaba&apos; (Welcome) or &apos;Etisen&apos; (How are you?).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary">front_hand</span>
                    <p className="text-on-surface-variant">Use your right hand for giving or receiving items; it&apos;s a sign of respect.</p>
                  </div>
                </div>
              </details>
            </div>

            {/* Mobile Location Map Section */}
            <section className="md:hidden mb-6">
              <h3 className="font-headline-md text-on-surface mb-4">Location</h3>
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-outline-variant/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_kYgOxjBRRS7_9hVx2rDw3GOsnkivamavlCild-Y4_5mOnJnJJ38yDnwgNLNy-0iFtW5ZPh1zPw_PnskBp52phDMTeie0A1182NL8Ry1uh1PrFVoeNslxtrZ5lXIOqn_qdzU_MpdNwOY6beu6zE__a7bFHMg576Z_o3trfRg6bqAg_nD1_AeE8GJWzsmbvOp9YyqWvBRqEDvfwnIVy0YbEuOC73wsdPU0T3nxoRkylP14EirHJE2YU04KVL0YiOKsGN0iK82BMYBn"
                  alt="Location map of Kakum National Park"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    onClick={handleShare}
                    className="bg-primary text-white px-6 py-2 rounded-full font-label-lg flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                    Navigate
                  </button>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-end">
                <h2 className="font-headline-lg text-headline-lg text-primary">Traveler Voices</h2>
                <button className="text-primary font-label-lg text-label-lg hover:underline flex items-center gap-2">
                  View all 1,240 reviews
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              {/* Reviews Grid (Desktop) */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Review 1 */}
                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-on-surface-variant">
                        AM
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg">Adwoa Mansah</p>
                        <p className="text-outline font-label-sm text-label-sm">Verified Local Traveler</p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body-md line-clamp-3">
                    &quot;The canopy walk is breathtaking. I&apos;ve been three times and every time I see something new. Highly recommend
                    arriving at 8:00 AM before the crowds.&quot;
                  </p>
                </div>

                {/* Review 2 */}
                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-on-surface-variant">
                        JS
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg">John Smith</p>
                        <p className="text-outline font-label-sm text-label-sm">Verified International Traveler</p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body-md line-clamp-3">
                    &quot;An incredible experience. The guides are very knowledgeable about the plant species. The path is well-maintained
                    and felt very safe.&quot;
                  </p>
                </div>
              </div>

              {/* Reviews Slider (Mobile) */}
              <div className="md:hidden flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-container-padding-mobile px-container-padding-mobile">
                <div className="min-w-[280px] bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">
                      KO
                    </div>
                    <div>
                      <p className="font-bold text-sm">Kofi Osei</p>
                      <div className="flex text-secondary-container scale-75 origin-left">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm italic">
                    &quot;The canopy walk is exhilarating! The guides were very knowledgeable about the birds. Don&apos;t forget your bug spray!&quot;
                  </p>
                </div>

                <div className="min-w-[280px] bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-secondary">
                      AM
                    </div>
                    <div>
                      <p className="font-bold text-sm">Alice Meyer</p>
                      <div className="flex text-secondary-container scale-75 origin-left">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                        <span className="material-symbols-outlined">star</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm italic">
                    &quot;Truly a majestic forest experience. It was busy on Saturday, so try to visit on a weekday morning for peace.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Desktop Sidebar Sticky */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-8">
              {/* Booking Card */}
              <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/50 shadow-xl flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-on-surface">Book Experience</span>
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-label-lg">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    Instant
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]">
                    <span className="material-symbols-outlined">event_available</span>
                    Book Now
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-full border-2 border-primary py-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all ${
                      isFavorite ? 'bg-primary/10 text-primary font-bold' : 'text-primary hover:bg-primary/5'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      favorite
                    </span>
                    {isFavorite ? 'Saved to Wishlist' : 'Save to Wishlist'}
                  </button>
                </div>
                <hr className="border-outline-variant/30" />
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary-container/10 border border-secondary-container/20">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      cloud_download
                    </span>
                    <div>
                      <h4 className="font-label-lg text-label-lg text-on-surface">Offline Expert Guide</h4>
                      <p className="text-label-sm text-on-surface-variant">Includes maps &amp; audio tours for no-signal zones.</p>
                      <button
                        onClick={handleDownloadOffline}
                        disabled={downloadingOffline || downloaded}
                        className="mt-3 text-secondary font-bold text-label-sm flex items-center gap-1 hover:underline disabled:opacity-60"
                      >
                        {downloadingOffline ? 'Downloading...' : downloaded ? 'Downloaded (Offline Ready)' : 'Download Now (12MB)'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 flex flex-col gap-6">
                <div className="h-48 rounded-2xl overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu"
                    alt="Kakum location map thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-label-sm font-label-sm text-outline">Estimated Travel</span>
                      <span className="text-label-lg font-label-lg text-primary">3h 20m from Accra</span>
                    </div>
                    <button
                      onClick={handleShare}
                      className="bg-primary p-2 rounded-lg text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined">directions_car</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-lg">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Abrafo-Odumase, Cape Coast Road
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-lg">
                    <span className="material-symbols-outlined text-primary">call</span>
                    +233 24 000 0000
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="w-full bg-surface-container-highest text-on-surface py-3 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                  Share with Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Nearby Recommendations Section */}
      <section className="bg-surface-container-low py-section-gap">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="font-headline-lg text-headline-lg text-primary">Continue Your Journey</h2>
              <div className="h-[1px] flex-grow bg-outline-variant/50" />
              <span className="font-label-lg text-label-lg text-outline">Powered by ReloM8</span>
            </div>

            {/* Desktop Nearby Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Rec 1 */}
              <Link href="/attractions/cape-coast-castle" className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-4 relative">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCkTPe2G4Yet-y38kvm79y38ycwePm7Ccx6ZQ4Q_d1vfmNIhkR33S7dg_dtQuZ87lF8xFYPKByvmLoEVEp85KGCG6FljgBKxNdA0vg9eEeayASuZflo7H4_jO7newRtC8WTXhnjZbYiCHn1Hn2HhyIhBTShfqoNuiMWtJ-bxNmSOjOnZFR_pZT6SPnFRxiK54SuOxMLrAYQ1peuvkpYKj9KEOkHbsNziX7apaUJvp2P3G_S-3EtetvdvTDphLZqH0yMOAaH1L-pe9G')",
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm text-primary">
                    30km away
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                  Cape Coast Castle
                </h3>
                <p className="text-on-surface-variant font-label-lg text-label-lg mt-1 italic">Historical &amp; Cultural Site</p>
              </Link>

              {/* Rec 2 */}
              <Link href="/attractions/hans-cottage-botel" className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-4 relative">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbdw3p_Df78ILzDqIxkFGgT8JkUF5GKVIE50rdbqdCw_DvwqB5EdCRL30u9PMLv78m_cRPUvpHmrQAnED-fyIT30Xtc9L2df-C8WUEDA1EeH6gpzqv4IxlHAa9Ozrs_fIFdF9uxioFwKUg-_Sv2UNwJ9V8ahtVqNwS4BvkubQB0ki7zI1Olxi_5XHlXwJ_DU8NH9BfyXfHgXPt21wBei3CQbSAYWp04rrbQ40oCZCUeiPqGcjG3RRGuvP3kG4uz3HGUpzZ4j-SHE_x')",
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm text-primary">
                    12km away
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                  Hans Cottage Botel
                </h3>
                <p className="text-on-surface-variant font-label-lg text-label-lg mt-1 italic">Eco-Accommodation</p>
              </Link>

              {/* Rec 3 */}
              <Link href="/attractions/abrafo-craft-market" className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-4 relative">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPI7TEC8tDy6xs5zRtyWikmGebdZretMkz6u7CWpaqp9q-77MMPU2y57gOohsvaxlFbYx7lIORWAEl5fKnWsZEpMd4VtSxoStikw6j4BBQoDPgMUruEvh6GiNtQQ-x40VU5BDyDbvnkr0ocfAbn9hcXrVcJ7WskbKd6ecyiiEQlisy9PmIi6HCjngxyzjiZ83rzRVEewCQUeqaJrGjTcL8FZe-VRR9ZfESqiYVmVakh_wZpOjsQ390EMnU9Itbtc9yeKNlysDvH3br')",
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm text-primary">
                    5km away
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                  Abrafo Village Craft Market
                </h3>
                <p className="text-on-surface-variant font-label-lg text-label-lg mt-1 italic">Local Arts &amp; Crafts</p>
              </Link>
            </div>

            {/* Mobile Nearby Slider */}
            <div className="md:hidden flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-container-padding-mobile px-container-padding-mobile">
              <Link href="/attractions/elmina-castle" className="min-w-[180px] group cursor-pointer">
                <div className="h-32 rounded-2xl bg-gray-200 overflow-hidden mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXy9s6vgst3tirARkm6_rNvLtJ6wLyyPjSgroev0yRYBSMIcPwVf23Os_9prhPY_bmyYO-uRqap3uaTwSjnwqRAbTSONPPngEbjRvLx5TYUlTEtBkdde87a03VIhhLA3q32ukUakLevbWnz5aU6WmTGdkdoqcZbN4OGF1uXA3W0CG-zsQETdsw84q0Kw0ZN3Qu0h4EsbcvvVhXhds7bvnHh_YPyE2HvInLx6r3XAU665cRPm_mJGpKYuqT2MqD60wv6heIlQw5-puo"
                    alt="Elmina Castle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-bold text-on-surface">Elmina Castle</p>
                <p className="text-xs text-on-surface-variant">45 mins away</p>
              </Link>

              <Link href="/attractions/cape-coast-castle" className="min-w-[180px] group cursor-pointer">
                <div className="h-32 rounded-2xl bg-gray-200 overflow-hidden mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn5EmNxSL74XNLEWKbQ5hpXvJjusZfVTYI43VOwOZh7pi2qaxa7QRJLLV9d2wMLVOWjUmBGcj5ierXXbCl9qbxLwHgCQ1soW_yf_YCVcDY_KHCnHvwlLYcYVT70ChcYE5X3rTfTUs6usT1rX7JfG44Gh7AfkDXaWScft2-Vf_brgGExS2vYepOC_Tv5W5v1M2a8HU9B6YBwK8Qgz2AwyZc7ohB8BlR950bMCqLkr04XMXsWtjlkWyLPFiOJdsllHoM28wOP-90SQg9"
                    alt="Cape Coast Castle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-bold text-on-surface">Cape Coast Castle</p>
                <p className="text-xs text-on-surface-variant">50 mins away</p>
              </Link>

              <Link href="/attractions/anomabo-beach" className="min-w-[180px] group cursor-pointer">
                <div className="h-32 rounded-2xl bg-gray-200 overflow-hidden mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB9FbGfwZPLgv-xK2fjb7v4jBfVnkrKkUUzphVg03vnG_L5SQSd82Ct9rSRsj5DrLHb8N25UP2SdigY3VN-ydsYkrkxRaLauGDWJNc8mWqVo8eLYOqMH_HIfgB5U92vGtCFkY57x4iFMxcm91jTYBw4GPa6U4ilCSdzG5uFQdo1PTmtsIwnntiK4n-_dnOrXFRVnATrYFCn5Kv7Y9TEJQwOadcXtJlMM5qrxz_-CoffdDODyUvjDp-LIUrMj-kKWzSkFMRHdfukks1"
                    alt="Anomabo Beach"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-bold text-on-surface">Anomabo Beach</p>
                <p className="text-xs text-on-surface-variant">1.5 hrs away</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
