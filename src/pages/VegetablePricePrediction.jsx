import React, { useState } from 'react';
import { TrendingUp, Search, Loader2, AlertCircle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PredictionCard = ({ title, price, change, description }) => (
  <div className="bg-green-900/40 p-4 rounded-lg ring-1 ring-green-800/50">
    <h3 className="text-green-300 text-sm mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-bold text-green-100">₹{price}</p>
        <p className="text-sm text-green-400">{description}</p>
      </div>
      {change !== undefined && (
        <div className={`flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  </div>
);

const VegetablePricePrediction = () => {
  const [formData, setFormData] = useState({
    vegetable: '',
    location: '',
    timeframe: '1'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  const vegetables = [
    'Tomato', 'Potato', 'Onion', 'Carrot', 'Cauliflower', 'Cabbage',
    'Brinjal', 'Okra', 'Peas', 'Spinach', 'Cucumber', 'Green Chili'
  ];

  const timeframes = [
    { value: '1', label: '1 Week' },
    { value: '2', label: '2 Weeks' },
    { value: '4', label: '1 Month' },
    { value: '12', label: '3 Months' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const callOpenRouter = async (prompt) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error('OpenRouter API key not configured. Make sure VITE_OPENROUTER_API_KEY is set in .env file');
    }

    // Try multiple free models for better reliability
    const models = [
      'microsoft/mai-ds-r1:free',
      'deepseek/deepseek-chat:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemini-2.0-flash-exp:free'
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'FarmCare Price Prediction',
            'HTTP-Referer': window.location.origin,
            'User-Agent': 'FarmCare/1.0'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert agricultural economist with deep knowledge of vegetable markets, weather patterns, supply chains, and regional farming conditions. Analyze real market factors and provide genuine price predictions. Consider current season, weather impacts, transportation costs, regional supply/demand, farming cycles, and economic conditions. Respond with ONLY a JSON object - no markdown, no explanations, just pure JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Model ${model} failed: ${response.status} - ${errorText}`);
          continue; // Try next model
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.warn(`Model ${model} returned invalid response structure`);
          continue; // Try next model
        }

        console.log(`Successfully got AI prediction from: ${model}`);
        return data.choices[0].message.content;

      } catch (error) {
        console.warn(`Model ${model} error:`, error.message);
        continue; // Try next model
      }
    }

    // If all models fail, throw error (no fallback to mock data)
    throw new Error('All AI models are currently unavailable. Please check your API key or try again later.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vegetable || !formData.location) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const timeframeLabel = timeframes.find(t => t.value === formData.timeframe)?.label || '1 Week';

      const prompt = `Analyze and predict the price of ${formData.vegetable} in ${formData.location} for the next ${timeframeLabel}. 
      
      Consider current market conditions, seasonal factors, regional trends, weather patterns, supply chain issues, and economic factors.
      
      Respond with ONLY a JSON object with these fields:
      - currentPrice: current market price per kg in INR
      - predictedPrice: your predicted price per kg in INR  
      - change: percentage change (positive or negative)
      - confidence: your confidence level (High/Medium/Low)
      - factors: array of 3-4 specific market factors affecting the price
      - recommendations: array of 3-4 actionable recommendations
      
      Base your analysis on real market dynamics and provide genuine predictions.`;

      const response = await callOpenRouter(prompt);

      // Try to parse the JSON response
      let parsedData;
      try {
        // Clean the response - remove markdown code blocks and extra text
        let cleanResponse = response.trim();

        // Remove markdown code blocks if present
        cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');

        // Extract JSON object
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanResponse;

        parsedData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse JSON:', response);
        throw new Error('Invalid response format from AI model');
      }

      // Validate the response structure
      if (!parsedData.currentPrice || !parsedData.predictedPrice) {
        throw new Error('Incomplete prediction data received');
      }

      setPredictionData({
        ...parsedData,
        vegetable: formData.vegetable,
        location: formData.location,
        timeframe: timeframeLabel
      });

    } catch (error) {
      console.error('Prediction error:', error);
      setError(error.message || 'Failed to generate price prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-900/50 rounded-full mb-4 ring-1 ring-green-800/50">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-green-100 mb-2">Vegetable Price Prediction</h1>
          <p className="text-green-200">Get AI-powered price predictions for vegetables</p>
        </div>

        {/* Prediction Form */}
        <div className="bg-green-900/40 rounded-lg p-6 mb-8 ring-1 ring-green-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-green-200 text-sm mb-2">
                  Vegetable <span className="text-red-400">*</span>
                </label>
                <select
                  name="vegetable"
                  value={formData.vegetable}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select vegetable</option>
                  {vegetables.map(veg => (
                    <option key={veg} value={veg}>{veg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-green-200 text-sm mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-green-200 text-sm mb-2">Prediction Period</label>
                <select
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {timeframes.map(tf => (
                    <option key={tf.value} value={tf.value}>{tf.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-green-600 text-green-100 px-8 py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>{isLoading ? 'Generating...' : 'Get Prediction'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/40 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Prediction Results */}
        {predictionData && (
          <div className="space-y-6">
            {/* Price Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <PredictionCard
                title="Current Price"
                price={predictionData.currentPrice}
                description="Per kg"
              />
              <PredictionCard
                title={`Predicted Price (${predictionData.timeframe})`}
                price={predictionData.predictedPrice}
                change={predictionData.change}
                description="Per kg"
              />
              <div className="bg-green-900/40 p-4 rounded-lg ring-1 ring-green-800/50">
                <h3 className="text-green-300 text-sm mb-2">Confidence Level</h3>
                <p className="text-2xl font-bold text-green-100">{predictionData.confidence}</p>
                <p className="text-sm text-green-400">Prediction accuracy</p>
              </div>
            </div>

            {/* Market Factors */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
                <h2 className="text-xl font-semibold text-green-200 mb-4">Market Factors</h2>
                <ul className="space-y-2">
                  {predictionData.factors?.map((factor, index) => (
                    <li key={index} className="flex items-start text-green-100">
                      <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
                <h2 className="text-xl font-semibold text-green-200 mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {predictionData.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start text-green-100">
                      <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prediction Summary */}
            <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
              <h2 className="text-xl font-semibold text-green-200 mb-4">Prediction Summary</h2>
              <p className="text-green-100 leading-relaxed">
                Based on current market analysis, <strong>{predictionData.vegetable}</strong> prices in <strong>{predictionData.location}</strong> are
                expected to {predictionData.change >= 0 ? 'increase' : 'decrease'} by approximately <strong>{Math.abs(predictionData.change)}%</strong> over
                the next <strong>{predictionData.timeframe.toLowerCase()}</strong>, moving from ₹{predictionData.currentPrice} to ₹{predictionData.predictedPrice} per kg.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VegetablePricePrediction;
