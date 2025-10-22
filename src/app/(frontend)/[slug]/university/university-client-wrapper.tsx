'use client';

import dynamic from 'next/dynamic';

const ClientHomePage = dynamic(() => import('./client-page'), {
  ssr: false,
});

export function UniversityClientWrapper() {
  return <ClientHomePage />;
}
