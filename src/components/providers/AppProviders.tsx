"use client";

import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { DataProvider } from '@/context/DataContext';
import { realtimeService } from '@/lib/realtime';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch((error) => console.error('SW registration failed', error));
    }

    const unsubscribe = realtimeService.subscribe((update) => {
      toast(update.message, {
        duration: 4000,
        position: 'bottom-right'
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DataProvider>
      {children}
      <Toaster
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff'
          }
        }}
      />
    </DataProvider>
  );
};
