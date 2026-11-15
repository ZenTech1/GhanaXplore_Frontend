import {
  type Attraction,
  type AttractionCategory,
  type AttractionImage,
  type AttractionSchedule,
  initialAttractions,
} from './operatorAttractionData';

const STORAGE_KEY = 'ghanaxplore.operator.attraction-edits';

export type EditableAttraction = Pick<
  Attraction,
  | 'name'
  | 'detailTitle'
  | 'category'
  | 'description'
  | 'entryFee'
  | 'gallery'
  | 'image'
  | 'imageAlt'
  | 'location'
  | 'region'
  | 'coordinates'
  | 'amenities'
  | 'schedule'
>;

type StoredEdits = Record<string, Partial<EditableAttraction>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStoredEdits(value: unknown): StoredEdits {
  if (!isRecord(value)) {
    throw new Error('Saved attraction edits have an invalid format.');
  }

  const edits: StoredEdits = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!isRecord(raw)) {
      throw new Error('A saved attraction edit has an invalid format.');
    }

    const changes: Partial<EditableAttraction> = {};
    for (const key of ['name', 'detailTitle', 'description', 'image', 'imageAlt', 'location', 'region', 'coordinates'] as const) {
      if (key in raw) {
        if (typeof raw[key] !== 'string') throw new Error(`Saved attraction ${key} is invalid.`);
        changes[key] = raw[key];
      }
    }
    if ('category' in raw) {
      if (typeof raw.category !== 'string' || !isAttractionCategory(raw.category)) {
        throw new Error('Saved attraction category is invalid.');
      }
      changes.category = raw.category;
    }
    if ('entryFee' in raw) {
      if (typeof raw.entryFee !== 'number' || !Number.isFinite(raw.entryFee) || raw.entryFee < 0) {
        throw new Error('Saved attraction entry fee is invalid.');
      }
      changes.entryFee = raw.entryFee;
    }
    if ('gallery' in raw) {
      if (!Array.isArray(raw.gallery) || !raw.gallery.every(isAttractionImage)) {
        throw new Error('Saved attraction photos are invalid.');
      }
      changes.gallery = raw.gallery;
    }
    if ('amenities' in raw) {
      if (!Array.isArray(raw.amenities) || !raw.amenities.every((amenity) => typeof amenity === 'string')) {
        throw new Error('Saved attraction amenities are invalid.');
      }
      changes.amenities = raw.amenities;
    }
    if ('schedule' in raw) {
      if (!isAttractionSchedule(raw.schedule)) throw new Error('Saved attraction schedule is invalid.');
      changes.schedule = raw.schedule;
    }
    edits[id] = changes;
  }
  return edits;
}

function readStoredEdits(): StoredEdits {
  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (!serialized) return {};

  const parsed: unknown = JSON.parse(serialized);
  return parseStoredEdits(parsed);
}

export function getAttraction(id: string): Attraction | undefined {
  const initial = initialAttractions.find((attraction) => attraction.id === id);
  if (!initial) return undefined;
  const saved = readStoredEdits()[id];
  return saved ? { ...initial, ...saved } : initial;
}

export function getAttractionsWithEdits(): Attraction[] {
  const savedEdits = readStoredEdits();
  return initialAttractions.map((attraction) => {
    const saved = savedEdits[attraction.id];
    return saved ? { ...attraction, ...saved } : attraction;
  });
}

export function saveAttractionEdits(id: string, changes: Partial<EditableAttraction>) {
  const attraction = initialAttractions.find((item) => item.id === id);
  if (!attraction) throw new Error('The attraction could not be found.');

  const edits = readStoredEdits();
  edits[id] = { ...edits[id], ...changes };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

export function isAttractionCategory(value: string): value is AttractionCategory {
  return value === 'Nature' || value === 'Culture' || value === 'History';
}

export function isAttractionImage(value: unknown): value is AttractionImage {
  return isRecord(value) && typeof value.src === 'string' && typeof value.alt === 'string';
}

export function isAttractionSchedule(value: unknown): value is AttractionSchedule {
  if (!isRecord(value) || !isRecord(value.weekdays) || !isRecord(value.weekends)) return false;
  return (
    typeof value.weekdays.open === 'string' &&
    typeof value.weekdays.close === 'string' &&
    typeof value.weekends.open === 'string' &&
    typeof value.weekends.close === 'string' &&
    typeof value.publicHolidaysOpen === 'boolean'
  );
}
