import { environment } from '../../environments/environment';
import { ICereal } from './cereal-types';

/** Display labels for the cereal table columns, in render order. */
export const CEREAL_TITLES = [
  'S.N',
  'Name',
  'Mfr',
  'Type',
  'Calories',
  'Protein',
  'Sodium',
  'Fiber',
  'Fat',
  'Sugar',
  'Potass',
  'Vitamins',
  'Shelf',
  'Weight',
  'Cups',
  'Rating',
  'Image',
  'Actions',
] as const;
export type CerealTitle = (typeof CEREAL_TITLES)[number];

/** Columns whose header should not trigger sorting and shouldn't appear as
 *  filter targets. Narrowed to `CerealTitle` so invalid values are rejected
 *  at compile time. */
export const NON_SORTABLE_TITLES: readonly CerealTitle[] = [
  'S.N',
  'Image',
  'Actions',
];

/** Cereal fields rendered as table cells / form inputs, aligned with
 *  `CEREAL_TITLES` (which has the extra leading 'S.N' and trailing
 *  'Actions' columns). */
export const CEREAL_FIELDS: readonly (keyof ICereal)[] = [
  'name',
  'mfr',
  'type',
  'calories',
  'protein',
  'sodium',
  'fiber',
  'fat',
  'sugar',
  'potass',
  'vitamins',
  'shelf',
  'weight',
  'cups',
  'rating',
  'image',
];

/** Fields whose value is a free-form string (the rest are numeric). */
export const TEXT_FIELDS: readonly (keyof ICereal)[] = ['name', 'mfr', 'type'];

export function isTextField(field: keyof ICereal): boolean {
  return TEXT_FIELDS.includes(field);
}

/**
 * Origin of the backend that serves uploaded images. Sourced from the
 * environment file so it can be overridden per build target instead of
 * being baked into the source.
 */
export const CEREAL_API_HOST = environment.apiHost;
