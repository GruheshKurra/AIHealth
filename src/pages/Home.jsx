import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf, Bug, Heart, FileText, TrendingUp, FlaskConical, MapPin, MessageCircle, Wrench,
  Shield, Zap, Users, Award, CheckCircle, ArrowRight, Sparkles, Target, Globe, Brain, Lightbulb
} from 'lucide-react';

const FeatureCard = ({ Icon, title, description, link, highlight = false }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`${highlight ? 'bg-gradient-to-br from-green-800/60 to-green-900/60 ring-2 ring-green-600/50' : 'bg-green-900/40 ring-1 ring-green-800/50'} p-6 rounded-lg hover:bg-green-800/40 transition-all duration-300`}
  >
    <div className={`w-12 h-12 ${highlight ? 'bg-green-600/50' : 'bg-green-800/50'} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-green-400" />
    </div>
    <h3 className="text-xl font-semibold text-green-300 mb-2">{title}</h3>
    <p className="text-green-100/90 mb-4">{description}</p>
    <Link
      to={link}
      className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center space-x-1"
    >
      <span>Learn More</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

const BenefitCard = ({ Icon, title, description }) => (
  <div className="bg-green-900/40 p-6 rounded-lg ring-1 ring-green-800/50">
    <div className="w-12 h-12 bg-green-800/50 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-green-400" />
    </div>
    <h3 className="text-xl font-semibold text-green-300 mb-2">{title}</h3>
    <p className="text-green-100/90">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 to-green-900/20 pointer-events-none" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-600/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-500/10 rounded-full blur-xl" />

        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center bg-green-900/50 rounded-full px-4 py-2 ring-1 ring-green-700/50 mb-8">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-green-200 ml-2">AI-Powered Farm Management</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-green-100 mb-6">
              Transform Your Farm with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300">
                Smart AI Technology
              </span>
            </h1>

            <p className="text-xl text-green-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering farmers with cutting-edge AI technology for plant analysis, pest detection, soil health monitoring, and community support. Start your journey to smarter farming today.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                to="/farmer-support"
                className="bg-gradient-to-r from-green-500 to-green-400 text-green-950 px-8 py-4 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
              >
                <Heart className="w-5 h-5" />
                <span>Support Farmers</span>
              </Link>
              <Link
                to="/plant-analysis"
                className="bg-green-900/80 text-green-100 px-8 py-4 rounded-lg font-semibold hover:bg-green-800/80 transition-all duration-300 ring-1 ring-green-700 flex items-center space-x-2 backdrop-blur-sm"
              >
                <Leaf className="w-5 h-5" />
                <span>Try AI Analysis</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-green-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Secure & Reliable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-sm">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-400" />
                <span className="text-sm">Available in Multiple Languages</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-green-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-300 mb-4">
              Complete Farm Management Suite
            </h2>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              Everything you need to manage your farm efficiently, from AI-powered analysis to community support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              Icon={Heart}
              title="Farmer Support"
              description="Join our community in supporting farmers through verified cases and transparent donation tracking with real-time updates."
              link="/farmer-support"
              highlight={true}
            />
            <FeatureCard
              Icon={Leaf}
              title="Plant Health Analysis"
              description="Upload plant photos for instant disease detection and get detailed health analysis using advanced AI models."
              link="/plant-analysis"
              highlight={true}
            />
            <FeatureCard
              Icon={Bug}
              title="Pest Identification"
              description="Identify harmful pests instantly and get comprehensive treatment recommendations for effective control."
              link="/pest-analysis"
              highlight={true}
            />
            <FeatureCard
              Icon={FlaskConical}
              title="Soil Health Analysis"
              description="Analyze your soil composition and get personalized recommendations for optimal crop growth and yield."
              link="/soil-analysis"
            />
            <FeatureCard
              Icon={TrendingUp}
              title="Price Prediction"
              description="Get AI-powered price predictions for vegetables to make informed market decisions and maximize profits."
              link="/price-prediction"
            />
            <FeatureCard
              Icon={MapPin}
              title="Land Marketplace"
              description="Find and lease agricultural land in your region with verified listings and transparent pricing."
              link="/land-lease"
            />
            <FeatureCard
              Icon={Wrench}
              title="Equipment Rental"
              description="Rent modern farming equipment and machinery for your agricultural needs at competitive rates."
              link="/equipment-lease"
            />
            <FeatureCard
              Icon={MessageCircle}
              title="Farmer Forum"
              description="Connect with experienced farmers, share knowledge, and get expert advice in our active community."
              link="/forum"
            />
            <FeatureCard
              Icon={FileText}
              title="Agricultural News"
              description="Stay updated with the latest farming news, government schemes, and agricultural best practices."
              link="/news"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-300 mb-4">
              Why Choose FarmCare?
            </h2>
            <p className="text-xl text-green-200">
              Leading the future of agriculture with innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">Precision Agriculture</h3>
              <p className="text-green-200">
                Use AI-powered analysis for precise crop management, pest control, and soil optimization
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">Community Support</h3>
              <p className="text-green-200">
                Connect with fellow farmers, share experiences, and support each other through challenges
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">Smart Technology</h3>
              <p className="text-green-200">
                Leverage cutting-edge AI and machine learning for data-driven farming decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-green-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-300 mb-4">
              Benefits of Smart Farming
            </h2>
            <p className="text-xl text-green-200">
              Discover how AI technology can transform your agricultural practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              Icon={Award}
              title="Improved Crop Yields"
              description="Optimize growing conditions and identify issues early to maximize harvest quality and quantity."
            />
            <BenefitCard
              Icon={Shield}
              title="Reduced Crop Loss"
              description="Early detection of diseases and pests helps prevent significant crop damage and financial losses."
            />
            <BenefitCard
              Icon={Lightbulb}
              title="Data-Driven Decisions"
              description="Make informed choices based on scientific analysis rather than guesswork for better outcomes."
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-green-900/60 to-green-800/60 rounded-2xl p-8 ring-1 ring-green-700/50">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-300 mb-4">
                Join the Farming Community
              </h2>
              <p className="text-xl text-green-200">
                Connect with fellow farmers and build a sustainable agricultural future together
              </p>
            </div>

            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/forum"
                  className="bg-green-600 text-green-100 px-8 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Join Community</span>
                </Link>
                <Link
                  to="/farmer-support"
                  className="bg-green-900/80 text-green-100 px-8 py-3 rounded-lg font-semibold hover:bg-green-800/80 transition-colors ring-1 ring-green-700 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5" />
                  <span>Support Others</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900/40 to-green-800/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-300 mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Start your journey with AI-powered farming today. Experience the future of agriculture.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/plant-analysis"
              className="bg-gradient-to-r from-green-500 to-green-400 text-green-950 px-8 py-4 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <Leaf className="w-5 h-5" />
              <span>Start Free Analysis</span>
            </Link>
            <Link
              to="/farmer-support"
              className="bg-green-900/80 text-green-100 px-8 py-4 rounded-lg font-semibold hover:bg-green-800/80 transition-all duration-300 ring-1 ring-green-700 flex items-center space-x-2 backdrop-blur-sm"
            >
              <Heart className="w-5 h-5" />
              <span>Explore Community</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-green-300">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">100% Free to Start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">Expert Support Available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;