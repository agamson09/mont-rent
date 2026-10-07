import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DreamDesk by Monis.rent — Interactive Workspace Designer in Bali',
  description:
    'Design your dream office setup in Bali. Choose your desk, ergonomic chair, 4K displays, and island essentials with real-time visual preview. Flexible weekly & monthly rentals with next-day villa delivery.',
  keywords: [
    'Bali office rental',
    'workspace equipment Bali',
    'standing desk rental Canggu',
    'ergonomic chair rental Ubud',
    'monitor rental Bali',
    'digital nomad setup',
    'Monis rent',
  ],
  openGraph: {
    title: 'DreamDesk by Monis.rent — Design & Rent Your Bali Workspace',
    description:
      'Interactive visual workspace designer for digital nomads in Bali. Customize your setup and rent in minutes.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Monis.rent DreamDesk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[#0A0D14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950`}
      >
        {children}
      </body>
    </html>
  );
}
