import { ReactNode } from "react";

export type ProcessingStep = {
  step: string;
  status: 'complete' | 'in_progress' | 'error';
  progress: number;
};

export interface AnalysisState {
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
  timestamp: string;
  steps?: ProcessingStep[];
}

export interface AnalysisDetail {
  emotion: string;
  confidence: number;
  description: string;
  posture?: string;
  gesture?: string;
}

export interface AnalysisResult {
  timestamp: number;
  facialExpression: AnalysisDetail;
  bodyPosture: AnalysisDetail;
  handGestures: AnalysisDetail;
  overallEmotion: string;
  confidenceScore: number;
}

export interface VideoAnalysis {
  id: string;
  state: AnalysisState;
  results: AnalysisResult[] | null;
}

export interface VideoMetadata {
  id: string;
  title: string;
  duration: number;
  source: 'upload' | 'youtube';
  url: string;
}