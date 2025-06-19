import React from 'react';
import Image from 'next/image';
import { ExamQuestion } from '@/types/exam';

interface ExamQuestionCardProps {
  question: ExamQuestion;
  onAnswerSelect: (answerGuid: string) => void;
}

export default function ExamQuestionCard({ question, onAnswerSelect }: ExamQuestionCardProps) {
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
        {question.answers.map((answer) => {
          const isSelected = question.selectedAnswers.includes(answer.guid);
          let answerColor = 'bg-gray-50 hover:bg-gray-100';
          if (question.isChecked && question.answerResults) {
            if (question.answerResults[answer.guid] === true) answerColor = 'bg-green-100';
            else if (question.answerResults[answer.guid] === false) answerColor = 'bg-red-100';
          }
          return (
            <label
              key={answer.guid}
              className={`flex items-center p-3 rounded ${answerColor} transition-colors cursor-pointer`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onAnswerSelect(answer.guid)}
                className="mr-3"
                disabled={question.isChecked}
              />
              <span>{answer.text}</span>
            </label>
          );
        })}
      </div>

      {question.isChecked && (
        <div className={`mt-4 p-3 rounded ${question.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          {question.isCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
} 