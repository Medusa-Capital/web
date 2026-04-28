// Augment ImportMeta with Bun's `main` flag so `if (import.meta.main)`
// type-checks without per-call casts. Bun sets this to true when a script
// is the entrypoint; Next.js builds run under tsc which doesn't ship Bun
// types, so we add the augmentation manually.

interface ImportMeta {
  readonly main: boolean;
}
