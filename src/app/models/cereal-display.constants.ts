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
 *  filter targets. Kept as `readonly string[]` so it can be used with
 *  `Array.prototype.includes` without TypeScript narrowing complaints. */
export const NON_SORTABLE_TITLES: readonly string[] = ['S.N', 'Image', 'Actions'];

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
export const TEXT_FIELDS: readonly string[] = ['name', 'mfr', 'type'];

/**
 * Determines whether a cereal property is treated as a free-form text field.
 *
 * @param field - The cereal property name to check
 * @returns `true` if the field is one of the configured text fields (`'name'`, `'mfr'`, `'type'`), `false` otherwise.
 */
export function isTextField(field: keyof ICereal | string): boolean {
  return TEXT_FIELDS.includes(String(field));
}

/** Origin of the backend that serves uploaded images. */
export const CEREAL_API_HOST = 'http://localhost:4300';
