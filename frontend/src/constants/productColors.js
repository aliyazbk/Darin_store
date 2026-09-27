// Single source of truth for color names across the admin.
// VariantForm and ImageUploadForm both read from this list so a
// variant's color and an image's color can never drift apart
// (e.g. "Blue" vs "blue" vs "Bleu").
export const PRODUCT_COLORS = [
  "Black",
  "White",
  "Beige",
  "Brown",
  "Grey",
  "Navy",
  "Red",
  "Green",
  "Blue",
  "Pink",
  "Yellow",
  "Multicolor",
];
