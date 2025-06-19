import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddModulePage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      if (role !== 'admin') {
        router.replace('/modules');
      }
    }
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Module</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Module creation form will be implemented here. This feature is coming soon!
        </p>
      </div>
    </div>
  );
} 