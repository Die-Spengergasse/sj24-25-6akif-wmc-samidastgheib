import React from 'react';
import { getTopics } from '@/lib/api';
import TopicCard from '@/components/TopicCard';

interface TopicsPageProps {
  params: {
    moduleId: string;
  };
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const topics = await getTopics(params.moduleId);

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Topics Available</h1>
        <p className="text-gray-600">This module has no topics yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Topics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.guid} topic={topic} moduleId={params.moduleId} />
        ))}
      </div>
    </div>
  );
} 