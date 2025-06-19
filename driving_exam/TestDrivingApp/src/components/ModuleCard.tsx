import React from 'react';
import Link from 'next/link';
import { Module } from '@/types/module';

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={`/modules/${module.guid}/topics`}>
      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{module.name}</h2>
        <p className="text-gray-600">Module {module.number}</p>
      </div>
    </Link>
  );
} 