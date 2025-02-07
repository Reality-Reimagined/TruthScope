import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, Clock, ThumbsUp } from 'lucide-react';
import { AnalysisResult } from '../types/analysis';

interface AnalysisReportProps {
  result?: AnalysisResult;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FileText className="w-6 h-6 mr-2 text-blue-600" />
        Analysis Report
      </h2>

      <div className="space-y-6">
        {/* Overall Summary */}
        <section className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            Overall Analysis
          </h3>
          <p className="text-gray-700">{result.overallEmotion}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Confidence: {(result.confidenceScore * 100).toFixed(1)}%
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facial Analysis */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Facial Expression Analysis</h4>
            <p className="text-gray-700 mb-2">{result.facialExpression.description}</p>
            <div className="text-sm text-gray-500">
              Primary Emotion: {result.facialExpression.emotion}
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${result.facialExpression.confidence * 100}%` }}
                />
              </div>
            </div>
          </section>

          {/* Body Language */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Body Language Analysis</h4>
            <p className="text-gray-700 mb-2">{result.bodyPosture.description}</p>
            <div className="text-sm text-gray-500">
              Posture: {result.bodyPosture.posture}
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${result.bodyPosture.confidence * 100}%` }}
                />
              </div>
            </div>
          </section>

          {/* Gestures */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Gesture Analysis</h4>
            <p className="text-gray-700 mb-2">{result.handGestures.description}</p>
            <div className="text-sm text-gray-500">
              Gesture Type: {result.handGestures.gesture}
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 rounded-full h-2"
                  style={{ width: `${result.handGestures.confidence * 100}%` }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}; 