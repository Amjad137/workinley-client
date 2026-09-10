import { Plus_Jakarta_Sans } from 'next/font/google';

export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

// Backward-compatibility alias
export const poppins = fontSans;
