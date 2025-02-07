import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader, X, AlertCircle } from 'lucide-react';
import { ProcessingStep } from '../types/analysis';

interface AnalysisProgressProps {
  state?: {
    status: string;
    progress: number;
    message: string;
    steps?: ProcessingStep[];
  };
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ state }) => {
  if (!state?.steps) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Analysis Progress</h2>
        <p className="text-gray-600">{state.message}</p>
      </div>

      <div className="space-y-6">
        {state.steps.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center mb-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mr-3
                ${step.status === 'complete' ? 'bg-green-100' : 
                  step.status === 'in_progress' ? 'bg-blue-100' : 
                  step.status === 'error' ? 'bg-red-100' : 'bg-gray-100'}
              `}>
                {step.status === 'complete' && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                {step.status === 'in_progress' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-4 h-4 text-blue-600" />
                  </motion.div>
                )}
                {step.status === 'error' && (
                  <X className="w-4 h-4 text-red-600" />
                )}
                {step.status === 'pending' && (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${
                    step.status === 'complete' ? 'text-green-600' :
                    step.status === 'in_progress' ? 'text-blue-600' :
                    step.status === 'error' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {step.step}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(step.progress * 100)}%
                  </span>
                </div>

                <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      step.status === 'complete' ? 'bg-green-500' :
                      step.status === 'in_progress' ? 'bg-blue-500' :
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {index < state.steps.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
            )}
          </motion.div>
        ))}
      </div>

      {state.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};



// import React from 'react';
// import { motion } from 'framer-motion';
// import { Check, Loader, X } from 'lucide-react';
// import { ProcessingStep } from '../types/analysis';

// interface AnalysisProgressProps {
//   steps: ProcessingStep[];
// }

// export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps = [] }) => {
//   if (!steps || steps.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-4">
//       {steps.map((step, index) => (
//         <div key={step.step} className="flex items-center">
//           <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3">
//             {step.status === 'complete' && (
//               <Check className="w-4 h-4 text-green-500" />
//             )}
//             {step.status === 'in_progress' && (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               >
//                 <Loader className="w-4 h-4 text-blue-500" />
//               </motion.div>
//             )}
//             {step.status === 'error' && (
//               <X className="w-4 h-4 text-red-500" />
//             )}
//           </div>
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-1">
//               <span className="font-medium">{step.step}</span>
//               <span className="text-sm text-gray-500">
//                 {Math.round(step.progress * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <motion.div
//                 className="bg-blue-500 rounded-full h-2"
//                 initial={{ width: 0 }}
//                 animate={{ width: `${step.progress * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };