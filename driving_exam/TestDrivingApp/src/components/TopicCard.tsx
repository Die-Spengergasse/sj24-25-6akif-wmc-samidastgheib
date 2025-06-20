import React from 'react';
import Link from 'next/link';
import { Topic } from '@/types/topic';

interface TopicCardProps {
  topic: Topic;
  moduleId: string;
}

export default function TopicCard({ topic, moduleId }: TopicCardProps) {
  return (
    <Link href={`/modules/${moduleId}/topics/${topic.guid}/questions`}>
      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{topic.name}</h2>
        <p className="text-gray-600">{topic.questionCount} questions</p>
      </div>
    </Link>
  );
} 