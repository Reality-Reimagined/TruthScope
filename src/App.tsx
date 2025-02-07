import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { AnalysisProgress } from './components/AnalysisProgress';
import { Brain, Video, BarChart, ChevronRight, Play } from 'lucide-react';
import type { AnalysisResult, VideoMetadata, VideoAnalysis, AnalysisState, ProcessingStep } from './types/analysis';
import { analyzeVideo, getAnalysisStatus } from './services/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { AnalysisReport } from "./components/AnalysisReport";

function App() {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<AnalysisState | null>(null);

  const initialSteps: ProcessingStep[] = [
    {
      step: "Upload Video",
      status: "in_progress",
      progress: 0
    },
    {
      step: "Process Video",
      status: "in_progress",
      progress: 0
    },
    {
      step: "Analyze Content",
      status: "in_progress",
      progress: 0
    }
  ];

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      const steps = [...initialSteps];
      steps[0].status = 'in_progress';
      
      setUploadState({
        status: 'uploading',
        progress: 0.1,
        message: 'Uploading video...',
        timestamp: new Date().toISOString(),
        steps: steps
      });

      const id = await analyzeVideo(file);
      setAnalysisId(id);
      setVideoMetadata({
        id,
        title: file.name,
        duration: 0,
        source: 'upload',
        url: URL.createObjectURL(file)
      });

      // Update steps for processing
      steps[0].status = 'complete';
      steps[0].progress = 1;
      steps[1].status = 'in_progress';
      
      // Start polling immediately
      const status = await getAnalysisStatus(id);
      setUploadState({
        ...status.state,
        steps: steps
      });
      setAnalysis(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload video';
      const failedSteps = initialSteps.map(step => ({
        ...step,
        status: 'error' as const,
        progress: 0
      }));
      
      setError(errorMessage);
      setUploadState({
        status: 'error',
        progress: 0,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        steps: failedSteps
      });
    }
  };

  const handleYoutubeUrl = async (url: string) => {
    try {
      setError(null);
      setUploadState({
        status: 'uploading',
        progress: 0.1,
        message: 'Processing YouTube URL...',
        timestamp: new Date().toISOString()
      });

      const id = await analyzeVideo(url);
      setAnalysisId(id);
      setVideoMetadata({
        id,
        title: 'YouTube Video',
        duration: 0,
        source: 'youtube',
        url: url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url
      });

      // Start polling for status immediately
      const status = await getAnalysisStatus(id);
      setUploadState(status.state);

    } catch (err) {
      console.error('YouTube analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze YouTube video';
      setError(errorMessage);
      setUploadState({
        status: 'error',
        progress: 0,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Update the polling useEffect
  useEffect(() => {
    let pollInterval: number;

    if (analysisId && (!analysis?.state.status || ['uploading', 'processing'].includes(analysis.state.status))) {
      pollInterval = window.setInterval(async () => {
        try {
          const status = await getAnalysisStatus(analysisId);
          setAnalysis(status);
          setUploadState(status.state);
          
          if (status.state.status === 'complete' || status.state.status === 'error') {
            clearInterval(pollInterval);
            if (status.state.status === 'error') {
              setError(status.state.message);
            }
          }
        } catch (err) {
          console.error('Error polling analysis status:', err);
          setError('Failed to get analysis status');
          clearInterval(pollInterval);
        }
      }, 1000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [analysisId, analysis?.state.status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Political Analysis AI
              </h1>
            </div>
            {videoMetadata && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setVideoMetadata(null);
                  setAnalysis(null);
                  setAnalysisId(null);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Start New Analysis
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!videoMetadata ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-gray-900 mb-6"
                >
                  Analyze Political Videos with AI
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
                >
                  Uncover hidden insights in political speeches and debates through advanced AI analysis of body language, facial expressions, and gestures.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center space-x-8 mb-12"
                >
                  {['Facial Analysis', 'Body Language', 'Gesture Recognition'].map((feature, index) => (
                    <div key={feature} className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <VideoUploader
                onFileUpload={handleFileUpload}
                onYoutubeUrl={handleYoutubeUrl}
                uploadState={uploadState ?? undefined}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Video className="w-6 h-6 mr-2 text-blue-600" />
                  {videoMetadata.title}
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {videoMetadata.source === 'youtube' ? (
                    <iframe
                      src={videoMetadata.url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoMetadata.url}
                      className="w-full h-full"
                      controls
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {analysis?.state.status !== 'complete' ? (
                  <AnalysisProgress state={analysis?.state} />
                ) : (
                  <Tabs defaultValue="realtime" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="realtime">Real-time Analysis</TabsTrigger>
                      <TabsTrigger value="report">Detailed Report</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="realtime">
                      <AnalysisResults
                        results={analysis.results || []}
                        currentTime={currentTime}
                      />
                    </TabsContent>
                    
                    <TabsContent value="report">
                      <AnalysisReport result={analysis.results?.[0]} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;