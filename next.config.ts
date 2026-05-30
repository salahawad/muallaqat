import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

// With no argument the plugin defaults to './i18n/request.ts'.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
