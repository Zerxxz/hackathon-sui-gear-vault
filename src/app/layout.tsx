import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sui Gear Vault - Cross-Game Inventory System',
  description: 'Decentralized inventory system for gaming items on Sui blockchain with Walrus storage',
  keywords: ['Sui', 'NFT', 'Gaming', 'Inventory', 'Walrus', 'Blockchain'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#050508]">
        {children}
      </body>
    </html>
  );
}