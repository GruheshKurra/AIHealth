import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Search, Loader2, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, MapPin, Sun, Award, Store } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from 'sonner';

const PredictionCard = ({ title, current, predicted, change }) => (
  <div className="bg-green-900/40 p-4 rounded-lg ring-1 ring-green-800/50">
    <h3 className="text-green-300 text-sm mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-bold text-green-100">₹{predicted}</p>
        <p className="text-sm text-green-400">Current: ₹{current}</p>
      </div>
      <div className={`flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    </div>
  </div>
);

const FormSelect = ({ label, icon: Icon, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-green-200 flex items-center text-sm">
      <Icon className="w-4 h-4 mr-1" />
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="">{`Select ${label.toLowerCase()}`}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const VegetablePricePrediction = () => {
  const [formData, setFormData] = useState({
    vegetable: '', state: '', season: '', quality: '', marketType: '', duration: 3
  });
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  
  const formOptions = {
    vegetables: ["Tomato", "Potato", "Onion", "Carrot", "Cauliflower", "Cabbage", "Brinjal", "Okra", "Peas", "Spinach", "Bitter Gourd", "Cucumber", "Beetroot", "Radish", "Green Chili"],
    states: ["Maharashtra", "Karnataka", "Uttar Pradesh", "West Bengal", "Punjab", "Gujarat", "Tamil Nadu", "Andhra Pradesh", "Madhya Pradesh", "Bihar", "Haryana", "Rajasthan", "Kerala"],
    seasons: ["Summer", "Winter", "Monsoon", "Spring", "Autumn"],
    qualityGrades: ["Grade A", "Grade B", "Grade C", "Premium", "Standard", "Economy"],
    marketTypes: ["Wholesale", "Retail", "Farmers Market", "Export", "Online", "Supermarket"]
  };

  const generateSampleData = (formData) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Base price range based on vegetable
    const vegetablePriceMap = {
      "Tomato": { base: 40, variance: 15 },
      "Potato": { base: 25, variance: 10 },
      "Onion": { base: 30, variance: 20 },
      "Carrot": { base: 35, variance: 10 },
      "Cauliflower": { base: 45, variance: 15 },
      "Cabbage": { base: 30, variance: 10 },
      "Brinjal": { base: 35, variance: 12 },
      "Okra": { base: 50, variance: 15 },
      "Peas": { base: 60, variance: 20 },
      "Spinach": { base: 40, variance: 10 },
      "Bitter Gourd": { base: 55, variance: 15 },
      "Cucumber": { base: 30, variance: 8 },
      "Beetroot": { base: 40, variance: 12 },
      "Radish": { base: 25, variance: 8 },
      "Green Chili": { base: 70, variance: 25 }
    };
    
    // Season factors
    const seasonFactor = {
      "Summer": { factor: 1.1, volatility: 0.15 },
      "Winter": { factor: 0.9, volatility: 0.1 },
      "Monsoon": { factor: 1.2, volatility: 0.2 },
      "Spring": { factor: 0.95, volatility: 0.08 },
      "Autumn": { factor: 1.0, volatility: 0.12 }
    };
    
    // Quality grade factors
    const qualityFactor = {
      "Grade A": 1.2,
      "Grade B": 1.0,
      "Grade C": 0.8,
      "Premium": 1.3,
      "Standard": 1.0,
      "Economy": 0.7
    };
    
    // Market type factors
    const marketFactor = {
      "Wholesale": 0.8,
      "Retail": 1.2,
      "Farmers Market": 1.0,
      "Export": 1.4,
      "Online": 1.3,
      "Supermarket": 1.25
    };
    
    // State factors (relative cost of living/transport)
    const stateFactor = {
      "Maharashtra": 1.1,
      "Karnataka": 1.05,
      "Uttar Pradesh": 0.9,
      "West Bengal": 0.95,
      "Punjab": 1.0,
      "Gujarat": 1.02,
      "Tamil Nadu": 1.05,
      "Andhra Pradesh": 0.98,
      "Madhya Pradesh": 0.92,
      "Bihar": 0.85,
      "Haryana": 1.0,
      "Rajasthan": 0.95,
      "Kerala": 1.15
    };
    
    // Calculate base price
    const vegInfo = vegetablePriceMap[formData.vegetable] || { base: 40, variance: 15 };
    const basePrice = vegInfo.base;
    
    // Apply factors
    const adjustedBasePrice = basePrice * 
      (qualityFactor[formData.quality] || 1.0) * 
      (marketFactor[formData.marketType] || 1.0) * 
      (stateFactor[formData.state] || 1.0) * 
      (seasonFactor[formData.season]?.factor || 1.0);
    
    // Round to nearest whole number
    const currentPrice = Math.round(adjustedBasePrice);
    
    // Generate predictions for each month
    const predictions = [];
    const seasonalVolatility = seasonFactor[formData.season]?.volatility || 0.12;
    let lastPrice = currentPrice;
    
    for (let i = 0; i <= formData.duration; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const yearOffset = Math.floor((currentMonth + i) / 12);
      const monthLabel = `${months[monthIndex]} ${currentYear + yearOffset}`;
      
      // First month is current price
      if (i === 0) {
        predictions.push({
          month: monthLabel,
          price: currentPrice,
          change: 0,
          supplyStatus: "Current",
          demandTrend: "Current"
        });
        continue;
      }
      
      // Calculate price change with some randomness and trend
      // More volatility in longer predictions
      const volatilityFactor = seasonalVolatility * (1 + (i * 0.1));
      const randomFactor = (Math.random() * 2 - 1) * volatilityFactor;
      const trendFactor = Math.sin(Math.PI * i / formData.duration) * 0.05;
      const percentChange = randomFactor + trendFactor;
      
      // Calculate new price
      let newPrice = Math.round(lastPrice * (1 + percentChange));
      // Ensure minimum price
      newPrice = Math.max(newPrice, Math.round(vegInfo.base * 0.6));
      
      // Calculate percentage change from current price
      const changeFromCurrent = ((newPrice - currentPrice) / currentPrice * 100).toFixed(2);
      
      predictions.push({
        month: monthLabel,
        price: newPrice,
        change: parseFloat(changeFromCurrent),
        supplyStatus: getRandomSupplyStatus(),
        demandTrend: getRandomDemandTrend()
      });
      
      lastPrice = newPrice;
    }
    
    // Generate market factors
    const marketFactors = generateMarketFactors(formData);
    
    // Generate recommendations
    const recommendations = generateRecommendations(formData, predictions);
    
    // Generate additional insights
    const qualityPremium = `${Math.round((qualityFactor[formData.quality] - 0.7) * 100)}% premium for ${formData.quality} quality`;
    const marketInsights = generateMarketInsight(formData);
    const regionalTrends = generateRegionalTrend();
    
    return {
      currentPrice,
      predictions,
      marketFactors,
      recommendations,
      qualityPremium,
      marketInsights,
      regionalTrends
    };
  };
  
  function getRandomSupplyStatus() {
    const statuses = ["Low", "Moderate", "High", "Surplus", "Deficit", "Stable"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
  
  function getRandomDemandTrend() {
    const trends = ["Decreasing", "Stable", "Increasing", "Rapidly Increasing", "Rapidly Decreasing", "Fluctuating"];
    return trends[Math.floor(Math.random() * trends.length)];
  }
  
  function generateMarketFactors(formData) {
    const factors = [
      {
        factor: "Weather Impact",
        description: `Expected ${formData.season.toLowerCase()} weather patterns in ${formData.state} affecting cultivation.`
      },
      {
        factor: "Transportation Costs",
        description: "Fuel price fluctuations impacting distribution expenses."
      },
      {
        factor: "Supply Chain",
        description: `${formData.marketType} markets showing ${Math.random() > 0.5 ? "improved" : "strained"} logistics efficiency.`
      },
      {
        factor: "Consumer Preference",
        description: `${formData.quality} quality produce experiencing ${Math.random() > 0.5 ? "increased" : "steady"} consumer demand.`
      }
    ];
    
    // Add vegetable-specific factor
    factors.push({
      factor: "Production Trends",
      description: `${formData.vegetable} cultivation area ${Math.random() > 0.5 ? "expanding" : "contracting"} in major growing regions.`
    });
    
    return factors;
  }
  
  function generateRecommendations(formData, predictions) {
    const priceIncreasing = predictions[predictions.length-1].change > 0;
    
    const recommendations = [
      {
        type: "Storage",
        suggestion: priceIncreasing ? 
          "Consider extending storage duration to capitalize on rising price trend." : 
          "Minimize storage duration to reduce holding costs during price decline."
      },
      {
        type: "Market Selection",
        suggestion: `Focus on ${Math.random() > 0.5 ? "urban" : "rural"} ${formData.marketType} markets for optimal pricing.`
      },
      {
        type: "Quality Management",
        suggestion: `Maintain ${formData.quality} standards to ensure maximum returns in current market conditions.`
      },
      {
        type: "Timing",
        suggestion: `Plan harvest cycles to align with ${predictions[Math.floor(predictions.length / 2)].month} price expectations.`
      }
    ];
    
    return recommendations;
  }
  
  function generateMarketInsight(formData) {
    const insights = [
      `Higher prices expected in ${formData.marketType} markets due to increasing consumer preference.`,
      `${formData.marketType} channels showing stable demand for ${formData.quality} ${formData.vegetable}.`,
      `Market diversification recommended to optimize returns during ${formData.season} season.`,
      `Direct-to-consumer sales channels showing promise for ${formData.quality} produce.`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  function generateRegionalTrend() {
    const regions = ["Northern", "Southern", "Eastern", "Western", "Central", "North-Eastern"];
    const trends = [
      "showing stronger demand patterns",
      "experiencing supply constraints",
      "demonstrating price stability",
      "indicating higher profit margins",
      "reporting increased consumer preference",
      "showing favorable market conditions"
    ];
    
    const region = regions[Math.floor(Math.random() * regions.length)];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    return `${region} regions ${trend}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vegetable || !formData.state || !formData.season || !formData.quality || !formData.marketType) {
      toast.error('Please fill all fields');
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const data = generateSampleData(formData);
        setPredictionData(data);
        toast.success('Predictions generated successfully!');
      } catch (error) {
        toast.error('Failed to generate predictions');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors closeButton />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-2 bg-green-900/50 rounded-full mb-4 ring-1 ring-green-800/50"
          >
            <TrendingUp className="w-6 h-6 text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-green-100 mb-2">Vegetable Price Prediction</h1>
          <p className="text-green-200">Get AI-powered price predictions based on multiple factors</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/40 rounded-lg shadow-md p-6 mb-8 ring-1 ring-green-800/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormSelect
                label="Vegetable"
                icon={Store}
                name="vegetable"
                value={formData.vegetable}
                onChange={handleInputChange}
                options={formOptions.vegetables}
              />
              <FormSelect
                label="State"
                icon={MapPin}
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                options={formOptions.states}
              />
              <FormSelect
                label="Season"
                icon={Sun}
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                options={formOptions.seasons}
              />
              <FormSelect
                label="Quality Grade"
                icon={Award}
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                options={formOptions.qualityGrades}
              />
              <FormSelect
                label="Market Type"
                icon={Store}
                name="marketType"
                value={formData.marketType}
                onChange={handleInputChange}
                options={formOptions.marketTypes}
              />
              <FormSelect
                label="Duration"
                icon={Calendar}
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                options={[3, 6, 9]}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-green-600 text-green-100 px-8 py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>Generate Prediction</span>
              </button>
            </div>
          </form>
        </motion.div>

        {predictionData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-4">
              <PredictionCard
                title="Current Price (per kg)"
                current={predictionData.currentPrice}
                predicted={predictionData.currentPrice}
                change={0}
              />
              <PredictionCard
                title="Short-term Prediction"
                current={predictionData.currentPrice}
                predicted={predictionData.predictions[1]?.price}
                change={predictionData.predictions[1]?.change}
              />
              <PredictionCard
                title={`${formData.duration}-Month Prediction`}
                current={predictionData.currentPrice}
                predicted={predictionData.predictions[predictionData.predictions.length - 1]?.price}
                change={predictionData.predictions[predictionData.predictions.length - 1]?.change}
              />
            </div>

            <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
              <h2 className="text-xl font-semibold text-green-200 mb-4">Price Trend Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData.predictions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F4B3F" />
                    <XAxis dataKey="month" stroke="#A7F3D0" style={{ fontSize: '0.875rem' }} />
                    <YAxis stroke="#A7F3D0" style={{ fontSize: '0.875rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#064E3B',
                        borderColor: '#065F46',
                        borderRadius: '0.5rem'
                      }}
                      labelStyle={{ color: '#A7F3D0' }}
                      itemStyle={{ color: '#34D399' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#34D399"
                      strokeWidth={2}
                      name="Price (₹)"
                      dot={{ fill: '#34D399', stroke: '#059669', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
                <h2 className="text-xl font-semibold text-green-200 mb-4">Market Factors</h2>
                <ul className="space-y-2">
                  {predictionData.marketFactors.map((factor, index) => (
                    <li key={index} className="flex items-start text-green-100">
                      <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full" />
                      <div>
                        <span className="font-medium">{factor.factor}:</span> {factor.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
                <h2 className="text-xl font-semibold text-green-200 mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {predictionData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-green-100">
                      <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full" />
                      <div>
                      <span className="font-medium">{rec.type}:</span> {rec.suggestion}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
              <h2 className="text-xl font-semibold text-green-200 mb-4">Additional Insights</h2>
              <p className="text-green-100 mb-4">
                <span className="font-medium">Quality Premium:</span> {predictionData.qualityPremium}
              </p>
              <p className="text-green-100 mb-4">
                <span className="font-medium">Market Insights:</span> {predictionData.marketInsights}
              </p>
              <p className="text-green-100">
                <span className="font-medium">Regional Trends:</span> {predictionData.regionalTrends}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VegetablePricePrediction;
