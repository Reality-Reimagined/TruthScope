import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Youtube } from 'lucide-react';
import { AnalysisState } from '../types/analysis';

interface VideoUploaderProps {
  onFileUpload: (file: File) => void;
  onYoutubeUrl: (url: string) => void;
  uploadState?: AnalysisState;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileUpload, onYoutubeUrl, uploadState }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    disabled: uploadState?.status === 'uploading' || uploadState?.status === 'processing'
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${uploadState?.status === 'processing' ? 'bg-blue-50' : ''}
            ${uploadState?.status === 'complete' ? 'bg-green-50' : ''}
            ${uploadState?.status === 'error' ? 'bg-red-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={uploadState?.status || 'default'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {uploadState?.status === 'processing' || uploadState?.status === 'uploading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
                />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
              )}
              
              <p className="text-sm text-gray-600 text-center">
                {uploadState?.status === 'uploading' ? 'Uploading video...' :
                 uploadState?.status === 'processing' ? 'Processing video...' :
                 uploadState?.status === 'error' ? uploadState.message :
                 'Drop your video here or click to browse'}
              </p>

              {(uploadState?.status === 'uploading' || uploadState?.status === 'processing') && (
                <motion.div 
                  className="w-full max-w-md h-2 bg-gray-200 rounded-full mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadState.progress * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* YouTube URL Input */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Youtube className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Or paste a YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={uploadState?.status === 'uploading' || uploadState?.status === 'processing'}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onYoutubeUrl(youtubeUrl)}
              disabled={!youtubeUrl || uploadState?.status === 'uploading' || uploadState?.status === 'processing'}
              className={`mt-3 w-full py-3 px-4 rounded-lg font-medium
                ${youtubeUrl ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Analyze YouTube Video
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};