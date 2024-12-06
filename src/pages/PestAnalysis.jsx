import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, Upload, Camera, AlertCircle, Loader2, 
  Microscope, Shield, Sprout, Droplets, 
  ThermometerSun, Timer, Skull, Ruler
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const Progress = ({ value = 0, className = '' }) => {
  return (
    <div className={`w-full bg-green-900/50 rounded-full h-2.5 ${className}`}>
      <div 
        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const LoadingOverlay = ({ progress }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-green-950/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-green-900/90 rounded-lg p-8 shadow-xl flex flex-col items-center max-w-md w-full mx-4"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-green-400/20">
          <Loader2 className="w-16 h-16 text-green-400 animate-spin absolute inset-0" />
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-green-100">Analyzing pest image...</p>
      <p className="mt-2 text-sm text-green-400">This may take a few moments</p>
      <div className="w-full mt-6">
        <Progress value={progress} className="h-2" />
        <p className="text-center mt-2 text-sm text-green-400">{progress}%</p>
      </div>
    </motion.div>
  </motion.div>
);

const PestAnalysisResult = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-6 ring-1 ring-green-800/50">
          <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center">
            <Microscope className="w-6 h-6 mr-2" />
            Pest Identification
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-green-200">
              <Bug className="w-5 h-5 text-green-400" />
              <span className="font-medium">{data.pestName}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-green-200">
              <Skull className="w-5 h-5 text-green-400" />
              <span>Threat Level: {data.threatLevel}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Characteristics</h3>
              <p className="text-green-100">{data.characteristics}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Behavior</h3>
              <p className="text-green-100">{data.behavior}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Life Cycle</h3>
              <p className="text-green-100">{data.lifeCycle}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-6 ring-1 ring-green-800/50">
          <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center">
            <Sprout className="w-6 h-6 mr-2" />
            Damage Assessment
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Symptoms</h3>
              <ul className="list-disc list-inside text-green-100 space-y-2">
                {data.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Affected Plant Parts</h3>
              <p className="text-green-100">{data.affectedParts}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-green-300 font-medium">Spread Pattern</h3>
              <p className="text-green-100">{data.spreadPattern}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-6 ring-1 ring-green-800/50">
          <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Treatment Options
          </h2>
          
          <div className="space-y-6">
            {data.treatments.map((treatment, index) => (
              <div key={index} className="bg-green-800/20 rounded-lg p-4">
                <h3 className="text-green-300 font-medium mb-2">{treatment.name}</h3>
                <div className="space-y-3">
                  <p className="text-green-100">{treatment.description}</p>
                  
                  <div className="flex items-center space-x-2 text-green-200">
                    <Droplets className="w-4 h-4" />
                    <span>Dosage: {treatment.dosage}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-green-200">
                    <Timer className="w-4 h-4" />
                    <span>Frequency: {treatment.frequency}</span>
                  </div>
                  
                  {treatment.precautions && (
                    <div className="bg-yellow-900/20 rounded p-3">
                      <div className="flex items-center space-x-2 text-yellow-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Precautions</span>
                      </div>
                      <p className="text-yellow-200 text-sm mt-1">{treatment.precautions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-6 ring-1 ring-green-800/50">
          <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center">
            <ThermometerSun className="w-6 h-6 mr-2" />
            Prevention Measures
          </h2>
          
          <div className="space-y-4">
            <ul className="list-disc list-inside text-green-100 space-y-2">
              {data.preventionMeasures.map((measure, index) => (
                <li key={index}>{measure}</li>
              ))}
            </ul>
          </div>
          
          {data.naturalEnemies && (
            <div className="mt-6">
              <h3 className="text-green-300 font-medium mb-2">Natural Enemies</h3>
              <ul className="list-disc list-inside text-green-100 space-y-2">
                {data.naturalEnemies.map((enemy, index) => (
                  <li key={index}>{enemy}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ImageUploader = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-8 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageSelect}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center">
          <Bug className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold text-green-300 mb-2">
            Pest Identification
          </h2>
          <p className="text-green-200 mb-6">
            Upload a clear image of the pest or affected plant part for analysis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Image</span>
            </button>
            
            <button
              onClick={() => toast.info('Camera feature coming soon!')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>
          </div>
          
          <p className="text-sm text-green-400">
            Supports JPG, PNG or JPEG (max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
};

const PestAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const analyzePest = async (imageFile) => {
    if (!imageFile) {
      toast.error('Please select an image file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          setProgress(20);
          toast.info('Processing image...');
          const base64Image = reader.result.split(',')[1];
          
          setProgress(40);
          const prompt = `Analyze this image and provide detailed pest identification and treatment information in the following JSON format:
          {
            "pestName": "Common and scientific name",
            "threatLevel": "Low/Medium/High",
            "characteristics": "Detailed physical description",
            "behavior": "Pest behavior patterns",
            "lifeCycle": "Life cycle information",
            "symptoms": ["List of damage symptoms"],
            "affectedParts": "Plant parts affected",
            "spreadPattern": "How the pest spreads",
            "treatments": [
              {
                "name": "Treatment name",
                "description": "Treatment description",
                "dosage": "Application dosage",
                "frequency": "Application frequency",
                "precautions": "Safety precautions"
              }
            ],
            "preventionMeasures": ["List of prevention measures"],
            "naturalEnemies": ["List of natural predators or enemies"]
          }`;

          setProgress(60);
          toast.info('Analyzing pest characteristics...');

          const response = await fetch(
            'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyCyozrcOfWc4Q4fLCfJFtc5-lF5VTcwmOQ',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  role: "user",
                  parts: [
                    { text: prompt },
                    { inlineData: { mimeType: imageFile.type, data: base64Image } }
                  ]
                }],
                generationConfig: {
                  temperature: 0.4,
                  topK: 32,
                  topP: 1,
                  maxOutputTokens: 2048
                }
              })
            }
          );

          if (!response.ok) throw new Error('Failed to analyze image');

          setProgress(80);
          toast.info('Generating analysis report...');

          const data = await response.json();
          const analysisText = data.candidates[0]?.content?.parts[0]?.text || '';
          
          try {
            const jsonStart = analysisText.indexOf('{');
            const jsonEnd = analysisText.lastIndexOf('}') + 1;
            const jsonStr = analysisText.slice(jsonStart, jsonEnd);
            const analysisData = JSON.parse(jsonStr);
            setAnalysisResult(analysisData);
            setProgress(100);
            toast.success('Analysis complete!');
          } catch (parseError) {
            throw new Error('Failed to parse analysis results');
          }

        } catch (err) {
          throw new Error('Failed to analyze the image');
        }
      };

      reader.onerror = () => {
        throw new Error('Failed to read the image file');
      };

      reader.readAsDataURL(imageFile);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      analyzePest(file);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors closeButton />
      
      <AnimatePresence>
        {isLoading && <LoadingOverlay progress={progress} />}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />

        {error && (
          <div className="flex items-center justify-center">
            <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {analysisResult && !isLoading && (
          <PestAnalysisResult data={analysisResult} />
        )}
      </div>
    </div>
  );
};

export default PestAnalysis;