'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('role') === 'admin');
    }
    // Listen for changes to localStorage (other tabs) and custom authChanged event (same tab)
    const handleStorage = () => {
      setIsAdmin(localStorage.getItem('role') === 'admin');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChanged', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChanged', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    setIsAdmin(false);
    window.dispatchEvent(new Event('authChanged'));
    router.push('/modules');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Driving Exam App</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/modules" className="text-gray-700 hover:text-gray-900">
              Modules
            </Link>
            <Link href="/meine-pruefungen" className="text-gray-700 hover:text-gray-900">
              Prüfung erstellen
            </Link>
            <Link href="/admin/add-question" className="text-gray-700 hover:text-gray-900">
              Frage hinzufügen (Admin)
            </Link>
            <Link href="/show-pruefungen" className="text-gray-700 hover:text-gray-900">
              Meine Prüfungen
            </Link>
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
              >
                Abmelden
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 