'use client';

import dynamic from 'next/dynamic';

const ClientHomePage = dynamic(() => import('./client-page'), {
  ssr: false,
});

export default function DallasHome() {
  return <ClientHomePage />;
}