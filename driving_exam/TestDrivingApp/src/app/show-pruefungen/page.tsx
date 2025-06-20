'use client';
import React, { useEffect, useState } from 'react';

interface ExamResult {
  id: string;
  date: string;
  module?: string;
  moduleId?: string;
  score: number;
  total: number;
  questions: {
    question: string;
    topic?: string;
    selectedAnswers: string[];
    correctAnswers: string[];
    isCorrect: boolean;
    points: number;
  }[];
}

export default function ShowPruefungenPage() {
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamResult | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('examResults');
    if (data) {
      setExams(JSON.parse(data));
    }
  }, []);

  if (selectedExam) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button className="mb-4 text-blue-500" onClick={() => setSelectedExam(null)}>&larr; Zurück</button>
        <h2 className="text-xl font-bold mb-2">Prüfung vom {selectedExam.date}</h2>
        <div className="mb-2">Modul: {selectedExam.module}</div>
        <div className="mb-2">Punkte: {selectedExam.score} / {selectedExam.total}</div>
        <ul className="space-y-2">
          {selectedExam.questions.map((q, i) => (
            <li key={i} className={`p-2 rounded ${q.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <div><b>Frage:</b> {q.question}</div>
              {q.topic && <div><b>Thema:</b> {q.topic}</div>}
              <div><b>Deine Antwort(en):</b> {q.selectedAnswers.join(', ')}</div>
              <div><b>Korrekte Antwort(en):</b> {q.correctAnswers.join(', ')}</div>
              <div><b>Punkte:</b> {q.points}</div>
              <div><b>{q.isCorrect ? 'Richtig' : 'Falsch'}</b></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Alle Prüfungen</h1>
      {exams.length === 0 ? (
        <div>Keine Prüfungen gefunden.</div>
      ) : (
        <ul className="space-y-2">
          {exams.map((exam) => (
            <li key={exam.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100" onClick={() => setSelectedExam(exam)}>
              <div><b>Datum:</b> {exam.date}</div>
              <div><b>Modul:</b> {exam.module}</div>
              <div><b>Punkte:</b> {exam.score} / {exam.total}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 