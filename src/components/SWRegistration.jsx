'use client';

import { useEffect } from 'react';

export default function SWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
        console.log('SW registrado:', reg.scope);
      }).catch((err) => {
        console.warn('Fallo registro SW:', err);
      });
    }
  }, []);
  return null;
}
