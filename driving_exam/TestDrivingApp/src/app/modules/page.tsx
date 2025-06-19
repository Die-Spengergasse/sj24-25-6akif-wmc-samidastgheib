import React from 'react';
import { getModules } from '@/lib/api';
import ModuleCard from '@/components/ModuleCard';

export default async function ModulesPage() {
  const modules = await getModules();

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Modules Available</h1>
        <p className="text-gray-600">Please check back later for new content.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.guid} module={module} />
        ))}
      </div>
    </div>
  );
} 