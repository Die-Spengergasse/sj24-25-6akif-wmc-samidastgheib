import React from 'react';
import { getExamQuestions } from '@/lib/api';
import QuestionCard from '@/components/QuestionCard';

interface ExamPageProps {
  params: {
    moduleId: string;
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const questions = await getExamQuestions(params.moduleId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Exam</h1>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.guid}>
            <h2 className="text-lg font-semibold mb-4">Question {index + 1}</h2>
            <QuestionCard question={question} />
          </div>
        ))}
      </div>
    </div>
  );
} 