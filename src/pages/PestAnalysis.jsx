import React, { useState, useRef } from 'react';
import { Upload, Loader2, Camera, AlertCircle, Bug, Shield, Droplets, Sun, Settings, Microscope, Skull, Timer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PestAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiProvider, setApiProvider] = useState('gemini');
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const openRouterModels = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash Experimental' },
    { id: 'qwen/qwen2.5-vl-72b-instruct:free', name: 'Qwen2.5 VL 72B' },
    { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 11B Vision' },
    { id: 'qwen/qwen2.5-vl-32b-instruct:free', name: 'Qwen2.5 VL 32B' },
    { id: 'moonshotai/kimi-vl-a3b-thinking:free', name: 'Kimi VL A3B Thinking' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B' },
    { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B' },
    { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2 24B' }
  ];

  const analyzeWithGemini = async (imageBase64) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this image for pest identification and provide a comprehensive assessment. Please structure your response as follows:

**Pest Identification:**
- Pest name/species (if identifiable)
- Common name and scientific name
- Pest category (insect, mite, nematode, etc.)
- Life stage visible (egg, larva, adult, etc.)

**Physical Characteristics:**
- Size and appearance
- Color and markings
- Body structure
- Distinctive features

**Threat Assessment:**
- Threat level (Low/Moderate/High/Severe)
- Confidence level (%)
- Potential damage severity
- Economic impact

**Damage Analysis:**
- Type of damage caused
- Affected plant parts
- Feeding behavior
- Damage symptoms to look for

**Host Plants:**
- Primary host plants
- Secondary host plants
- Crop preferences
- Seasonal preferences

**Life Cycle & Behavior:**
- Life cycle duration
- Breeding patterns
- Activity periods
- Environmental preferences

**Control Methods:**
- Immediate action needed
- Biological control options
- Chemical control recommendations
- Organic/natural treatments
- IPM (Integrated Pest Management) approach

**Prevention Strategies:**
- Cultural practices
- Monitoring techniques
- Early detection methods
- Resistant varieties
- Environmental management

**Treatment Recommendations:**
- Specific pesticides/insecticides
- Application methods
- Dosage and frequency
- Safety precautions
- Re-application schedule

Please be specific and practical in your recommendations. If you're uncertain about identification, please mention alternative possibilities and confidence levels.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const analyzeWithOpenRouter = async (imageBase64) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image for pest identification and provide a comprehensive assessment. Please structure your response as follows:

**Pest Identification:**
- Pest name/species (if identifiable)
- Common name and scientific name
- Pest category (insect, mite, nematode, etc.)
- Life stage visible (egg, larva, adult, etc.)

**Physical Characteristics:**
- Size and appearance
- Color and markings
- Body structure
- Distinctive features

**Threat Assessment:**
- Threat level (Low/Moderate/High/Severe)
- Confidence level (%)
- Potential damage severity
- Economic impact

**Damage Analysis:**
- Type of damage caused
- Affected plant parts
- Feeding behavior
- Damage symptoms to look for

**Host Plants:**
- Primary host plants
- Secondary host plants
- Crop preferences
- Seasonal preferences

**Life Cycle & Behavior:**
- Life cycle duration
- Breeding patterns
- Activity periods
- Environmental preferences

**Control Methods:**
- Immediate action needed
- Biological control options
- Chemical control recommendations
- Organic/natural treatments
- IPM (Integrated Pest Management) approach

**Prevention Strategies:**
- Cultural practices
- Monitoring techniques
- Early detection methods
- Resistant varieties
- Environmental management

**Treatment Recommendations:**
- Specific pesticides/insecticides
- Application methods
- Dosage and frequency
- Safety precautions
- Re-application schedule

Please be specific and practical in your recommendations. If you're uncertain about identification, please mention alternative possibilities and confidence levels.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenRouter analysis failed: ${error.message}`);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1];

        try {
          let result;
          if (apiProvider === 'gemini') {
            result = await analyzeWithGemini(base64);
          } else {
            result = await analyzeWithOpenRouter(base64);
          }

          setAnalysisResult(result);
        } catch (error) {
          console.error('Analysis error:', error);
          setError(`Analysis failed: ${error.message}`);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Image processing error:', error);
      setError('Failed to process image');
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      setError('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(blob => {
      const file = new File([blob], 'pest-photo.jpg', { type: 'image/jpeg' });
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      stopCamera();
    }, 'image/jpeg', 0.8);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const MarkdownRenderer = ({ content }) => {
    return (
      <div className="prose prose-invert prose-green max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-green-200 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-green-300 mb-3 mt-6">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-green-300 mb-2 mt-4">{children}</h3>,
            p: ({ children }) => <p className="text-green-100 mb-3 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-none space-y-2 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-green-100">{children}</ol>,
            li: ({ children }) => (
              <li className="text-green-100 flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>{children}</span>
              </li>
            ),
            strong: ({ children }) => <strong className="text-green-200 font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-green-300 italic">{children}</em>,
            code: ({ children }) => (
              <code className="bg-green-800/30 text-green-200 px-2 py-1 rounded text-sm">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-green-800/20 text-green-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-green-500 pl-4 italic text-green-200 mb-4">{children}</blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-green-700">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-green-800/30">{children}</thead>,
            th: ({ children }) => (
              <th className="border border-green-700 px-4 py-2 text-left text-green-200 font-semibold">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border border-green-700 px-4 py-2 text-green-100">{children}</td>
            ),
            hr: () => <hr className="border-green-700 my-6" />,
            a: ({ href, children }) => (
              <a href={href} className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-100 mb-4">Pest Identification & Analysis</h1>
          <p className="text-green-200 text-lg">Upload a pest photo for AI-powered identification and control recommendations</p>
        </div>

        {/* API Provider Selector */}
        <div className="bg-green-900/40 rounded-lg p-6 mb-8 ring-1 ring-green-800/50">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-green-400" />
              <label className="text-green-200 font-medium">AI Provider:</label>
              <select
                value={apiProvider}
                onChange={(e) => setApiProvider(e.target.value)}
                className="px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>

            {apiProvider === 'openrouter' && (
              <div className="flex items-center space-x-4">
                <label className="text-green-200 font-medium">Model:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                >
                  {openRouterModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-green-300 text-sm">
              {apiProvider === 'gemini' ?
                '🔬 Gemini 1.5 Flash - Optimized for pest identification' :
                `🚀 ${openRouterModels.find(m => m.id === selectedModel)?.name} - Free vision model`
              }
            </span>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-green-900/90 rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-100">Capture Pest Photo</h3>
                <button
                  onClick={stopCamera}
                  className="text-green-400 hover:text-green-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={capturePhoto}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-green-900/40 rounded-lg p-6 mb-8 ring-1 ring-green-800/50">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <h3 className="text-xl font-semibold text-green-100 mb-4">Upload Pest Image</h3>

              <div className="border-2 border-dashed border-green-800/50 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-green-400" />
                  </div>

                  <div>
                    <p className="text-green-200 mb-2">Upload or capture a pest photo</p>
                    <p className="text-green-400 text-sm">Supports JPG, PNG (max 10MB)</p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </button>

                    <button
                      onClick={startCamera}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Use Camera</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div>
              <h3 className="text-xl font-semibold text-green-100 mb-4">Image Preview</h3>

              <div className="bg-green-800/20 rounded-lg p-4 h-64 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Pest preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center text-green-400">
                    <Bug className="w-12 h-12 mx-auto mb-2" />
                    <p>No image selected</p>
                  </div>
                )}
              </div>

              {selectedImage && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bug className="w-5 h-5 mr-2" />
                        Identify Pest
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetAnalysis}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/40 rounded-lg p-4 mb-8 ring-1 ring-red-800/50">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
            <div className="flex items-center space-x-2 mb-4">
              <Bug className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-green-100">Pest Analysis Results</h3>
            </div>

            <div className="bg-green-800/20 rounded-lg p-6">
              <MarkdownRenderer content={analysisResult} />
            </div>

            <div className="mt-4 flex justify-center">
              <span className="text-green-300 text-sm">
                Powered by {apiProvider === 'gemini' ?
                  'Google Gemini 1.5 Flash' :
                  `OpenRouter - ${openRouterModels.find(m => m.id === selectedModel)?.name}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Microscope className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Pest Identification</h4>
            <p className="text-green-300 text-sm">Identify pest species</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Skull className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Threat Assessment</h4>
            <p className="text-green-300 text-sm">Evaluate damage potential</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Control Methods</h4>
            <p className="text-green-300 text-sm">Treatment recommendations</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Timer className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Prevention Tips</h4>
            <p className="text-green-300 text-sm">Avoid future infestations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestAnalysis;
