import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader, X } from 'lucide-react';
import { ProcessingStep } from '../types/analysis';

interface AnalysisProgressProps {
  steps: ProcessingStep[];
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps = [] }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.step} className="flex items-center">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3">
            {step.status === 'complete' && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {step.status === 'in_progress' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-4 h-4 text-blue-500" />
              </motion.div>
            )}
            {step.status === 'error' && (
              <X className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{step.step}</span>
              <span className="text-sm text-gray-500">
                {Math.round(step.progress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${step.progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};