import { CareerAnalysisResult, CareerProfileInput, LearningRoadmap } from '../types';

export async function analyzeCareerAPI(profile: CareerProfileInput): Promise<CareerAnalysisResult> {
  const response = await fetch('/api/analyze-career', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function generateRoadmapAPI(profile: CareerProfileInput, targetRole?: string): Promise<LearningRoadmap> {
  const response = await fetch('/api/generate-roadmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile, targetRole }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{ status: string; aiConfigured: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Health check failed', e);
  }
  return { status: 'offline', aiConfigured: false };
}
