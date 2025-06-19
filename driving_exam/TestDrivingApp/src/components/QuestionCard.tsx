import React from 'react';
import Image from 'next/image';
import { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
  showAnswer?: boolean;
}

export default function QuestionCard({ question, showAnswer = false }: QuestionCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{question.text}</h3>
        <span className="text-sm text-gray-500">Points: {question.points}</span>
      </div>
      
      {question.imageUrl && question.imageUrl !== 'string' && (
        <div className="mb-4 relative w-full h-48">
          <Image
            src={question.imageUrl}
            alt="Question illustration"
            fill
            className="object-contain rounded"
            unoptimized
          />
        </div>
      )}

      <div className="space-y-2">
        {question.answers.map((answer) => (
          <div
            key={answer.guid}
            className="p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {answer.text}
          </div>
        ))}
      </div>
    </div>
  );
} 