import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types/analysis';
import { Activity, ThumbsUp, AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  currentTime: number;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, currentTime }) => {
  const currentResult = results.find(r => 
    Math.abs(r.timestamp - currentTime) < 1
  ) || results[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
      
      {currentResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-blue-500 mr-3" />
              <span className="font-medium">Overall Emotion</span>
            </div>
            <span className="text-lg">{currentResult.overallEmotion}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-medium mb-2">Facial Expression</h3>
              <p>{currentResult.facialExpression.emotion}</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${currentResult.facialExpression.confidence * 100}%` }}
                />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-medium mb-2">Body Posture</h3>
              <p>{currentResult.bodyPosture.posture}</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${currentResult.bodyPosture.confidence * 100}%` }}
                />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-medium mb-2">Hand Gestures</h3>
              <p>{currentResult.handGestures.gesture}</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 rounded-full h-2"
                  style={{ width: `${currentResult.handGestures.confidence * 100}%` }}
                />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
              <span>Confidence Score: {(currentResult.confidenceScore * 100).toFixed(1)}%</span>
            </div>
            <span className="text-sm text-gray-500">
              Timestamp: {new Date(currentResult.timestamp * 1000).toISOString().substr(14, 5)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};