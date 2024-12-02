import React from 'react';
import Header from './Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow p-4'>{children}</main>
      <footer className='bg-gray-800 text-white text-center p-4'>
        © 2024 Quiz Time. All rights reserved.
      </footer>
    </div>
  );
}
