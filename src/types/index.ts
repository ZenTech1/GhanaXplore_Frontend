// Mirrors Section 11 (Data Model) of the proposal.
// Keep these in sync with the FASTAPI backend's Pydantic/serializer schemas.

export type UserType =
  | 'Tourist'
  | 'Operator'
  | 'Guide'
  | 'CommunityHost'
  | 'Admin'
  | 'Government'
  | 'Investor';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  preferredLanguage: string;
  nationalityCountry: string;
  isVerified: boolean;
  createdAt: string;
}

export type AttractionCategory =
  | 'Cultural'
  | 'Historical'
  | 'Natural'
  | 'Recreational'
  | 'Community';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Attraction {
  attractionId: string;
  name: string;
  region: string;
  district: string;
  gpsLatitude: number;
  gpsLongitude: number;
  description: string;
  category: AttractionCategory;
  openingHours: string;
  entryFeeGHS: number;
  attractionReadinessScore: number; // 1-10, FR-6
  operatorId: string;
  approvalStatus: ApprovalStatus;
  accessibilityRating: number;
  isOfflineAvailable: boolean;
  lastUpdated: string;
}

export interface TourPackage {
  packageId: string;
  operatorId: string;
  title: string;
  description: string;
  attractionIds: string[];
  duration: string;
  groupSizeLimit: number;
  priceGHS: number;
  priceUSD: number;
  availableDates: string[];
  status: 'Active' | 'Inactive';
}

export interface TourGuide {
  guideId: string; // FK -> User.userId
  specialisations: string[];
  languages: string[];
  certificationBody: string;
  yearsExperience: number;
  hourlyRate: number;
  isVerified: boolean;
  rating: number; // 1-5
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Booking {
  bookingId: string;
  touristId: string;
  attractionId?: string;
  packageId?: string;
  guideId?: string | null;
  bookingReference: string;
  bookingDate: string;
  visitDate: string;
  partySize: number;
  totalAmountGHS: number;
  status: BookingStatus;
  qrCodeToken: string;
}

export type PaymentMethod = 'MoMo' | 'Card' | 'Bank';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface Payment {
  paymentId: string;
  bookingId: string;
  method: PaymentMethod;
  currencyCode: string;
  amountLocal: number;
  amountGHS: number;
  exchangeRate: number;
  status: PaymentStatus;
  gatewayReference: string;
  paymentDate: string;
}

export type ReviewTargetType = 'Attraction' | 'Package' | 'Guide' | 'Community';

export interface Review {
  reviewId: string;
  reviewerId: string;
  targetType: ReviewTargetType;
  targetId: string;
  rating: number; // 1-5
  comment: string;
  isVerifiedBooking: boolean; // FR-24: ratings tied to verified bookings only
  datePosted: string;
}

// Offline bundle shape (FR-29, Section 9.3) — this is what gets cached to
// IndexedDB and displayed by the offline reader UI.
export interface OfflineBundle {
  bundleId: string;
  attractionId: string;
  contentJSON: {
    description: string;
    foodGuide: string;
    languageTips: string;
    gps: { lat: number; lng: number };
  };
  compressedImagesURL: string[];
  bundleSizeKB: number;
  lastUpdated: string;
  version: number;
}

export interface CommunityExperience {
  experienceId: string;
  communityHostId: string;
  title: string;
  description: string;
  region: string;
  gpsCoordinates: { lat: number; lng: number };
  priceGHS: number;
  maxGroupSize: number;
  jobsSupported: number;
  householdsSupported: number;
  ecoRating: number;
  approvalStatus: ApprovalStatus;
}
