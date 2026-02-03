import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SimSai Institute Portal',
  description: 'Upload and verify student work.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
