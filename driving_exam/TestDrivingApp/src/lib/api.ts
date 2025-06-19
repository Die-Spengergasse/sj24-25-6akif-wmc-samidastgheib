import axios from 'axios';
import { Module } from '@/types/module';
import { Topic } from '@/types/topic';
import { Question } from '@/types/question';
import https from 'https';
import { ExamResponse } from '@/types/exam';

const API_BASE_URL = 'https://localhost:5443/api';

const api = axios.create({
  baseURL: 'https://localhost:5443/api',
  headers: {
    'accept': 'text/plain',
    'Content-Type': 'application/json',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export const getModules = async (): Promise<Module[]> => {
  try {
    const response = await api.get('/Modules');
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

export const getTopics = async (moduleId: string): Promise<Topic[]> => {
  try {
    const response = await api.get(`/Topics?assignedModule=${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

export const getQuestions = async (moduleGuid: string, topicGuid: string): Promise<Question[]> => {
  try {
    const response = await api.get(`/Questions?moduleGuid=${moduleGuid}&topicGuid=${topicGuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const getExamQuestions = async (moduleId: string, count: number = 20): Promise<Question[]> => {
  try {
    const response = await api.get(`/exam/${moduleId}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    return [];
  }
};

export async function checkAnswers(questionGuid: string, checkedAnswers: { guid: string; isChecked: boolean }[]): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/Questions/${questionGuid}/checkanswers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkedAnswers }),
  });

  if (!response.ok) {
    throw new Error('Failed to check answers');
  }

  return response.json();
}

export async function getRandomQuestions(count: number = 20): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/Questions/random?count=${count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch random questions');
  }

  return response.json();
}

export default api; 