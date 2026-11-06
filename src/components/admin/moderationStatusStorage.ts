import type { ModerationStatus } from './AdminContentModeration';

const STORAGE_KEY = 'ghanaxplore-moderation-statuses';
const validStatuses: ModerationStatus[] = [
  'Pending',
  'Flagged',
  'Safe',
  'Approved',
  'Rejected',
  'Escalated',
];

export function readModerationStatuses(): Record<string, ModerationStatus> {
  const serializedStatuses = window.localStorage.getItem(STORAGE_KEY);
  if (!serializedStatuses) return {};

  const parsedStatuses: unknown = JSON.parse(serializedStatuses);
  if (!parsedStatuses || typeof parsedStatuses !== 'object' || Array.isArray(parsedStatuses)) {
    throw new Error('Saved moderation statuses have an invalid format.');
  }

  const statuses: Record<string, ModerationStatus> = {};
  for (const [reviewId, status] of Object.entries(parsedStatuses)) {
    if (typeof status !== 'string' || !validStatuses.includes(status as ModerationStatus)) {
      throw new Error('Saved moderation statuses contain an invalid status.');
    }
    statuses[reviewId] = status as ModerationStatus;
  }

  return statuses;
}

export function saveModerationStatus(reviewId: string, status: ModerationStatus): void {
  const statuses = readModerationStatuses();
  statuses[reviewId] = status;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
}
