import { ReactNode } from "react";

export type ProcessingStep = {
  step: string;
  status: 'complete' | 'in_progress' | 'error' | 'pending';
  progress: number;
  message?: string;
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
  intensity?: number;
  context?: string;
  timeMarkers?: string[];
  truthfulnessScore?: number;
}

export interface DeceptionIndicator {
  type: string;
  description: string;
  confidence: number;
  timestamp: number;
}

export interface ConfidenceMetric {
  level: number;
  description: string;
  context: string;
  timestamp: number;
}

export interface QuestionResponse {
  responseStyle: string;
  topicHandling: string;
  behavioralPatterns: string[];
}

export interface TimelineEvent {
  timestamp: number;
  description: string;
}

export interface AnalysisResult {
  timestamp: number;
  facialExpression: AnalysisDetail;
  bodyPosture: AnalysisDetail;
  handGestures: AnalysisDetail;
  overallEmotion: string;
  confidenceScore: number;
  analysis: string;
  deceptionIndicators?: DeceptionIndicator[];
  confidenceMetrics?: ConfidenceMetric[];
  keyMoments?: {
    timestamp: number;
    description: string;
    significance: string;
  }[];
  questionResponse: QuestionResponse;
  timeline: TimelineEvent[];
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

// import { ReactNode } from "react";

// export type ProcessingStep = {
//   step: string;
//   status: 'complete' | 'in_progress' | 'error';
//   progress: number;
// };

// export interface AnalysisState {
//   status: 'uploading' | 'processing' | 'complete' | 'error';
//   progress: number;
//   message: string;
//   timestamp: string;
//   steps?: ProcessingStep[];
// }

// export interface AnalysisDetail {
//   emotion: string;
//   confidence: number;
//   description: string;
//   posture?: string;
//   gesture?: string;
// }

// export interface AnalysisResult {
//   timestamp: number;
//   facialExpression: AnalysisDetail;
//   bodyPosture: AnalysisDetail;
//   handGestures: AnalysisDetail;
//   overallEmotion: string;
//   confidenceScore: number;
// }

// export interface VideoAnalysis {
//   id: string;
//   state: AnalysisState;
//   results: AnalysisResult[] | null;
// }

// export interface VideoMetadata {
//   id: string;
//   title: string;
//   duration: number;
//   source: 'upload' | 'youtube';
//   url: string;
// }