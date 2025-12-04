import { useTranslations } from 'next-intl';

// Type helper for translation keys
export type TranslationKeys = Parameters<ReturnType<typeof useTranslations>>[0];

// Re-export commonly used i18n hooks and utilities
export { useTranslations, useLocale, useMessages } from 'next-intl';
export { Link } from '@/i18n/navigation';
