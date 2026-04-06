/**
 * Flags live in `public/assets/` and should be referenced by URL directly.
 *
 * `import.meta.glob()` is not reliable for `public/` in Vite builds, and can
 * lead to "missing" images (showing as gray placeholders) depending on env.
 */
export function getFlagSrc(team: string) {
  // Some team names contain special chars (e.g. "curaçao").
  return encodeURI(`/assets/icon-${team}.svg`);
}