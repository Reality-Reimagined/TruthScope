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

export interface KeyStrength {
  title: string;
  description: string;
  confidence: number;
}

export interface AreaOfNote {
  title: string;
  description: string;
  significance: string;
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

// New interface for capturing which question affected the speaker's mood
export interface QuestionImpact {
  question: string;      // The text or summary of the question.
  timestamp: number;     // When the question occurred.
  moodChange: string;    // e.g., "nervous", "confident", "neutral"
  analysis?: string;     // Optional explanation of why this question had an effect.
  confidence?: number;   // Optional confidence score for this observation.
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
  keyStrengths: KeyStrength[];
  areasOfNote: AreaOfNote[];
  questionResponse: QuestionResponse;
  timeline: TimelineEvent[];
  questionImpacts?: QuestionImpact[];  // New field added here
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




// export type ProcessingStep = {
//   step: string;
//   status: 'complete' | 'in_progress' | 'error' | 'pending';
//   progress: number;
//   message?: string;
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
//   intensity?: number;
//   context?: string;
//   timeMarkers?: string[];
//   truthfulnessScore?: number;
// }

// export interface DeceptionIndicator {
//   type: string;
//   description: string;
//   confidence: number;
//   timestamp: number;
// }

// export interface ConfidenceMetric {
//   level: number;
//   description: string;
//   context: string;
//   timestamp: number;
// }

// export interface KeyStrength {
//   title: string;
//   description: string;
//   confidence: number;
// }

// export interface AreaOfNote {
//   title: string;
//   description: string;
//   significance: string;
// }

// export interface QuestionResponse {
//   responseStyle: string;
//   topicHandling: string;
//   behavioralPatterns: string[];
// }

// export interface TimelineEvent {
//   timestamp: number;
//   description: string;
// }

// export interface AnalysisResult {
//   timestamp: number;
//   facialExpression: AnalysisDetail;
//   bodyPosture: AnalysisDetail;
//   handGestures: AnalysisDetail;
//   overallEmotion: string;
//   confidenceScore: number;
//   analysis: string;
//   deceptionIndicators?: DeceptionIndicator[];
//   confidenceMetrics?: ConfidenceMetric[];
//   keyStrengths: KeyStrength[];
//   areasOfNote: AreaOfNote[];
//   questionResponse: QuestionResponse;
//   timeline: TimelineEvent[];
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

// import { ReactNode } from "react";

// export type ProcessingStep = {
//   step: string;
//   status: 'complete' | 'in_progress' | 'error' | 'pending';
//   progress: number;
//   message?: string;
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
//   intensity?: number;
//   context?: string;
//   timeMarkers?: string[];
//   truthfulnessScore?: number;
// }

// export interface DeceptionIndicator {
//   type: string;
//   description: string;
//   confidence: number;
//   timestamp: number;
// }

// export interface ConfidenceMetric {
//   level: number;
//   description: string;
//   context: string;
//   timestamp: number;
// }

// export interface QuestionResponse {
//   responseStyle: string;
//   topicHandling: string;
//   behavioralPatterns: string[];
// }

// export interface TimelineEvent {
//   timestamp: number;
//   description: string;
// }

// export interface AnalysisResult {
//   timestamp: number;
//   facialExpression: AnalysisDetail;
//   bodyPosture: AnalysisDetail;
//   handGestures: AnalysisDetail;
//   overallEmotion: string;
//   confidenceScore: number;
//   analysis: string;
//   deceptionIndicators?: DeceptionIndicator[];
//   confidenceMetrics?: ConfidenceMetric[];
//   keyMoments?: {
//     timestamp: number;
//     description: string;
//     significance: string;
//   }[];
//   questionResponse: QuestionResponse;
//   timeline: TimelineEvent[];
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