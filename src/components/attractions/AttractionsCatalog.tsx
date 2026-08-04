'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface AttractionItem {
  id: string;
  name: string;
  region: string;
  score: number;
  readinessPct: number;
  rating: number;
  category: string;
  tags: string[];
  description: string;
  price: string;
  priceValue: number;
  priceUnit: string;
  image: string;
  badge?: {
    text: string;
    icon: string;
    type: 'must-visit' | 'eco';
  };
  alt: string;
}

const SAMPLE_ATTRACTIONS: AttractionItem[] = [
  {
    id: 'cape-coast-castle',
    name: 'Cape Coast Castle',
    region: 'Central Region',
    score: 9.2,
    readinessPct: 98,
    rating: 4.9,
    category: 'Heritage Sites',
    tags: ['Heritage', 'Museum', 'Coastal'],
    description:
      "A UNESCO World Heritage site standing as a powerful memorial to the transatlantic slave trade and Ghana's rich history.",
    price: 'GHS 40',
    priceValue: 40,
    priceUnit: '/ person',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8O36nF3FQWEV3q1ubMPQTfowJJrgnOkE2VDBE1fGjhEwz55wzqmWE5c69TFC7vFp_rw_KvMMKZ5mKV_fkGRMTKCfuVRc9MgUkc8hTCiv5vKuRdf_1ljdxmxhoHLGno6Vh9r6_Qi5ClZqNv0KQM9yu_Mscw4UjEXe6wm-0aFD0Ap24OYhdwYVfaTOLJhNn9TMbmBiMZ897X6p9eHD2MbWjX_PRh32dQFQBLPeSb9BfN6NSYS57z_EM6R7-jIQ4pLJwklvEJ0X5H3JQ',
    badge: {
      text: 'Must Visit',
      icon: 'star',
      type: 'must-visit',
    },
    alt: 'Cape Coast Castle at sunset',
  },
  {
    id: 'kakum-national-park',
    name: 'Kakum Canopy Walk',
    region: 'Central Region',
    score: 8.7,
    readinessPct: 94,
    rating: 4.8,
    category: 'Adventure',
    tags: ['Adventure', 'Nature'],
    description:
      'Experience the rainforest from 30 meters above the ground on a 330-meter-long canopy walkway.',
    price: 'GHS 60',
    priceValue: 60,
    priceUnit: '/ person',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL0tCoh9nwLwerQivK_Ns-10h31GTOPREYom7WQ7MFuZkGKWVBJvik_rXIilmxjd2vRz_XlpqoCbsWZuRTyK7oGnlIlBVxlc2FLwy7NlpOOM8xNRZ6X0gDwyLOOrbFnINBJrp7lHBZGAaOk8wvcG_xJnv6uEJME4P9hfSGrj4GYtBtIFiWUYHzNOfAsvRyJsMslDcOSdEFcOg_ahAwTE8DmhwXDyAjS1oPnBZk90-6lbKuQmjNgXVtgFiJREmeadpcsoYe7QdXmP7j',
    badge: {
      text: 'Eco-Friendly',
      icon: 'eco',
      type: 'eco',
    },
    alt: 'Kakum Canopy Walkway aerial view',
  },
  {
    id: 'bonwire-kente-weaving',
    name: 'Bonwire Kente Weaving',
    region: 'Ashanti Region',
    score: 8.1,
    readinessPct: 91,
    rating: 4.6,
    category: 'Heritage Sites',
    tags: ['Culture', 'Art', 'Workshop'],
    description:
      'The birthplace of the world-famous Kente cloth. Learn the intricate art of hand-weaving from master craftsmen.',
    price: 'Free',
    priceValue: 0,
    priceUnit: 'entry',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGC9IbvlqN7aZk8EGsINdc0lS8NMtbkCv6Iqs9TNJzhj0dBs8qCztv65qDuS_yUxWDT3tUcD9kHQrNPezYcQAP8hbEea5S3hTtAKK22nG6ZeYnb7DTeaQ8bR4e7nLDchSKzEstGhZ9-Wb-EX7MFMiLQ3JZRZVnI8OnSIGs_3-jx90-4qxYH3KV7kL1QIIcYbt2iDAPJ2qHhVlj60Qs_5OsQ7obl2xJqLuE5TZ1UsJz-vm2PGggZkBQV8-ZCsZEMAFKLqY0dVuQgLNq',
    alt: 'Bonwire Kente weavers at loom',
  },
  {
    id: 'mole-national-park',
    name: 'Mole National Park',
    region: 'Northern Region',
    score: 8.9,
    readinessPct: 89,
    rating: 4.7,
    category: 'Safari & Wildlife',
    tags: ['Safari', 'Wildlife'],
    description:
      "Ghana's largest wildlife refuge, home to elephants, leopards, and over 300 species of birds.",
    price: 'GHS 120',
    priceValue: 120,
    priceUnit: '/ day',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCC4xFPjziSkwQ7wl0OE9TjR1XjIl895E-5mYlOQCJtEvoClEEsA0zRtlENb9nFsFmFbk7TbWKpEZn045gVmMQmLy2xv2Q1nAohV-5aCyF7uzNRIR8b9eGI_8yB8Fta9Z0N8444pnyXilzDGZwV2iykp19-2H23LaYHOhMP6YmgjxMFm-EDReVHyPO_RC_Sl3vhphWB4RiPFIpIVOJCP1HnPud5CZvhV338I-WGcyHoXfVl5tMoeOktIWEHJQwWPbdNrXi83mATzMKb',
    alt: 'African elephants in Mole National Park',
  },
  {
    id: 'boti-falls',
    name: 'Boti Falls',
    region: 'Eastern Region',
    score: 7.8,
    readinessPct: 85,
    rating: 4.5,
    category: 'Adventure',
    tags: ['Nature', 'Hiking'],
    description:
      'A hidden gem featuring twin waterfalls, umbrella rocks, and a three-headed palm tree.',
    price: 'GHS 25',
    priceValue: 25,
    priceUnit: '/ entry',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvGauoKDrHrWvk8wfiO-zKhJIctlFzy8NYjmaTWXVbjZQUUdj9f85M2EVBx8h_0J0guryLZQUhE6dhxE7rLDN1AYCDNtVQFVmXwgs7pA7v6p06rXF-H3fue25hbtmqUcEBrctDImCxm21EusATqDdSituGMsx67QBBoGTlM797uc2JsudmMrvpISkMDTDoZF7TqOrLnTKt9I8gdsQ8iEY5ttz2VRDrkIlUfeY8yFHCQ61iwt2kwgtiHeXQ9OzG63eL0LQTm8lvMOsu',
    alt: 'Twin waterfalls of Boti Falls',
  },
  {
    id: 'nkrumah-memorial',
    name: 'Nkrumah Memorial',
    region: 'Greater Accra',
    score: 9.5,
    readinessPct: 96,
    rating: 4.9,
    category: 'Heritage Sites',
    tags: ['History', 'Museum', 'Urban'],
    description:
      "Dedicated to Ghana's first president, this memorial park is a masterpiece of modern African architecture.",
    price: 'GHS 50',
    priceValue: 50,
    priceUnit: '/ entry',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf3xOmwSXPv3JCMVQXIohPDDEuJFQuSfMvqqoX-aVnBnCx0Gvp2UKW9rB-FSo5G_cZRvtN_iy9r9lhUsEtzhjKaZMeP1BYzHKaUONWYXz1BTzP_kb3B7GKFflthKaDNJeHLgmKyUS8u0pGZ_iEiFua1TMoJrR1QUB-F58FYWX1lOWSc5WOXNBZDFFOXvCiTqyUC8wqU14i7PTtQadKTcuyJW9fEMOESD9KiugQZZPyZpmpIq6r_Xs3zACfLgfJxn6aDelA-tWwGL8R',
    alt: 'Kwame Nkrumah Memorial Park mausoleum',
  },
];

