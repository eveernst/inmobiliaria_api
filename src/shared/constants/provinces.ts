// Provinces covered by the AAC (requirement 14). Keep identical to the
// frontend's province select.
export const PROVINCES = ['Córdoba', 'Santa Fe', 'Entre Ríos'] as const;

export type Province = (typeof PROVINCES)[number];
