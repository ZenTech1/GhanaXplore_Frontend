export type BookingStatus = 'Confirmed' | 'Pending' | 'Checked In' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  guest: string;
  email: string;
  phone: string;
  initials: string;
  attraction: string;
  experience: string;
  date: string;
  time: string;
  guests: number;
  guestBreakdown: string;
  amount: number;
  status: BookingStatus;
  avatarClass: string;
  basePrice: number;
  tourismLevy: number;
  paymentMethod: string;
  region: string;
  memberTier: string;
  visitCount: number;
  guestRequest: string;
}

export const operatorBookings: Booking[] = [
  {
    id: 'GXP-88219',
    guest: 'Kwame Boateng',
    email: 'k.boateng@example.com',
    phone: '+233 24 555 0192',
    initials: 'KB',
    attraction: 'Kakum National Park',
    experience: 'Canopy Walkway',
    date: '2024-10-24',
    time: '10:00',
    guests: 4,
    guestBreakdown: '2 adults, 2 children',
    amount: 450,
    status: 'Confirmed',
    avatarClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    basePrice: 415,
    tourismLevy: 35,
    paymentMethod: 'Paid via MoMo',
    region: 'Central Region',
    memberTier: 'Gold Member',
    visitCount: 3,
    guestRequest: 'First-time visitor, very excited! We are celebrating a small family milestone and would love to take some photos at the highest point of the canopy.',
  },
  {
    id: 'GXP-88421',
    guest: 'David Osei',
    email: 'david.osei@example.com',
    phone: '+233 20 456 7890',
    initials: 'DO',
    attraction: 'Mole National Park',
    experience: 'Safari Drive',
    date: '2024-10-24',
    time: '14:00',
    guests: 2,
    guestBreakdown: '2 adults',
    amount: 1200,
    status: 'Pending',
    avatarClass: 'bg-primary-container text-on-primary-container',
    basePrice: 1110,
    tourismLevy: 90,
    paymentMethod: 'Pending payment',
    region: 'Savannah Region',
    memberTier: 'Explorer',
    visitCount: 1,
    guestRequest: 'No special requests.',
  },
  {
    id: 'GXP-88102',
    guest: 'Linda Williams',
    email: 'linda.williams@example.com',
    phone: '+233 55 345 6789',
    initials: 'LW',
    attraction: 'Elmina Castle',
    experience: 'History Tour',
    date: '2024-10-23',
    time: '11:00',
    guests: 1,
    guestBreakdown: '1 adult',
    amount: 80,
    status: 'Completed',
    avatarClass: 'bg-secondary-container/40 text-on-secondary-container',
    basePrice: 74,
    tourismLevy: 6,
    paymentMethod: 'Paid via card',
    region: 'Central Region',
    memberTier: 'Explorer',
    visitCount: 2,
    guestRequest: 'No special requests.',
  },
  {
    id: 'GXP-88095',
    guest: 'John Kwesi',
    email: 'john.kwesi@example.com',
    phone: '+233 27 987 6543',
    initials: 'JK',
    attraction: 'Boti Falls',
    experience: 'Hiking Adventure',
    date: '2024-10-22',
    time: '08:00',
    guests: 4,
    guestBreakdown: '4 adults',
    amount: 600,
    status: 'Cancelled',
    avatarClass: 'bg-error-container/60 text-error',
    basePrice: 555,
    tourismLevy: 45,
    paymentMethod: 'Refunded',
    region: 'Eastern Region',
    memberTier: 'Explorer',
    visitCount: 1,
    guestRequest: 'No special requests.',
  },
  {
    id: 'GXP-88220',
    guest: 'Ama Mensah',
    email: 'ama.mensah@example.com',
    phone: '+233 24 123 4567',
    initials: 'AM',
    attraction: 'Kakum National Park',
    experience: 'Canopy Walkway',
    date: '2024-10-24',
    time: '09:30',
    guests: 3,
    guestBreakdown: '2 adults, 1 child',
    amount: 450,
    status: 'Checked In',
    avatarClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    basePrice: 415,
    tourismLevy: 35,
    paymentMethod: 'Paid via GhanaPay',
    region: 'Central Region',
    memberTier: 'Silver Member',
    visitCount: 2,
    guestRequest: 'No special requests.',
  },
];