export function AttractionsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Safari & Wildlife', 'Coastal & Beaches', 'Heritage Sites', 'Adventure']);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(['Family Friendly']);
  const [minReadiness, setMinReadiness] = useState(0);
  const [sortBy, setSortBy] = useState('Recommended');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [mobileChip, setMobileChip] = useState('All');
  
  // Refs for animation
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleAccessibility = (acc: string) => {
    setSelectedAccessibility((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategories(['Safari & Wildlife', 'Coastal & Beaches', 'Heritage Sites', 'Adventure']);
    setSelectedRegion('All Regions');
    setMaxPrice(5000);
    setSelectedAccessibility(['Family Friendly']);
    setMinReadiness(0);
    setMobileChip('All');
  };

  // Intersection Observer for section visibility
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      
      // Check if already visible on mount
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  const filteredAttractions = useMemo(() => {
    return SAMPLE_ATTRACTIONS.filter((item) => {
      // Mobile filter chips override
      if (mobileChip !== 'All') {
        if (mobileChip === 'Safari' && !item.category.includes('Safari') && !item.tags.includes('Safari')) return false;
        if (mobileChip === 'Coastal' && !item.category.includes('Coastal') && !item.tags.includes('Coastal')) return false;
        if (mobileChip === 'Heritage' && !item.category.includes('Heritage') && !item.tags.includes('Heritage') && !item.tags.includes('History')) return false;
      }

      // Search Query
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.region.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Desktop Region
      if (selectedRegion !== 'All Regions' && !item.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }

      // Desktop Categories
      const matchesCategory = selectedCategories.some((cat) => {
        if (cat === 'Safari & Wildlife') return item.category === 'Safari & Wildlife' || item.tags.includes('Safari') || item.tags.includes('Wildlife');
        if (cat === 'Coastal & Beaches') return item.category === 'Coastal & Beaches' || item.tags.includes('Coastal');
        if (cat === 'Heritage Sites') return item.category === 'Heritage Sites' || item.tags.includes('Heritage') || item.tags.includes('History');
        if (cat === 'Adventure') return item.category === 'Adventure' || item.tags.includes('Adventure');
        return false;
      });
      if (!matchesCategory) return false;

      // Max price
      if (item.priceValue > maxPrice) return false;

      // Min readiness
      if (minReadiness > 0 && item.score < minReadiness) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'High Score') return b.score - a.score;
      if (sortBy === 'Price Low-High') return a.priceValue - b.priceValue;
      return 0; // Recommended
    });
  }, [searchQuery, selectedCategories, selectedRegion, maxPrice, minReadiness, sortBy, mobileChip]);

  // Trigger animation for individual items with relaxed staggered delays
  useEffect(() => {
    // Reset animated items when filtered attractions change
    setAnimatedItems(new Set());
    
    if (isVisible && filteredAttractions.length > 0) {
      const timeouts: NodeJS.Timeout[] = [];
      filteredAttractions.forEach((item, index) => {
        // Each card gets a delay: first at 200ms, then 180ms between each
        const delay = 200 + index * 180;
        const timeout = setTimeout(() => {
          setAnimatedItems(prev => new Set(prev).add(item.id));
        }, delay);
        timeouts.push(timeout);
      });
      return () => timeouts.forEach(clearTimeout);
    }
  }, [isVisible, filteredAttractions]);

  return (
    <div ref={sectionRef} className="w-full">
      <style jsx>{`
        @keyframes cardPopIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          60% {
            opacity: 0.9;
            transform: translateY(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-up.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-fade-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-left.is-visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .animate-fade-right {
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-right.is-visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .animate-sidebar {
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-sidebar.is-visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .animate-chip {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-chip.is-visible {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Card pop-in animation with bounce effect */
        .card-pop-in {
          opacity: 0;
          transform: translateY(30px) scale(0.92);
        }
        .card-pop-in.is-visible {
          animation: cardPopIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
        }
        
        .card-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .card-shadow:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* MOBILE VIEW */}
      <div className="md:hidden pt-4 px-container-padding-mobile max-w-7xl mx-auto">
        {/* Header - Animate */}
        <section className={`animate-fade-up ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.05s' }}>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, tours..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary font-body-md placeholder:text-outline-variant shadow-sm transition-all"
            />
          </div>
        </section>

        {/* Filter Chips - Animate with stagger */}
        <section className="mt-6">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {['All', 'Safari', 'Coastal', 'Heritage'].map((chip, index) => (
              <button
                key={chip}
                onClick={() => setMobileChip(chip)}
                className={`animate-chip ${isVisible ? 'is-visible' : ''} flex items-center gap-2 px-4 py-2 rounded-full font-label-lg whitespace-nowrap transition-all ${
                  mobileChip === chip
                    ? 'bg-primary text-on-primary shadow-md'
                    : chip === 'All' 
                      ? 'bg-surface-container-low text-on-surface border border-outline-variant/30'
                      : chip === 'Safari'
                      ? 'bg-secondary-container/10 text-secondary border border-secondary/20 hover:bg-secondary-container/20'
                      : chip === 'Coastal'
                      ? 'bg-tertiary-container/10 text-tertiary border border-tertiary/20 hover:bg-tertiary-container/20'
                      : 'bg-primary-fixed/30 text-on-primary-fixed-variant border border-primary-fixed/50 hover:bg-primary-fixed/40'
                }`}
                style={{ transitionDelay: `${100 + index * 80}ms` }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {chip === 'All' ? 'explore' : chip === 'Safari' ? 'eco' : chip === 'Coastal' ? 'waves' : 'temple_buddhist'}
                </span>
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* Mobile Discovery Section */}
        <section className="mt-8 space-y-6">
          <h2 className={`animate-fade-left ${isVisible ? 'is-visible' : ''} font-headline-md text-headline-md text-on-surface`} style={{ transitionDelay: '0.2s' }}>
            Recommended for you
          </h2>
          
          {filteredAttractions.map((item, index) => (
            <Link key={item.id} href={`/attractions/${item.id}`} className="block">
              <article 
                className={`card-pop-in ${animatedItems.has(item.id) ? 'is-visible' : ''} bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.98]`}
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-label-sm text-on-surface">{item.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-[20px] text-on-surface">{item.name}</h3>
                      <p className="text-on-surface-variant font-label-lg flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {item.region}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-label-sm text-outline uppercase tracking-wider">Readiness</span>
                      <span className="font-bold text-primary text-headline-md text-[18px]">{item.readinessPct}%</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-label-sm text-on-surface-variant">Starting from</span>
                      <p className="font-bold text-on-surface">{item.price} {item.priceUnit !== 'entry' ? '.00' : ''}</p>
                    </div>
                    <button className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-label-lg font-bold shadow-sm hover:opacity-90 transition-opacity">
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          
          {filteredAttractions.length === 0 && (
            <div className={`animate-fade-scale ${isVisible ? 'is-visible' : ''} text-center py-12 text-on-surface-variant`} style={{ transitionDelay: '0.3s' }}>
              <span className="material-symbols-outlined text-4xl block mb-2 text-outline">search_off</span>
              <p className="font-body-lg">No attractions match your current filters.</p>
              <button onClick={handleClearAll} className="mt-4 text-primary font-label-lg hover:underline">
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block max-w-7xl mx-auto px-container-padding-desktop py-8">
        {/* Breadcrumbs */}
        <nav className={`animate-fade-up ${isVisible ? 'is-visible' : ''} flex items-center gap-2 mb-8 text-on-surface-variant font-label-lg`} style={{ transitionDelay: '0.05s' }}>
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary">Discover</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Attractions</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-gutter">
          {/* Left Sidebar Filters */}
          <aside className={`animate-sidebar ${isVisible ? 'is-visible' : ''} w-full md:w-64 flex-shrink-0 space-y-8`} style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
              <button onClick={handleClearAll} className="text-primary font-label-lg hover:underline">
                Clear all
              </button>
            </div>

            {/* Category */}
            <section className="space-y-4">
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-outline">Category</h3>
              <div className="flex flex-col gap-3">
                {['Safari & Wildlife', 'Coastal & Beaches', 'Heritage Sites', 'Adventure'].map((cat, index) => (
                  <label key={cat} className={`animate-fade-left ${isVisible ? 'is-visible' : ''} flex items-center gap-3 cursor-pointer group`} style={{ transitionDelay: `${150 + index * 80}ms` }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="font-body-md group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Price Range */}
            <section className={`animate-fade-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-outline mb-4">Price Range (GHS)</h3>
              <input
                type="range"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between font-label-lg text-on-surface-variant mt-2">
                <span>0</span>
                <span>{maxPrice >= 5000 ? '5000+' : `${maxPrice}`}</span>
              </div>
            </section>

            {/* Region */}
            <section className={`animate-fade-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-outline mb-4">Region</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl font-label-lg text-on-surface focus:ring-2 focus:ring-primary py-3 px-4"
              >
                <option>All Regions</option>
                <option>Greater Accra</option>
                <option>Ashanti</option>
                <option>Central Region</option>
                <option>Volta</option>
                <option>Northern Region</option>
                <option>Eastern Region</option>
              </select>
            </section>

            {/* Accessibility */}
            <section className={`animate-fade-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-outline mb-4">Accessibility</h3>
              <div className="flex flex-wrap gap-2">
                {['Wheelchair', 'Family Friendly', 'Guided Tours'].map((acc, index) => {
                  const isSelected = selectedAccessibility.includes(acc);
                  return (
                    <button
                      key={acc}
                      onClick={() => toggleAccessibility(acc)}
                      className={`animate-chip ${isVisible ? 'is-visible' : ''} px-4 py-1.5 rounded-full font-label-lg transition-all ${
                        isSelected
                          ? 'bg-primary-container/10 border border-primary text-primary'
                          : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                      style={{ transitionDelay: `${450 + index * 80}ms` }}
                    >
                      {acc}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Readiness Score Filter */}
            <section className={`animate-fade-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.5s' }}>
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-outline mb-4">Min. Readiness Score</h3>
              <button
                onClick={() => setMinReadiness((prev) => (prev === 8 ? 0 : 8))}
                className={`w-full flex items-center gap-2 rounded-xl p-3 transition-colors ${
                  minReadiness === 8 ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-lg">8.0+ Excellent</span>
              </button>
            </section>
          </aside>

          {/* Right Content */}
          <div className="flex-1 space-y-gutter">
            {/* Search and Stats */}
            <div className={`animate-fade-up ${isVisible ? 'is-visible' : ''} flex flex-col md:flex-row md:items-center gap-4`} style={{ transitionDelay: '0.15s' }}>
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, landmark or region..."
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary font-body-md text-on-surface"
                />
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 px-2">
                <span className="font-label-lg text-on-surface-variant">
                  Showing {filteredAttractions.length} attractions
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-label-lg text-primary focus:ring-0 cursor-pointer"
                >
                  <option value="Recommended">Sort by: Recommended</option>
                  <option value="High Score">Sort by: High Score</option>
                  <option value="Price Low-High">Sort by: Price Low-High</option>
                </select>
              </div>
            </div>

            {/* Grid of Attraction Cards - with smooth pop-in animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredAttractions.map((item, index) => (
                <div
                  key={item.id}
                  className={`card-pop-in ${animatedItems.has(item.id) ? 'is-visible' : ''} group bg-surface rounded-3xl overflow-hidden card-shadow transition-all hover:-translate-y-1 duration-300 border border-outline-variant/10 flex flex-col justify-between`}
                  style={{ animationDelay: `${index * 180}ms` }}
                >
                  <Link href={`/attractions/${item.id}`} className="block flex-1">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${item.image})` }} 
                      />
                      {item.badge && (
                        <div className="absolute top-4 left-4">
                          <div
                            className={`px-3 py-1 rounded-full font-label-sm flex items-center gap-1 shadow-lg ${
                              item.badge.type === 'must-visit'
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-primary text-on-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {item.badge.icon}
                            </span>
                            {item.badge.text}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-colors ${
                          favorites[item.id] ? 'text-error' : 'text-on-surface hover:text-error'
                        }`}
                      >
                        <span className="material-symbols-outlined" style={favorites[item.id] ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-label-lg text-primary uppercase tracking-tighter">{item.region}</p>
                          <h4 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <div className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-xl inline-block">
                            <span className="font-bold text-headline-md leading-none">{item.score}</span>
                            <span className="text-label-sm block opacity-80">Score</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-on-surface-variant font-body-md line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 py-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <span key={tag} className="bg-surface-container px-3 py-1 rounded-full text-label-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                  <div className="p-5 pt-0 border-t border-outline-variant/20 flex justify-between items-center mt-auto">
                    <span className="font-headline-md text-on-surface">
                      {item.price}{' '}
                      <span className="text-label-lg font-normal text-on-surface-variant">{item.priceUnit}</span>
                    </span>
                    <Link
                      href={`/attractions/${item.id}`}
                      className="bg-secondary text-on-secondary px-5 py-2 rounded-xl font-label-lg hover:opacity-90 transition-all inline-block"
                    >
                      {item.price === 'Free' ? 'Learn More' : 'Book Now'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredAttractions.length === 0 && (
              <div className={`animate-fade-scale ${isVisible ? 'is-visible' : ''} bg-surface-container-low rounded-3xl p-12 text-center text-on-surface-variant`} style={{ transitionDelay: '0.3s' }}>
                <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
                <p className="text-body-lg font-bold">No attractions found</p>
                <p className="text-body-md">Try clearing or adjusting your filters to discover more destinations.</p>
                <button
                  onClick={handleClearAll}
                  className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-xl font-label-lg hover:opacity-90 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className={`animate-fade-up ${isVisible ? 'is-visible' : ''} flex justify-center items-center gap-2 pt-8`} style={{ transitionDelay: '0.4s' }}>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-label-lg">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors font-label-lg">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors font-label-lg">
                3
              </button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors font-label-lg">
                12
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}