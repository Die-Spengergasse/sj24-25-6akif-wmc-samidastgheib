import React from 'react';
import { getQuestions } from '@/lib/api';
import QuestionCard from '@/components/QuestionCard';

interface QuestionsPageProps {
  params: {
    moduleId: string;
    topicId: string;
  };
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const questions = await getQuestions(params.moduleId, params.topicId);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Questions Available</h1>
        <p className="text-gray-600">This topic has no questions yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Questions</h1>
      <div className="space-y-6">
        {questions.map((question) => (
          <QuestionCard key={question.guid} question={question} />
        ))}
      </div>
    </div>
  );
} 