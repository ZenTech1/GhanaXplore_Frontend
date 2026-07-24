import { apiClient } from './client';
import type { Attraction } from '@/types';

export interface AttractionFilters {
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minReadinessScore?: number;
}

function buildQuery(filters: AttractionFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const attractionsApi = {
  list: (filters: AttractionFilters = {}) =>
    apiClient.get<Attraction[]>(`/attractions${buildQuery(filters)}`),

  getById: (id: string) => apiClient.get<Attraction>(`/attractions/${id}`),

  // FR-10: proximity-based recommendations
  nearby: (lat: number, lng: number, radiusKm = 25) =>
    apiClient.get<Attraction[]>(`/attractions/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),
};
