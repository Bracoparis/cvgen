// Re-export types from cv.ts
export * from './cv';

// Add Section type (needed in App.tsx)
export type Section = 'personal' | 'experience' | 'education' | 'skills' | 'preview'; 