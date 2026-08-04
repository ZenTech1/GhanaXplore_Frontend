'use client';

import { useEffect, useRef, useState } from 'react';

export function CommunityExperiences() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
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

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      id: 'pottery',
      title: 'Pottery Workshop in Pankrono',
      description:
        'Learn the ancient art of Ashanti pottery from master artisans in their family homes.',
      price: 'GH₵ 150 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsNVeCiSDlH2a1dU9LFnOakELtIjkX_7kO03Y8n1yqarwxnlxXeo8_JiO26G13-PPpV1R6_Z-mdDHvNsfcqDdWCRD-zkUzvm1Ui9-gcW_2USpJbNziLjKlbdEQV_7_fbe6E-nfg20Hz9ZQpVrOnSqjGmXJmF02vTNIoJ8lB2GFydWB_zl4hNsQG4ZK1_X5f-AULFzSZ_RMYXcNvXppPgqiQQ8opnlt9v4ebIRpDaZ9rEgtvgIXqNGJQqQCzcLI63_BJk1n3tstejn5',
    },
    {
      id: 'fishing',
      title: 'Fishing Morning in Jamestown',
      description:
        'Join local fishermen at dawn and enjoy a traditional breakfast prepared with the day’s catch.',
      price: 'GH₵ 85 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEA1UsgQSFoCa6pJAgMe1rTKEDAFxR3TbgaFPaThXpJCR5yMLOrKdSxJNb3mMHdRj5UtESH5Zx2A_tM-acZGYZEq1c4Vd8MqO3GZal37Bo-BksS_ReGHfFpu-IlaRlKmG9P8B1beN_ZGPKrXYyTUJG-kn0tkT-A9ouUUMLzlBFS3osirM6azxgdlqLMEPytSKrhGBdSzZV5xNBLG6N03aqTTlpsQnIdExA__DONnbnuX3uqZupt2nzDm1h8cQYVGKLPAPXlviJvjOv',
    },
    {
      id: 'jollof',
      title: 'Homestead Jollof Masterclass',
      description:
        'Master the secrets of the world’s best Jollof rice in a backyard kitchen in Osu.',
      price: 'GH₵ 200 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDy7epCRO5lFynJ7efATS7Cx2wAJX76tXIugrKR-c-LAVQjdB27Xqt0GShqJN9dzfxQoqYY35t9n6j9QlARcxtGSRkXCrA_CoaSFmjlQkKrUSkHXYpC15axlyQaU8xeuonJPL-e3zPRe3dtOYTH5OIdFV9QbQLXD4xw0f3SZtpDzKALTuUQx65Q2P4K353smpEMhqDIIz8hBNsbDPzjauWCOxTuPNIKsQhTeyZ59_o3i1_CTwvJcyHOb7jB103aGkd-5yxiWpCDqUID',
    },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes ceFadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ceFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes ceCardUp {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* Each entrance class lives on a dedicated wrapper, never on the
           same element as the card's own hover transition-all. This keeps
           fill-mode: forwards from the entrance animation from ever
           blocking the card's hover state afterward. */
        .ce-header,
        .ce-nav-buttons {
          opacity: 0;
        }
        .ce-header.is-visible {
          animation: ceFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ce-nav-buttons.is-visible {
          animation: ceFadeIn 0.7s ease forwards;
        }
        .ce-card-wrap {
          opacity: 0;
          transform: translateY(60px) scale(0.96);
        }
        .ce-card-wrap.is-visible {
          animation: ceCardUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ce-header,
          .ce-nav-buttons,
          .ce-card-wrap {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="hidden md:block py-section-gap px-container-padding-mobile md:px-container-padding-desktop bg-inverse-surface text-inverse-on-surface overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className={`ce-header max-w-xl ${visible ? 'is-visible' : ''}`}>
              <h2 className="font-display-lg text-4xl mb-4">Community-Led Experiences</h2>
              <p className="opacity-80">
                Support local communities while gaining insider access to traditions hidden from the standard tourist path.
              </p>
            </div>
            <div
              className={`ce-nav-buttons flex gap-4 ${visible ? 'is-visible' : ''}`}
              style={{ animationDelay: visible ? '0.2s' : undefined }}
            >
              <button
                aria-label="Previous experience"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                aria-label="Next experience"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className={`ce-card-wrap ${visible ? 'is-visible' : ''}`}
                style={{ animationDelay: visible ? `${0.15 + idx * 0.15}s` : undefined }}
              >
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="h-48 rounded-xl mb-6 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${exp.image}')` }}
                    />
                  </div>
                  <h4 className="font-headline-md text-xl mb-2">{exp.title}</h4>
                  <p className="opacity-70 text-sm mb-4">{exp.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-fixed-dim font-bold">{exp.price}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}