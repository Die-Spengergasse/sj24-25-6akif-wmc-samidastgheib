'use client';

import React, { useState, useEffect } from 'react';
import { getModules, getTopics } from '@/lib/api';
import { Module } from '@/types/module';
import { Topic } from '@/types/topic';
import { useRouter } from 'next/navigation';

interface Answer {
  text: string;
  isCorrect: boolean;
}

export default function AddQuestionPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Module form state
  const [moduleNumber, setModuleNumber] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  
  // Topic form state
  const [topicName, setTopicName] = useState('');
  const [showTopicForm, setShowTopicForm] = useState(false);
  
  // Question form state
  const [questionNumber, setQuestionNumber] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [points, setPoints] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);

  const loadModules = async () => {
    setLoading(true);
    try {
      const mods = await getModules();
      setModules(mods);
    } catch {
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (moduleGuid: string) => {
    setLoading(true);
    try {
      const tpcs = await getTopics(moduleGuid);
      setTopics(tpcs);
    } catch {
      setError("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        setIsAdmin(true);
        loadModules();
      } else {
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('role', 'admin');
      setIsAdmin(true);
      setLoginError('');
      window.dispatchEvent(new Event('authChanged'));
      loadModules();
    } else {
      setLoginError('Invalid credentials');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 w-64">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login as Admin</button>
          {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
        </form>
      </div>
    );
  }

  // Step 1: Add/select module
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://localhost:5443/api/Modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: parseInt(moduleNumber),
          name: moduleName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add module');
      }

      const result = await response.json();
      await loadModules();
      setModuleNumber('');
      setModuleName('');
      setShowModuleForm(false);
      // Auto-select the new module
      setSelectedModule({ guid: result.guid, number: parseInt(moduleNumber), name: moduleName });
      loadTopics(result.guid);
    } catch (err) {
      setError("Failed to add module");
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = (mod: Module) => {
    setSelectedModule(mod);
    setSelectedTopic(null);
    loadTopics(mod.guid);
  };

  // Step 2: Add/select topic
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) {
      setError("Please select a module first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:5443/api/Topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: topicName,
          moduleGuid: selectedModule.guid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add topic');
      }

      const result = await response.json();
      await loadTopics(selectedModule.guid);
      setTopicName('');
      setShowTopicForm(false);
      // Auto-select the new topic
      setSelectedTopic({ guid: result.guid, name: topicName, questionCount: 0 });
    } catch (err) {
      setError("Failed to add topic");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  // Step 3: Add question
  const handleAnswerChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule || !selectedTopic) {
      setError("Please select both module and topic");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:5443/api/Questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: parseInt(questionNumber),
          text: questionText,
          points: parseInt(points),
          moduleGuid: selectedModule.guid,
          topicGuid: selectedTopic.guid,
          imageUrl: imageUrl || 'string',
          answers: answers.filter(a => a.text.trim() !== '')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      const result = await response.json();
      
      // Redirect to the questions page
      router.push(`/modules/${selectedModule.guid}/topics/${selectedTopic.guid}/questions`);
    } catch (err) {
      setError("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Question</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {/* Step 1: Select/Add Module */}
      {!selectedModule && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Select Module:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {modules.map((mod) => (
              <button
                key={mod.guid}
                className="px-4 py-2 bg-white rounded shadow hover:bg-blue-100 border border-gray-200"
                onClick={() => handleModuleSelect(mod)}
              >
                {mod.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {showModuleForm ? 'Hide Add Module Form' : 'Add New Module'}
          </button>
          {showModuleForm && (
            <form onSubmit={handleAddModule} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-lg font-semibold mb-4">Add New Module</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Number</label>
                  <input
                    type="number"
                    value={moduleNumber}
                    onChange={(e) => setModuleNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Name</label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Module
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 2: Select/Add Topic */}
      {selectedModule && !selectedTopic && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Select Topic for {selectedModule.name}:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {topics.map((topic) => (
              <button
                key={topic.guid}
                className="px-4 py-2 bg-white rounded shadow hover:bg-blue-100 border border-gray-200"
                onClick={() => handleTopicSelect(topic)}
              >
                {topic.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowTopicForm(!showTopicForm)}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {showTopicForm ? 'Hide Add Topic Form' : 'Add New Topic'}
          </button>
          {showTopicForm && (
            <form onSubmit={handleAddTopic} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-lg font-semibold mb-4">Add New Topic to {selectedModule.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic Name</label>
                  <input
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Topic
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 3: Add Question */}
      {selectedModule && selectedTopic && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question Number</label>
            <input
              type="number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Question Text</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answers</label>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Correct</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              Add Question
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 