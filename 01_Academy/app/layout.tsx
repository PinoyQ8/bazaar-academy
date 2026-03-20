import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react'; // MESH-SYNC: Restoring the Adjudicator Eye
import './globals.css'; // MESH-SYNC: This enables Tailwind styles

export const metadata: Metadata = {
  other: {
    // MESH LOGIC: Insert your new 128-character Pi verification string between the quotes below.
    'pi-verification': 'fafed6bec731367e22b77c3b621438af71bb2d488269da66b5b991305bf9c390dc5db9264e514d2127632c4bccdc55938978d47d05c4ad9e3b31c02a63ec25ff' 
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Secondary SDK Shield */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body style={{ margin: 0, background: 'black' }}>
        {children}
        <Analytics /> {/* The Eye of the Adjudicator */}
      </body>
    </html>
  );
}