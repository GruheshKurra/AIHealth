import React, { useState } from 'react';
import { FlaskConical, Loader2, AlertCircle, Leaf, Droplets, ThermometerSun, Sprout, Settings, Scale, Dna, Microscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SoilAnalysis = () => {
  const [formData, setFormData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    texture: '',
    moisture: '',
    conductivity: '',
    location: '',
    cropType: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiProvider, setApiProvider] = useState('gemini');
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');

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

  const analyzeWithGemini = async (soilData) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this soil data and provide a comprehensive soil health assessment. Please structure your response as follows:

**Soil Health Summary:**
- Overall soil health rating (Excellent/Good/Fair/Poor)
- Key strengths and weaknesses
- Soil fertility status
- Overall recommendations

**Detailed Analysis:**

**pH Analysis:**
- Current pH level interpretation
- Impact on nutrient availability
- Specific recommendations for pH adjustment
- Suitable amendments (lime, sulfur, etc.)

**Nutrient Analysis:**
- Nitrogen (N) status and recommendations
- Phosphorus (P) status and recommendations  
- Potassium (K) status and recommendations
- Secondary and micronutrient considerations
- Fertilizer recommendations with specific NPK ratios

**Organic Matter Assessment:**
- Current organic matter status
- Impact on soil structure and fertility
- Recommendations for improvement
- Composting and organic amendment suggestions

**Physical Properties:**
- Soil texture analysis and implications
- Moisture retention characteristics
- Drainage and aeration assessment
- Tillage and cultivation recommendations

**Salinity Assessment:**
- Electrical conductivity interpretation
- Salt stress implications for crops
- Management strategies for saline soils
- Irrigation and drainage recommendations

**Crop Suitability:**
- Most suitable crops for current soil conditions
- Crops to avoid with current soil status
- Crop rotation recommendations
- Specific varieties recommended for soil type

**Fertilizer Program:**
- Immediate fertilizer needs
- Seasonal fertilizer schedule
- Organic vs synthetic fertilizer options
- Application methods and timing

**Soil Improvement Plan:**
- Short-term improvements (1-6 months)
- Medium-term improvements (6-12 months)
- Long-term soil building strategies (1-3 years)
- Monitoring and testing schedule

**Management Practices:**
- Irrigation management
- Tillage practices
- Cover crop recommendations
- Mulching strategies
- Erosion control measures

**Economic Considerations:**
- Cost-effective improvement strategies
- Expected yield improvements
- Return on investment for amendments
- Budget-friendly alternatives

Soil Data:
- pH: ${soilData.pH}
- Nitrogen: ${soilData.nitrogen} mg/kg
- Phosphorus: ${soilData.phosphorus} mg/kg
- Potassium: ${soilData.potassium} mg/kg
- Organic Matter: ${soilData.organicMatter}%
- Soil Texture: ${soilData.texture}
- Moisture: ${soilData.moisture}%
- Electrical Conductivity: ${soilData.conductivity} dS/m
- Location: ${soilData.location}
- Intended Crop: ${soilData.cropType}

Please provide specific, actionable recommendations based on these soil parameters. Include both immediate actions and long-term soil health strategies.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const analyzeWithOpenRouter = async (soilData) => {
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
              content: `Analyze this soil data and provide a comprehensive soil health assessment. Please structure your response as follows:

**Soil Health Summary:**
- Overall soil health rating (Excellent/Good/Fair/Poor)
- Key strengths and weaknesses
- Soil fertility status
- Overall recommendations

**Detailed Analysis:**

**pH Analysis:**
- Current pH level interpretation
- Impact on nutrient availability
- Specific recommendations for pH adjustment
- Suitable amendments (lime, sulfur, etc.)

**Nutrient Analysis:**
- Nitrogen (N) status and recommendations
- Phosphorus (P) status and recommendations  
- Potassium (K) status and recommendations
- Secondary and micronutrient considerations
- Fertilizer recommendations with specific NPK ratios

**Organic Matter Assessment:**
- Current organic matter status
- Impact on soil structure and fertility
- Recommendations for improvement
- Composting and organic amendment suggestions

**Physical Properties:**
- Soil texture analysis and implications
- Moisture retention characteristics
- Drainage and aeration assessment
- Tillage and cultivation recommendations

**Salinity Assessment:**
- Electrical conductivity interpretation
- Salt stress implications for crops
- Management strategies for saline soils
- Irrigation and drainage recommendations

**Crop Suitability:**
- Most suitable crops for current soil conditions
- Crops to avoid with current soil status
- Crop rotation recommendations
- Specific varieties recommended for soil type

**Fertilizer Program:**
- Immediate fertilizer needs
- Seasonal fertilizer schedule
- Organic vs synthetic fertilizer options
- Application methods and timing

**Soil Improvement Plan:**
- Short-term improvements (1-6 months)
- Medium-term improvements (6-12 months)
- Long-term soil building strategies (1-3 years)
- Monitoring and testing schedule

**Management Practices:**
- Irrigation management
- Tillage practices
- Cover crop recommendations
- Mulching strategies
- Erosion control measures

**Economic Considerations:**
- Cost-effective improvement strategies
- Expected yield improvements
- Return on investment for amendments
- Budget-friendly alternatives

Soil Data:
- pH: ${soilData.pH}
- Nitrogen: ${soilData.nitrogen} mg/kg
- Phosphorus: ${soilData.phosphorus} mg/kg
- Potassium: ${soilData.potassium} mg/kg
- Organic Matter: ${soilData.organicMatter}%
- Soil Texture: ${soilData.texture}
- Moisture: ${soilData.moisture}%
- Electrical Conductivity: ${soilData.conductivity} dS/m
- Location: ${soilData.location}
- Intended Crop: ${soilData.cropType}

Please provide specific, actionable recommendations based on these soil parameters. Include both immediate actions and long-term soil health strategies.`
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'organicMatter', 'texture', 'moisture', 'conductivity'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result;
      if (apiProvider === 'gemini') {
        result = await analyzeWithGemini(formData);
      } else {
        result = await analyzeWithOpenRouter(formData);
      }

      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pH: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      organicMatter: '',
      texture: '',
      moisture: '',
      conductivity: '',
      location: '',
      cropType: ''
    });
    setAnalysisResult(null);
    setError(null);
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
          <h1 className="text-4xl font-bold text-green-100 mb-4">Soil Health Analysis</h1>
          <p className="text-green-200 text-lg">Enter your soil test parameters for AI-powered analysis and recommendations</p>
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
                '🌱 Gemini 1.5 Flash - Optimized for agricultural analysis' :
                `🚀 ${openRouterModels.find(m => m.id === selectedModel)?.name} - Free AI model`
              }
            </span>
          </div>
        </div>

        {/* Soil Analysis Form */}
        <div className="bg-green-900/40 rounded-lg p-6 mb-8 ring-1 ring-green-800/50">
          <h3 className="text-xl font-semibold text-green-100 mb-6">Soil Test Parameters</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-green-200 text-sm block mb-2">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Maharashtra, India"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Intended Crop (Optional)</label>
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  placeholder="e.g., Wheat, Rice, Tomato"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Chemical Properties */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-green-200 text-sm block mb-2">pH Level *</label>
                <input
                  type="number"
                  name="pH"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.pH}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Electrical Conductivity (dS/m) *</label>
                <input
                  type="number"
                  name="conductivity"
                  step="0.1"
                  value={formData.conductivity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.2"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Nutrient Content */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-green-200 text-sm block mb-2">Nitrogen (mg/kg) *</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  placeholder="e.g., 140"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Phosphorus (mg/kg) *</label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  placeholder="e.g., 22"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Potassium (mg/kg) *</label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  placeholder="e.g., 180"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Physical Properties */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-green-200 text-sm block mb-2">Organic Matter (%) *</label>
                <input
                  type="number"
                  name="organicMatter"
                  step="0.1"
                  value={formData.organicMatter}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.2"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Soil Texture *</label>
                <select
                  name="texture"
                  value={formData.texture}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select texture</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Silt">Silt</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Silty Clay">Silty Clay</option>
                  <option value="Sandy Clay">Sandy Clay</option>
                </select>
              </div>

              <div>
                <label className="text-green-200 text-sm block mb-2">Moisture Content (%) *</label>
                <input
                  type="number"
                  name="moisture"
                  step="0.1"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-5 h-5" />
                    <span>Analyze Soil</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                <span>Reset Form</span>
              </button>
            </div>
          </form>
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
              <FlaskConical className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-green-100">Soil Analysis Results</h3>
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
            <Scale className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">pH & Salinity</h4>
            <p className="text-green-300 text-sm">Acidity and salt analysis</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Dna className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Nutrient Profile</h4>
            <p className="text-green-300 text-sm">NPK and organic matter</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Sprout className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Crop Recommendations</h4>
            <p className="text-green-300 text-sm">Suitable crops for soil</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50 text-center">
            <Leaf className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Improvement Plan</h4>
            <p className="text-green-300 text-sm">Soil health strategies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
