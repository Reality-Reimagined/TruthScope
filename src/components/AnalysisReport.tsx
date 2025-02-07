import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, Clock, ThumbsUp, AlertTriangle, BarChart2, MessageCircle } from 'lucide-react';
import { AnalysisResult } from '../types/analysis';

interface AnalysisReportProps {
  result?: AnalysisResult;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  if (!result) return null;

  const confidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
    >
      {/* Overall Analysis Summary */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Political Communication Analysis
        </h2>
        <p className="text-gray-600 text-lg">{result.analysis}</p>
      </div>

      {/* Key Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Key Strengths</h3>
          <ul className="list-disc list-inside text-blue-700">
            <li>Consistent message delivery</li>
            <li>Strong emotional control</li>
            <li>Effective use of gestures</li>
          </ul>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Areas of Note</h3>
          <ul className="list-disc list-inside text-yellow-700">
            <li>Micro-expressions during key topics</li>
            <li>Posture shifts in responses</li>
            <li>Gesture patterns in challenges</li>
          </ul>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facial Expression Analysis */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            Facial Expression Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Primary Emotion</span>
                <span className="text-sm text-gray-500">
                  {(result.facialExpression.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                {result.facialExpression.emotion}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Detailed Observations</h4>
              <p className="text-gray-700">{result.facialExpression.description}</p>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`${confidenceColor(result.facialExpression.confidence)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${result.facialExpression.confidence * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Body Language Analysis */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
            Body Language Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Posture Type</span>
                <span className="text-sm text-gray-500">
                  {(result.bodyPosture.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                {result.bodyPosture.posture || result.bodyPosture.emotion}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interpretation</h4>
              <p className="text-gray-700">{result.bodyPosture.description}</p>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`${confidenceColor(result.bodyPosture.confidence)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${result.bodyPosture.confidence * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Hand Gestures Analysis */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Hand Gestures Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Gesture Type</span>
                <span className="text-sm text-gray-500">
                  {(result.handGestures.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                {result.handGestures.gesture || result.handGestures.emotion}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Meaning & Context</h4>
              <p className="text-gray-700">{result.handGestures.description}</p>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`${confidenceColor(result.handGestures.confidence)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${result.handGestures.confidence * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Overall Analysis */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
            Overall Assessment
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Emotional State</span>
                <span className="text-sm text-gray-500">
                  {(result.confidenceScore * 100).toFixed(1)}% confidence
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                {result.overallEmotion}
              </div>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`${confidenceColor(result.confidenceScore)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${result.confidenceScore * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* New Question Response Analysis Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-6 md:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-indigo-500" />
            Question Response Analysis
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Response Style</h4>
                <p className="text-gray-700">Direct and assertive when discussing policy, more defensive on personal questions</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Topic Handling</h4>
                <p className="text-gray-700">Strong command of economic topics, less fluid on foreign policy details</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Behavioral Patterns</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Increased hand gestures during challenging questions</li>
                <li>Maintained eye contact during direct responses</li>
                <li>Slight posture shifts when addressing controversial topics</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline of Key Moments */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Key Moments Timeline</h3>
        <div className="space-y-4">
          {[0, 1, 2].map((moment) => (
            <div key={moment} className="flex items-start">
              <div className="w-16 text-sm text-gray-500">
                {moment}:00
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700">Notable behavioral shift during discussion of [Topic]</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FileText, Brain, Clock, ThumbsUp, AlertTriangle, BarChart2, MessageCircle } from 'lucide-react';
// import { AnalysisResult } from '../types/analysis';

// interface AnalysisReportProps {
//   result?: AnalysisResult;
// }

// export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
//   if (!result) return null;

//   const confidenceColor = (score: number) => {
//     if (score >= 0.8) return 'bg-green-500';
//     if (score >= 0.6) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
//     >
//       {/* Overall Analysis Summary */}
//       <div className="border-b pb-6 mb-6">
//         <h2 className="text-2xl font-bold mb-4 flex items-center">
//           <FileText className="w-6 h-6 mr-2 text-blue-600" />
//           Political Communication Analysis
//         </h2>
//         <p className="text-gray-600 text-lg">{result.analysis}</p>
//       </div>

//       {/* Key Findings Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-blue-50 rounded-lg p-4">
//           <h3 className="font-semibold text-blue-800 mb-2">Key Strengths</h3>
//           <ul className="list-disc list-inside text-blue-700">
//             <li>Consistent message delivery</li>
//             <li>Strong emotional control</li>
//             <li>Effective use of gestures</li>
//           </ul>
//         </div>
//         <div className="bg-yellow-50 rounded-lg p-4">
//           <h3 className="font-semibold text-yellow-800 mb-2">Areas of Note</h3>
//           <ul className="list-disc list-inside text-yellow-700">
//             <li>Micro-expressions during key topics</li>
//             <li>Posture shifts in responses</li>
//             <li>Gesture patterns in challenges</li>
//           </ul>
//         </div>
//       </div>

//       {/* Detailed Analysis Sections */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Facial Expression Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <Brain className="w-5 h-5 mr-2 text-blue-500" />
//             Facial Expression Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Primary Emotion</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.facialExpression.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.facialExpression.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Detailed Observations</h4>
//               <p className="text-gray-700">{result.facialExpression.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.facialExpression.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.facialExpression.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Body Language Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
//             Body Language Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Posture Type</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.bodyPosture.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.bodyPosture.posture || result.bodyPosture.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Interpretation</h4>
//               <p className="text-gray-700">{result.bodyPosture.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.bodyPosture.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.bodyPosture.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Hand Gestures Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
//             Hand Gestures Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Gesture Type</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.handGestures.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.handGestures.gesture || result.handGestures.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Meaning & Context</h4>
//               <p className="text-gray-700">{result.handGestures.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.handGestures.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.handGestures.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Overall Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
//             Overall Assessment
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Emotional State</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.confidenceScore * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.overallEmotion}
//               </div>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.confidenceScore)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.confidenceScore * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* New Question Response Analysis Section */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6 md:col-span-2"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <MessageCircle className="w-5 h-5 mr-2 text-indigo-500" />
//             Question Response Analysis
//           </h3>
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <h4 className="font-medium text-gray-900 mb-2">Response Style</h4>
//                 <p className="text-gray-700">Direct and assertive when discussing policy, more defensive on personal questions</p>
//               </div>
//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <h4 className="font-medium text-gray-900 mb-2">Topic Handling</h4>
//                 <p className="text-gray-700">Strong command of economic topics, less fluid on foreign policy details</p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg p-4 border border-gray-200">
//               <h4 className="font-medium text-gray-900 mb-2">Behavioral Patterns</h4>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li>Increased hand gestures during challenging questions</li>
//                 <li>Maintained eye contact during direct responses</li>
//                 <li>Slight posture shifts when addressing controversial topics</li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Timeline of Key Moments */}
//       <div className="mt-8 border-t pt-6">
//         <h3 className="text-lg font-semibold mb-4">Key Moments Timeline</h3>
//         <div className="space-y-4">
//           {[0, 1, 2].map((moment) => (
//             <div key={moment} className="flex items-start">
//               <div className="w-16 text-sm text-gray-500">
//                 {moment}:00
//               </div>
//               <div className="flex-1 bg-gray-50 rounded-lg p-3">
//                 <p className="text-gray-700">Notable behavioral shift during discussion of [Topic]</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// };



// import React from 'react';
// import { motion } from 'framer-motion';
// import { FileText, Brain, Clock, ThumbsUp, AlertTriangle, BarChart2 } from 'lucide-react';
// import { AnalysisResult } from '../types/analysis';

// interface AnalysisReportProps {
//   result?: AnalysisResult;
// }

// export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
//   if (!result) return null;

//   const confidenceColor = (score: number) => {
//     if (score >= 0.8) return 'bg-green-500';
//     if (score >= 0.6) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-lg shadow-lg p-6"
//     >
//       <div className="border-b pb-6 mb-6">
//         <h2 className="text-2xl font-bold mb-4 flex items-center">
//           <FileText className="w-6 h-6 mr-2 text-blue-600" />
//           Detailed Analysis Report
//         </h2>
//         <p className="text-gray-600">{result.analysis}</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Facial Expression Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <Brain className="w-5 h-5 mr-2 text-blue-500" />
//             Facial Expression Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Primary Emotion</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.facialExpression.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.facialExpression.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Detailed Observations</h4>
//               <p className="text-gray-700">{result.facialExpression.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.facialExpression.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.facialExpression.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Body Language Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
//             Body Language Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Posture Type</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.bodyPosture.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.bodyPosture.posture || result.bodyPosture.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Interpretation</h4>
//               <p className="text-gray-700">{result.bodyPosture.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.bodyPosture.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.bodyPosture.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Hand Gestures Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
//             Hand Gestures Analysis
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Gesture Type</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.handGestures.confidence * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.handGestures.gesture || result.handGestures.emotion}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium mb-2">Meaning & Context</h4>
//               <p className="text-gray-700">{result.handGestures.description}</p>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.handGestures.confidence)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.handGestures.confidence * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>

//         {/* Overall Analysis */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           className="bg-gray-50 rounded-lg p-6"
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
//             Overall Assessment
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Emotional State</span>
//                 <span className="text-sm text-gray-500">
//                   {(result.confidenceScore * 100).toFixed(1)}% confidence
//                 </span>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-gray-200">
//                 {result.overallEmotion}
//               </div>
//             </div>
//             <div className="mt-2 bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`${confidenceColor(result.confidenceScore)} h-2 rounded-full transition-all duration-500`}
//                 style={{ width: `${result.confidenceScore * 100}%` }}
//               />
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };


// import React from 'react';
// import { motion } from 'framer-motion';
// import { FileText, Brain, Clock, ThumbsUp } from 'lucide-react';
// import { AnalysisResult } from '../types/analysis';

// interface AnalysisReportProps {
//   result?: AnalysisResult;
// }

// export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
//   if (!result) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-lg shadow-lg p-6"
//     >
//       <h2 className="text-2xl font-bold mb-6 flex items-center">
//         <FileText className="w-6 h-6 mr-2 text-blue-600" />
//         Analysis Report
//       </h2>

//       <div className="space-y-6">
//         {/* Overall Summary */}
//         <section className="border-b pb-4">
//           <h3 className="text-lg font-semibold mb-2 flex items-center">
//             <Brain className="w-5 h-5 mr-2 text-blue-500" />
//             Overall Analysis
//           </h3>
//           <p className="text-gray-700">{result.overallEmotion}</p>
//           <div className="mt-2 flex items-center text-sm text-gray-500">
//             <ThumbsUp className="w-4 h-4 mr-1" />
//             Confidence: {(result.confidenceScore * 100).toFixed(1)}%
//           </div>
//         </section>

//         {/* Detailed Sections */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Facial Analysis */}
//           <section className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Facial Expression Analysis</h4>
//             <p className="text-gray-700 mb-2">{result.facialExpression.description}</p>
//             <div className="text-sm text-gray-500">
//               Primary Emotion: {result.facialExpression.emotion}
//               <div className="mt-1 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-green-500 rounded-full h-2"
//                   style={{ width: `${result.facialExpression.confidence * 100}%` }}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Body Language */}
//           <section className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Body Language Analysis</h4>
//             <p className="text-gray-700 mb-2">{result.bodyPosture.description}</p>
//             <div className="text-sm text-gray-500">
//               Posture: {result.bodyPosture.posture}
//               <div className="mt-1 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-blue-500 rounded-full h-2"
//                   style={{ width: `${result.bodyPosture.confidence * 100}%` }}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Gestures */}
//           <section className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Gesture Analysis</h4>
//             <p className="text-gray-700 mb-2">{result.handGestures.description}</p>
//             <div className="text-sm text-gray-500">
//               Gesture Type: {result.handGestures.gesture}
//               <div className="mt-1 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-purple-500 rounded-full h-2"
//                   style={{ width: `${result.handGestures.confidence * 100}%` }}
//                 />
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </motion.div>
//   );
// }; 