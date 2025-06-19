'use client';

import React, { useState, useEffect } from 'react';
import { getModules, getTopics, getQuestions, checkAnswers } from '@/lib/api';
import { Module } from '@/types/module';
import { Topic } from '@/types/topic';
import { Question } from '@/types/question';
import { ExamQuestion } from '@/types/exam';
import ExamQuestionCard from '@/components/ExamQuestionCard';

function getRandomSample<T>(arr: T[], n: number): T[] {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

export default function MeinePruefungenPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<(ExamQuestion & { topicName: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCorrect, setTotalCorrect] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const mods = await getModules();
        setModules(mods);
      } catch {
        setError("Failed to load modules");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    setQuestions([]);
    setLoading(true);
    try {
      const tpcs = await getTopics(module.guid);
      setTopics(tpcs);
      
      // Get questions from all topics
      const allQuestions: (Question & { topicName: string })[] = [];
      for (const topic of tpcs) {
        const topicQuestions = await getQuestions(module.guid, topic.guid);
        allQuestions.push(...topicQuestions.map(q => ({ ...q, topicName: topic.name })));
      }
      
      // Randomly select 20 questions
      const sample = getRandomSample(allQuestions, Math.min(20, allQuestions.length)).map((q) => ({
        ...q,
        selectedAnswers: [],
        isChecked: false,
        isCorrect: false,
      }));
      
      setQuestions(sample);
      setTotalCorrect(0);
    } catch {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerGuid: string) => {
    setQuestions((prev) => {
      return prev.map((q, idx) => {
        if (idx !== questionIndex) return q;
        const isSelected = q.selectedAnswers.includes(answerGuid);
        return {
          ...q,
          selectedAnswers: isSelected
            ? q.selectedAnswers.filter((id) => id !== answerGuid)
            : [...q.selectedAnswers, answerGuid],
        };
      });
    });
  };

  const checkQuestion = async (questionIndex: number) => {
    const question = questions[questionIndex];
    const checkedAnswers = question.answers.map((answer) => ({
      guid: answer.guid,
      isChecked: question.selectedAnswers.includes(answer.guid),
    }));
    try {
      const result = await checkAnswers(question.guid, checkedAnswers);
      const answerResults: Record<string, boolean> = result.checkResult;
      const isCorrect = Object.values(answerResults).every((v) => v);
      setQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = {
          ...updated[questionIndex],
          isChecked: true,
          isCorrect,
          answerResults,
        };
        return updated;
      });
      if (isCorrect) {
        setTotalCorrect((prev) => prev + 1);
      }
    } catch {
      setError("Failed to check answers");
    }
  };

  const checkAllQuestions = async () => {
    setLoading(true);
    try {
      let correctCount = 0;
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const checkedAnswers = question.answers.map((answer) => ({
          guid: answer.guid,
          isChecked: question.selectedAnswers.includes(answer.guid),
        }));
        const result = await checkAnswers(question.guid, checkedAnswers);
        const answerResults: Record<string, boolean> = result.checkResult;
        const isCorrect = Object.values(answerResults).every((v) => v);
        setQuestions((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            isChecked: true,
            isCorrect,
            answerResults,
          };
          return updated;
        });
        if (isCorrect) {
          correctCount++;
        }
      }
      setTotalCorrect(correctCount);
      // --- AUTO SAVE LOGIC ---
      const examResult = {
        id: Math.random().toString(36).substr(2, 9) + Date.now(),
        date: new Date().toLocaleString(),
        module: selectedModule?.name,
        moduleId: selectedModule?.guid,
        score: correctCount,
        total: questions.length,
        questions: questions.map(q => ({
          question: q.text,
          topic: q.topicName,
          selectedAnswers: q.selectedAnswers,
          correctAnswers: q.answers.filter(a => a.isCorrect).map(a => a.guid),
          isCorrect: q.isCorrect,
          points: q.points,
        })),
      };
      const prevResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      localStorage.setItem('examResults', JSON.stringify([examResult, ...prevResults]));
      // --- END AUTO SAVE LOGIC ---
    } catch {
      setError("Failed to check answers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Meine Prüfungen</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}
      
      {!selectedModule && !loading && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Wähle ein Modul:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <button
                key={mod.guid}
                className="p-4 bg-white rounded shadow hover:bg-blue-100"
                onClick={() => handleModuleSelect(mod)}
              >
                {mod.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedModule && questions.length > 0 && !loading && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Prüfung: {selectedModule.name}</h2>
            <div className="text-lg">Richtige Antworten: {totalCorrect} / {questions.length}</div>
          </div>
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.guid}>
                <div className="text-sm text-gray-600 mb-2">
                  {selectedModule.name} / {question.topicName}
                </div>
                <ExamQuestionCard
                  question={question}
                  onAnswerSelect={(answerGuid) => handleAnswerSelect(index, answerGuid)}
                />
                {!question.isChecked && (
                  <button
                    onClick={() => checkQuestion(index)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Prüfen
                  </button>
                )}
              </div>
            ))}
            {questions.some(q => !q.isChecked) && (
              <div className="mt-8 text-center">
                <button
                  onClick={checkAllQuestions}
                  className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-lg font-semibold"
                >
                  Prüfen Alles
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 