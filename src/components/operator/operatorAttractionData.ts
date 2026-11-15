export type AttractionStatus = 'Live' | 'Pending' | 'Draft' | 'Paused';
export type AttractionCategory = 'Nature' | 'Culture' | 'History';

export interface AttractionReview {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface AttractionImage {
  src: string;
  alt: string;
}

export interface AttractionSchedule {
  weekdays: { open: string; close: string };
  weekends: { open: string; close: string };
  publicHolidaysOpen: boolean;
}

export interface Attraction {
  id: string;
  name: string;
  category: AttractionCategory;
  location: string;
  status: AttractionStatus;
  bookings: number | null;
  rating: number | null;
  trend: number | null;
  image?: string;
  imageAlt: string;
  chartPath?: string;
  detailTitle?: string;
  description?: string;
  revenue?: number | null;
  gallery?: AttractionImage[];
  reviews?: AttractionReview[];
  reviewCount?: number;
  entryFee?: number;
  region?: string;
  coordinates?: string;
  amenities?: string[];
  schedule?: AttractionSchedule;
}

export const initialAttractions: Attraction[] = [
  {
    id: 'kakum',
    name: 'Kakum National Park',
    detailTitle: 'Kakum Canopy Walkway',
    category: 'Nature',
    location: 'Central Region, Ghana',
    status: 'Live',
    bookings: 1200,
    rating: 4.9,
    trend: 14,
    revenue: 14000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1WP4CXWpDiiczj9y0cWTHF045eQt3FiO8jRFKRgkhCC42q8LpJhNltXn5AVDembOsEcSP6ZuSWRQf8SaTmR43KgeGncNz37wNx0Qpzu0MeV4auDFthqJiZN6v8i9b2J0RViS_RNNTsY1UADLWy0EN3BNwWdWfes5qrCLBbCFkfB7GuYoOVUhKQiZGYriwOx1M9d7TUiAaGwNhnmOWYEaKDEuRtV7M0EMIvAvMlqIYMTsWMJVCs77hdazflcUmaHQ0jUx41dHJVPBn',
    imageAlt: 'Canopy walkway crossing the green rainforest at Kakum National Park.',
    chartPath: 'M0,18 Q10,15 20,10 T40,12 T60,5 T80,8 T100,2',
    description:
      "Suspended 30 meters above the forest floor, the Kakum Canopy Walkway offers a bird's-eye view of one of Africa's last remaining rainforests. This 330-meter-long bridge system provides a unique vantage point for spotting rare hornbills, Diana monkeys, and vibrant butterflies.",
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWDR9hWdr7XuVFRA3v3890t6NrkN9U_QyDA_Nkdnp9hP_dlBMxSmKB7HQAPRJMy1qBhiYqRsj-R3MmHTiqY6ulbtDwYpud8euyNzMe9_6xcmdOwmiJIex0f6H-J6T3c3q9E_HJ1rAkputYXEu1EXf8Yeze75P8XVxiHyJCaJQllYksLA5HHyER--BQ6JVr3cny4IP6xe0ALxPo9xHd-L75lm-frbZc8hsELdYgjmtboxyQhIboqKpCsxLFqeK_NixIlBWoKPHejnNa',
        alt: 'Close view of the rope and wood of the Kakum canopy bridge.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFusoODW37A_tQBweF6g9k0aujtmP28iKqbZZgNQaLdfC5A-qS_nllj440NO1q09Jx_feEvxKxh_vLej8mOxNwKxIy1QJYC4AwznzeWZTwi0zBEFSf9Fn_ipEbjv3sq9WGAx4Ja2LgPEM2pG_RSAV3HVgbwJYJiv0cuzzsopDxhKcKFtjj4uadwGUYPZ6GJBMvV0VHb_APb8ImunbDBBi-cMjHKaUKTogIgfaQWxuzbvJZ7_RbMB0ggsFuiJxK68YTTfajpatYrcYE',
        alt: 'Visitors walking along the elevated canopy bridge.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0TNslZzerauhJB_k59H-fcLH1X6j1UfmCR4bcii1vWoYaT5MCNW_Gcyh50bBqAOik0Si0Qn8dZJwWJFd9sWrg-kTDBv9xglokYSk_TiBzt0GoViFlNEM1GdMczgNT5Nd1uVQEBYhb1ao9Tq3ixhKUB5iuwhGyLsFfilqpJ3G4qVLnukH_ayTNCrFc-68hImIYIl1u1nCN_xXtCfOhh9S20Zu4fxS1LjRusMIFqp2YH_1Vpi8Vbe-RflkV585guE0OtJXiY8_zFiGo',
        alt: 'A bird perched among the rainforest foliage at Kakum.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9DAkDQ0yrwsJuJtTy2_-TCxNRZ1WnmHZ9nz_NOAHR-s-UZQ4qkOe8iDpAb5xIb6aIY7uyxZ5uYfATBuEzaZG1zKcq-nor5460yeudI4HZNGwndc8CSBbFExR9W1rOYH66KEb2R5JroKEb184rBgIYTozr518DH-MZi3RwPBqfWvSV23z6Ox_XtNcF_0hKyHNrU5R3ybwH4KAHngevbZ464qmGFqPHPs1Cix8fd6eds9R3s9fcTNeHz5E0iNoum7IgW3QjESwjwt0c',
        alt: 'A visitor dining experience near Kakum National Park.',
      },
    ],
    reviews: [
      {
        id: 'review-1',
        author: 'Kwame A.',
        rating: 5,
        text: 'Absolutely breathtaking experience! The guides were knowledgeable and the views are worth every step.',
      },
      {
        id: 'review-2',
        author: 'Elena G.',
        rating: 5,
        text: 'The canopy walk was unforgettable. The team made us feel safe throughout.',
      },
    ],
    reviewCount: 148,
    entryFee: 60,
    region: 'Central Region',
    coordinates: '5.4184° N, 1.3828° W',
    amenities: ['Restrooms', 'Visitor Center', 'Guided Tours', 'On-site Parking'],
    schedule: {
      weekdays: { open: '08:00', close: '17:00' },
      weekends: { open: '07:00', close: '18:00' },
      publicHolidaysOpen: true,
    },
  },
  {
    id: 'mole',
    name: 'Mole Safari Park',
    category: 'Nature',
    location: 'Savannah Region, Ghana',
    status: 'Live',
    bookings: 856,
    rating: 4.7,
    trend: -3,
    revenue: 9800,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6uQTCEm0rkNVn89_EFuj02dYfU4PH_lhII5Vf0QqX5S9HwevIDwibN9t6R2xean2pOWAn8DOOOMKHBDEJ6y0kPM3D68LMS8FLymPzEHiO63l_uwyafvyHgXQ2C-_IMB7duC7oxv3LD0xNNriOTsUFbsjYFGbT9Uu9TSw3dpqiuYIw1EYqOfRtrhFnmenBi2mAdUhXdqI9ilvGCcCfdqrNeyJKFBIfozBxhxfh99jhcysApaAOU2FeE4MaPo8W1g2aKdrwXdGrdacq',
    imageAlt: 'Golden-hour savannah landscape at Mole National Park.',
    chartPath: 'M0,2 Q20,5 40,8 T60,15 T80,12 T100,18',
    description:
      'Explore Ghana’s largest wildlife refuge, where wide savannah grasslands, ancient woodland, and remarkable wildlife create an unforgettable safari experience.',
  },
  {
    id: 'elmina',
    name: 'Elmina Castle Tour',
    category: 'History',
    location: 'Elmina, Central Region',
    status: 'Pending',
    bookings: null,
    rating: null,
    trend: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDa637FZf_q3QRG_K5e61qUc5pB1rlgxGgYD4loiogRVW3axd5W_6maItXL6CnbUWpzDjhTQJXe1tZjClq4YMSPlJz10ZF4UbGAj_NdPz9L006GzPjpHc6kviiNBqzHzPxWuUIFAn1t0xNr_VqkdyeF_Znmlh1s7uluRHLYQY5lwUrvB_mORhp16d5GgXaABMw6F5TSTgYKj0IHCT5QqVabiFMhKMVAxE2jbjd22TrxwdVg9EaoYGbMEX4wTEI-pLR7BJ0hb7UiTdbm',
    imageAlt: 'Historic Elmina Castle overlooking the Atlantic coast.',
    description:
      'Discover the history and architecture of Elmina Castle on a guided visit to one of Ghana’s most significant coastal heritage sites.',
  },
  {
    id: 'wli',
    name: 'Wli Waterfalls',
    category: 'Nature',
    location: 'Volta Region, Ghana',
    status: 'Live',
    bookings: 428,
    rating: 4.8,
    trend: 6,
    revenue: 5400,
    imageAlt: 'A new listing for Wli Waterfalls.',
    chartPath: 'M0,17 Q15,15 25,11 T50,10 T75,5 T100,3',
    description:
      'Follow a forest trail to the highest waterfall in West Africa, surrounded by the lush hills and rich birdlife of the Volta Region.',
  },
];
