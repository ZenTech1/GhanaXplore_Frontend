'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <>
      {/* DESKTOP FOOTER */}
      <footer className="hidden md:block bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-container-padding-mobile md:px-container-padding-desktop py-section-gap max-w-7xl mx-auto">
          {/* Brand Column */}
          <div className="col-span-1">
            <span className="font-headline-md text-headline-md font-bold text-primary mb-6 block">GhanaXplore</span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Connecting world travelers with the authentic soul of West Africa through technology and community.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-all">face_nod</span>
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-all">share_location</span>
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-all">groups</span>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-label-lg font-bold mb-6 text-on-surface">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link className="font-body-md text-on-surface-variant hover:underline decoration-secondary transition-opacity duration-300" href="#">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-on-surface-variant hover:underline decoration-secondary transition-opacity duration-300" href="#">
                  Support Center
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-on-surface-variant hover:underline decoration-secondary transition-opacity duration-300" href="#">
                  GTA Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-label-lg font-bold mb-6 text-on-surface">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link className="font-body-md text-on-surface-variant hover:underline decoration-secondary transition-opacity duration-300" href="#">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-on-surface-variant hover:underline decoration-secondary transition-opacity duration-300" href="#">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-label-lg font-bold mb-6 text-on-surface">Newsletter</h4>
            <p className="font-label-sm text-on-surface-variant mb-4">Get travel tips and exclusive deals in your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                className="w-full bg-surface-container rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 text-label-lg"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-primary text-on-primary p-2 rounded-lg hover:opacity-80 transition-all shrink-0"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-primary font-medium mt-2">
                Subscribed successfully!
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-8 border-t border-outline-variant/30 text-center md:text-left">
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 GhanaXplore. In partnership with Ghana Tourism Authority.</p>
        </div>
      </footer>

      {/* MOBILE FOOTER */}
      <footer className="md:hidden mt-section-gap bg-surface-container-highest px-container-padding-mobile py-12 flex flex-col items-center text-center gap-8 border-t border-outline-variant/20">
        <h2 className="font-headline-lg text-primary">GhanaXplore</h2>
        <div className="flex flex-wrap justify-center gap-6 text-on-surface-variant font-label-lg">
          <Link className="hover:text-primary transition-colors" href="#">About</Link>
          <Link className="hover:text-primary transition-colors" href="#">Partners</Link>
          <Link className="hover:text-primary transition-colors" href="#">Support</Link>
          <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
        </div>
        <p className="text-outline text-label-sm max-w-xs">
          © 2026 GhanaXplore. In partnership with Ghana Tourism Authority. Promoting sustainable discovery.
        </p>
      </footer>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={() => alert('Support chat opening...')}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-all z-40 border-2 border-white/20"
        aria-label="Chat support"
      >
        <span className="material-symbols-outlined text-[28px]">chat_bubble</span>
      </button>
    </>
  );
}

