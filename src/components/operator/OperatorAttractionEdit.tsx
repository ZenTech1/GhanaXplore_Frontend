'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import {
  type Attraction,
  type AttractionCategory,
  type AttractionImage,
  type AttractionSchedule,
  initialAttractions,
} from './operatorAttractionData';
import {
  getAttraction,
  isAttractionCategory,
  isAttractionImage,
  isAttractionSchedule,
  saveAttractionEdits,
} from './operatorAttractionStorage';

const navigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'event_available', href: '/dashboard#recent-bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '/operator/settings' },
];

const regions = [
  'Ahafo Region',
  'Ashanti Region',
  'Bono Region',
  'Bono East Region',
  'Central Region',
  'Eastern Region',
  'Greater Accra Region',
  'North East Region',
  'Northern Region',
  'Oti Region',
  'Savannah Region',
  'Upper East Region',
  'Upper West Region',
  'Volta Region',
  'Western Region',
  'Western North Region',
];

const amenityOptions = [
  'Restrooms',
  'Visitor Center',
  'Guided Tours',
  'On-site Parking',
  'Gift Shop',
  'Restaurant',
];

const emptySchedule: AttractionSchedule = {
  weekdays: { open: '08:00', close: '17:00' },
  weekends: { open: '08:00', close: '17:00' },
  publicHolidaysOpen: false,
};

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function getRegion(attraction: Attraction) {
  if (attraction.region) return attraction.region;
  const region = attraction.location
    .split(',')
    .map((part) => part.trim())
    .find((part) => part.endsWith('Region'));
  return region ?? 'Central Region';
}

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error(`Unable to read ${file.name}.`));
    };
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function OperatorAttractionEdit({ id }: { id: string }) {
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AttractionCategory>('Nature');
  const [entryFee, setEntryFee] = useState('0');
  const [coverImage, setCoverImage] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [gallery, setGallery] = useState<AttractionImage[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [region, setRegion] = useState('Central Region');
  const [coordinates, setCoordinates] = useState('');
  const [schedule, setSchedule] = useState<AttractionSchedule>(emptySchedule);

  useEffect(() => {
    try {
      const savedAttraction = getAttraction(id);
      if (!savedAttraction) {
        setAttraction(null);
        return;
      }

      const savedGallery = savedAttraction.gallery?.filter(isAttractionImage) ?? [];
      const savedSchedule = isAttractionSchedule(savedAttraction.schedule)
        ? savedAttraction.schedule
        : emptySchedule;
      setAttraction(savedAttraction);
      setName(savedAttraction.name);
      setDescription(savedAttraction.description ?? '');
      setCategory(isAttractionCategory(savedAttraction.category) ? savedAttraction.category : 'Nature');
      setEntryFee(String(savedAttraction.entryFee ?? 0));
      setCoverImage(savedAttraction.image ?? '');
      setCoverAlt(savedAttraction.imageAlt);
      setGallery(savedGallery);
      setAmenities(savedAttraction.amenities ?? []);
      setRegion(getRegion(savedAttraction));
      setCoordinates(savedAttraction.coordinates ?? '');
      setSchedule(savedSchedule);
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : 'Unable to load saved attraction edits.');
    }
  }, [id]);

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;

    const currentCount = gallery.length + (coverImage ? 1 : 0);
    if (currentCount + files.length > 10) {
      setError('You can add up to 10 photos to this listing.');
      return;
    }

    const invalidFile = files.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    if (invalidFile) {
      setError(`${invalidFile.name} is not a supported image. Choose a JPG, PNG, or WebP file.`);
      return;
    }
    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      setError(`${oversizedFile.name} is larger than the 5 MB limit.`);
      return;
    }

    try {
      const additions = await Promise.all(files.map(async (file) => ({
        src: await readImage(file),
        alt: file.name.replace(/\.[^.]+$/, ''),
      })));
      setGallery((current) => [...current, ...additions]);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load the selected photos.');
    }
  }

  function updateSchedule(
    period: 'weekdays' | 'weekends',
    key: 'open' | 'close',
    value: string,
  ) {
    setSchedule((current) => ({
      ...current,
      [period]: { ...current[period], [key]: value },
    }));
  }

  function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!attraction) return;

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const fee = Number(entryFee);
    if (!cleanName || !cleanDescription || !Number.isFinite(fee) || fee < 0) {
      setError('Enter a name, description, and valid non-negative entry fee.');
      return;
    }

    const oldRegion = getRegion(attraction);
    const updatedLocation = attraction.location.includes(oldRegion)
      ? attraction.location.replace(oldRegion, region)
      : `${region}, Ghana`;
    const changes = {
      name: cleanName,
      detailTitle: cleanName,
      description: cleanDescription,
      category,
      entryFee: fee,
      image: coverImage,
      imageAlt: coverAlt,
      gallery,
      amenities,
      region,
      location: updatedLocation,
      coordinates: coordinates.trim(),
      schedule,
    };

    try {
      saveAttractionEdits(id, changes);
      setAttraction({ ...attraction, ...changes });
      setNotice('Changes saved successfully in this browser.');
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save changes in this browser.');
    }
  }

  if (loadError) {
    return <div role="alert" className="p-8 text-center text-error">{loadError}</div>;
  }

  if (!attraction) {
    return (
      <div className="px-6 py-20 text-center">
        <Icon name="location_off" className="text-5xl text-outline" />
        <h1 className="mt-4 font-headline-md text-headline-md">Attraction not found</h1>
        <Link href="/operator/attractions" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary">
          Back to My Attractions
        </Link>
      </div>
    );
  }

  const savedPhotoCount = gallery.length + (coverImage ? 1 : 0);
  const fieldClass = 'w-full rounded-xl border-0 bg-surface-container p-3.5 text-on-surface outline-none transition focus:ring-2 focus:ring-primary sm:p-4';
  const labelClass = 'mb-2 block text-sm font-medium text-on-surface-variant';

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-surface-container-low shadow-sm lg:flex">
        <Link href="/dashboard" className="mb-4 flex flex-col gap-1 p-8 pb-4">
          <span className="flex items-center gap-2 font-headline-md text-headline-md text-primary">
            <Icon name="landscape" className="text-3xl" />
            GhanaXplore
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Operator Portal</span>
        </Link>
        <div className="px-6 pb-8">
          <Link href="/operator/attractions" className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container py-3 font-semibold text-on-secondary-container hover:shadow-lg">
            <Icon name="add_circle" />
            Add New Attraction
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-4" aria-label="Operator navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.label === 'Attractions' ? 'page' : undefined}
              className={`flex items-center rounded-xl px-4 py-3 transition-colors ${
                item.label === 'Attractions'
                  ? 'bg-primary-container font-semibold text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Icon name={item.icon} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-outline-variant p-6">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary"><Icon name="person" /></span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Kwame Mensah</span>
              <span className="block truncate text-xs text-on-surface-variant">Gold Operator</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-surface/90 px-4 shadow-sm backdrop-blur-xl sm:px-8 lg:h-20 lg:px-12">
          <Link href={`/operator/attractions/${id}`} aria-label="Back to attraction details" className="flex items-center gap-3 text-on-surface-variant hover:text-primary">
            <Icon name="arrow_back" />
            <span className="hidden sm:inline">Attraction details</span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="relative text-on-surface-variant"><Icon name="notifications" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-error" /></span>
            <span className="flex items-center gap-2 border-l border-outline-variant pl-4 sm:pl-6">
              <span className="hidden text-right sm:block">
                <span className="block text-xs text-on-surface-variant">Current Status</span>
                <span className="block text-sm font-medium text-primary">Active Now</span>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary"><Icon name="person" /></span>
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pb-12">
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="space-y-2">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                <Link href="/operator/attractions" className="hover:text-primary">Attractions</Link>
                <Icon name="chevron_right" className="text-sm" />
                <span className="text-on-surface">Edit {attraction.name}</span>
              </nav>
              <h1 className="font-display-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Refine Heritage</h1>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full bg-surface-container-high px-5 py-2.5 text-sm md:self-auto">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Editing {attraction.name}</span>
            </div>
          </div>

          {(error || notice) && (
            <div role={error ? 'alert' : 'status'} className={`mb-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm ${error ? 'bg-error-container text-on-error-container' : 'bg-primary-container/15 text-primary'}`}>
              {error || notice}
              <button type="button" aria-label="Dismiss message" onClick={() => { setError(''); setNotice(''); }}>
                <Icon name="close" />
              </button>
            </div>
          )}

          <form id="edit-attraction-form" onSubmit={saveChanges} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
            <div className="space-y-6 lg:col-span-8">
              <section className="space-y-6 rounded-3xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/30 text-primary"><Icon name="edit_note" /></span>
                  <h2 className="font-headline-md text-2xl">Core Details</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="md:col-span-2">
                    <span className={labelClass}>Attraction Name</span>
                    <input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
                  </label>
                  <label className="md:col-span-2">
                    <span className={labelClass}>Description</span>
                    <textarea required rows={5} maxLength={1500} value={description} onChange={(event) => setDescription(event.target.value)} className={`${fieldClass} resize-y`} />
                  </label>
                  <label>
                    <span className={labelClass}>Category</span>
                    <select
                      value={category}
                      onChange={(event) => {
                        if (isAttractionCategory(event.target.value)) setCategory(event.target.value);
                      }}
                      className={fieldClass}
                    >
                      <option value="Nature">Nature</option>
                      <option value="Culture">Culture</option>
                      <option value="History">History</option>
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>Entry Fee (GHS)</span>
                    <span className="relative block">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₵</span>
                      <input type="number" min="0" step="0.01" value={entryFee} onChange={(event) => setEntryFee(event.target.value)} className={`${fieldClass} pl-10`} />
                    </span>
                  </label>
                </div>
              </section>

              <section className="space-y-6 rounded-3xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container/20 text-tertiary"><Icon name="gallery_thumbnail" /></span>
                    <h2 className="font-headline-md text-2xl">Visual Experience</h2>
                  </div>
                  <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{savedPhotoCount} / 10 Photos</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  <label className="col-span-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container p-4 text-center transition hover:bg-surface-container-high sm:aspect-square">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm"><Icon name="add_a_photo" /></span>
                    <span className="font-semibold">Add New Photo</span>
                    <span className="mt-1 text-xs text-on-surface-variant">Max 5 MB · JPG, PNG, WebP</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} className="sr-only" />
                  </label>
                  {coverImage && (
                    <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm">
                      <img src={coverImage} alt={coverAlt} className="h-full w-full object-cover" />
                      <span className="absolute bottom-2 left-2 rounded-lg bg-secondary-container/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-on-secondary-container">Main Cover</span>
                      <button type="button" onClick={() => setCoverImage('')} aria-label="Remove cover photo" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error text-on-error opacity-100 shadow-lg transition sm:opacity-0 sm:group-hover:opacity-100">
                        <Icon name="close" className="text-lg" />
                      </button>
                    </div>
                  )}
                  {gallery.map((image, index) => (
                    <div key={`${image.src}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm">
                      <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove photo ${index + 1}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error text-on-error opacity-100 shadow-lg transition sm:opacity-0 sm:group-hover:opacity-100">
                        <Icon name="close" className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
                <h2 className="mb-7 font-headline-md text-2xl">Facilities &amp; Amenities</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {amenityOptions.map((amenity) => {
                    const checked = amenities.includes(amenity);
                    return (
                      <label key={amenity} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setAmenities((current) => checked
                            ? current.filter((item) => item !== amenity)
                            : [...current, amenity])}
                          className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <section className="space-y-5 rounded-3xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container/30 text-secondary"><Icon name="location_on" /></span>
                  <h2 className="font-headline-md text-2xl">Location</h2>
                </div>
                <label>
                  <span className={labelClass}>Region</span>
                  <select value={region} onChange={(event) => setRegion(event.target.value)} className={fieldClass}>
                    {!regions.includes(region) && <option>{region}</option>}
                    {regions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>GPS Coordinates</span>
                  <input value={coordinates} onChange={(event) => setCoordinates(event.target.value)} placeholder="5.4184° N, 1.3828° W" className={fieldClass} />
                </label>
                <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary/10 via-surface-container to-tertiary-container/10 text-center text-on-surface-variant">
                  <Icon name="map" className="text-4xl text-primary" />
                  <span className="text-sm font-medium">{region}, Ghana</span>
                  <span className="text-xs">Map preview</span>
                </div>
              </section>

              <section className="space-y-5 rounded-3xl bg-surface-container-lowest p-5 shadow-sm sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/30 text-primary"><Icon name="schedule" /></span>
                  <h2 className="font-headline-md text-2xl">Schedule</h2>
                </div>
                {(['weekdays', 'weekends'] as const).map((period) => (
                  <div key={period} className="space-y-2 border-b border-surface-container pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium">{period === 'weekdays' ? 'Mon - Fri' : 'Sat - Sun'}</p>
                    <div className="flex items-center gap-2">
                      <input aria-label={`${period} opening time`} type="time" value={schedule[period].open} onChange={(event) => updateSchedule(period, 'open', event.target.value)} className="min-w-0 flex-1 rounded-lg bg-surface-container px-2 py-2 text-sm text-primary" />
                      <span className="text-on-surface-variant">to</span>
                      <input aria-label={`${period} closing time`} type="time" value={schedule[period].close} onChange={(event) => updateSchedule(period, 'close', event.target.value)} className="min-w-0 flex-1 rounded-lg bg-surface-container px-2 py-2 text-sm text-primary" />
                    </div>
                  </div>
                ))}
                <label className="flex items-center justify-between gap-4 text-sm">
                  <span>Open on public holidays</span>
                  <input type="checkbox" checked={schedule.publicHolidaysOpen} onChange={(event) => setSchedule((current) => ({ ...current, publicHolidaysOpen: event.target.checked }))} className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" />
                </label>
              </section>

              <aside className="relative overflow-hidden rounded-3xl bg-primary p-6 text-on-primary sm:p-8">
                <div className="relative z-10 space-y-3">
                  <h2 className="font-headline-md text-2xl">Operator Tip</h2>
                  <p className="text-sm leading-6">High-quality photos help visitors picture their trip and can make your listing more engaging.</p>
                </div>
                <Icon name="lightbulb" className="absolute -bottom-5 -right-3 text-[120px] opacity-20" />
              </aside>
            </div>
          </form>

          <footer className="sticky bottom-4 z-20 mt-8 hidden items-center justify-between gap-4 rounded-3xl bg-surface/95 p-5 shadow-xl backdrop-blur-xl lg:flex">
            <p className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Icon name="info" />
              Changes are saved in this browser when you submit.
            </p>
            <div className="flex items-center gap-3">
              <Link href={`/operator/attractions/${id}`} className="rounded-xl px-6 py-3 font-semibold text-on-surface-variant hover:bg-surface-container-high">Cancel</Link>
              <button form="edit-attraction-form" type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-on-primary hover:shadow-lg">
                <Icon name="save" />
                Save Changes
              </button>
            </div>
          </footer>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/20 bg-surface/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <Link href={`/operator/attractions/${id}`} className="flex-1 rounded-xl border border-primary px-5 py-3.5 text-center font-semibold text-primary">
            Discard
          </Link>
          <button form="edit-attraction-form" type="submit" className="flex-[2] rounded-xl bg-primary px-5 py-3.5 font-semibold text-on-primary shadow-lg">
            <Icon name="save" className="mr-2 align-middle" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
