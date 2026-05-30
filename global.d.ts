import {routing} from '@/i18n/routing';
import messages from '@/messages/ar.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
