import type { VideoAnalysis } from '../types/analysis';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeVideo = async (file: File | string): Promise<string> => {
  const formData = new FormData();
  
  if (typeof file === 'string') {
    formData.append('youtube_url', file);
  } else {
    formData.append('file', file);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to analyze video');
    }
    
    return data.id;
  } catch (error: any) {
    console.error('Video analysis error:', error);
    throw new Error(error.message || 'Failed to analyze video');
  }
};

export const getAnalysisStatus = async (id: string): Promise<VideoAnalysis> => {
  const response = await fetch(`${API_BASE_URL}/analysis/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to get analysis status');
  }
  
  return data;
};