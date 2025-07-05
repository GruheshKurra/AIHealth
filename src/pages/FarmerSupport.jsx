import React, { useState, useEffect } from 'react';
import {
  Heart, Share2, Users, Calendar,
  Clock, CheckCircle2, AlertCircle,
  Landmark, ArrowRight, Loader2, HandHeart, Plus
} from 'lucide-react';
import { useUser, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { farmerSupportOperations, initializeDatabase } from '../lib/database';

const FarmerCard = ({ farmer, onDonate }) => {
  const [showDonateModal, setShowDonateModal] = useState(false);

  const progress = farmer.amount_needed > 0 ? (farmer.amount_raised / farmer.amount_needed) * 100 : 0;
  const daysLeft = farmer.deadline ? Math.max(0, Math.ceil((new Date(farmer.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const donationCount = farmer.donations ? farmer.donations.length : 0;

  const DonationModal = ({ onClose }) => {
    const [amount, setAmount] = useState('1000');
    const [donorName, setDonorName] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDonate = async (e) => {
      e.preventDefault();
      if (!amount || !donorName.trim()) return;

      setIsSubmitting(true);
      try {
        const donationData = {
          case_id: farmer.id,
          donor_name: isAnonymous ? 'Anonymous' : donorName.trim(),
          amount: parseFloat(amount),
          message: message.trim(),
          is_anonymous: isAnonymous
        };

        const result = await farmerSupportOperations.addDonation(donationData);
        if (result.success) {
          alert(`Thank you for your generous donation of ₹${Number(amount).toLocaleString('en-IN')}!`);
          onClose();
          onDonate(); // Refresh the data
        } else {
          alert('Failed to process donation: ' + result.error);
        }
      } catch (error) {
        console.error('Error processing donation:', error);
        alert('Failed to process donation');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-green-900 rounded-lg p-6 max-w-md w-full ring-1 ring-green-800" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-semibold text-green-100 mb-4">Support {farmer.name}</h3>

          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Your Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-green-300">Donate anonymously</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Donation Amount (₹)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['1000', '2000', '5000', '10000'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    disabled={isSubmitting}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${amount === value
                      ? 'bg-green-600 text-green-100'
                      : 'bg-green-800/50 text-green-300 hover:bg-green-700/50'
                      }`}
                  >
                    ₹{Number(value).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Message of Support (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Share a message of encouragement..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting || !amount || !donorName.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                <span>Donate ₹{Number(amount || 0).toLocaleString('en-IN')}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-800/50 text-green-200 rounded-lg hover:bg-green-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-green-200">{farmer.name}</h3>
          <p className="text-green-300">{farmer.location}</p>
          {farmer.age && <p className="text-green-400 text-sm">Age: {farmer.age}</p>}
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Support ${farmer.name}`,
                text: `Help support ${farmer.name}, a farmer from ${farmer.location}`,
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="p-2 hover:bg-green-800/30 rounded-lg transition-colors"
        >
          <Share2 className="w-5 h-5 text-green-400" />
        </button>
      </div>

      <p className="text-green-100 mb-4 flex-grow">{farmer.story}</p>

      {(farmer.family_size || farmer.land_size) && (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {farmer.family_size && (
            <div className="flex items-center text-green-300">
              <Users className="w-4 h-4 mr-2 text-green-400" />
              Family Size: {farmer.family_size}
            </div>
          )}
          {farmer.land_size && (
            <div className="flex items-center text-green-300">
              <Landmark className="w-4 h-4 mr-2 text-green-400" />
              Land: {farmer.land_size} acres
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-green-300">Raised: ₹{farmer.amount_raised.toLocaleString('en-IN')}</span>
          <span className="text-green-300">Goal: ₹{farmer.amount_needed.toLocaleString('en-IN')}</span>
        </div>
        <div className="h-2 bg-green-900/50 rounded-full">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="flex items-center text-green-300">
            <Heart className="w-4 h-4 mr-1 text-green-400" />
            {donationCount} {donationCount === 1 ? 'supporter' : 'supporters'}
          </div>
          {farmer.deadline && (
            <div className="flex items-center text-green-300">
              <Clock className="w-4 h-4 mr-1 text-green-400" />
              {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </div>
          )}
        </div>
      </div>

      {farmer.is_verified && farmer.verified_by && (
        <div className="flex items-center mb-4 text-sm text-green-400">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Verified by {farmer.verified_by}
        </div>
      )}

      <button
        onClick={() => setShowDonateModal(true)}
        className="w-full bg-green-600 hover:bg-green-500 text-green-100 py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
      >
        <Heart className="w-5 h-5 mr-2" />
        Support This Farmer
      </button>

      {showDonateModal && (
        <DonationModal onClose={() => setShowDonateModal(false)} />
      )}
    </div>
  );
};

const CreateCaseModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    family_size: '',
    land_size: '',
    amount_needed: '',
    story: '',
    deadline: '',
    verified_by: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const caseData = {
        clerk_user_id: user.id,
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location.trim(),
        family_size: formData.family_size ? parseInt(formData.family_size) : null,
        land_size: formData.land_size ? parseFloat(formData.land_size) : null,
        amount_needed: parseFloat(formData.amount_needed),
        story: formData.story.trim(),
        deadline: formData.deadline || null,
        verified_by: formData.verified_by.trim() || null,
        is_verified: false,
        is_active: true
      };

      const result = await farmerSupportOperations.createFarmerCase(caseData);
      if (result.success) {
        alert('Your support request has been submitted successfully!');
        onClose();
        onSuccess();
      } else {
        alert('Failed to submit support request: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating farmer case:', error);
      alert('Failed to submit support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-green-900 rounded-lg p-6 max-w-2xl w-full my-8 ring-1 ring-green-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-semibold text-green-100 mb-6">Request Support</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">
                Farmer Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter farmer's name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter age"
                min="1"
                max="120"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-200 mb-1">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Village, District, State"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Family Size</label>
              <input
                type="number"
                name="family_size"
                value={formData.family_size}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Number of family members"
                min="1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Land Size (acres)</label>
              <input
                type="number"
                name="land_size"
                value={formData.land_size}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Land size in acres"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">
                Amount Needed (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="amount_needed"
                value={formData.amount_needed}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Amount needed in rupees"
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-200 mb-1">
              Story/Reason for Support <span className="text-red-400">*</span>
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
              placeholder="Describe the situation and why support is needed..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-200 mb-1">Verified By</label>
            <input
              type="text"
              name="verified_by"
              value={formData.verified_by}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-green-800/30 border border-green-700/50 rounded-lg text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Local authority or organization (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.location || !formData.amount_needed || !formData.story}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>Submit Support Request</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-800/50 text-green-200 rounded-lg hover:bg-green-700/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FarmerSupport = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const initAndLoadData = async () => {
      try {
        await initializeDatabase();
        loadFarmers();
      } catch (error) {
        console.error('Database initialization failed:', error);
        setError('Database connection failed');
        setLoading(false);
      }
    };

    initAndLoadData();
  }, []);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      const result = await farmerSupportOperations.getAllFarmerCases();

      if (result.success) {
        setFarmers(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load farmer cases');
      }
    } catch (error) {
      console.error('Error loading farmers:', error);
      setError('Failed to load farmer cases');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-400" />
          <p className="text-green-200">Loading farmer cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-900/50 text-green-400 mb-4 ring-1 ring-green-800/50">
            <HandHeart className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-bold text-green-100 mb-4">
            Support Our Farmers
          </h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto mb-8">
            Your contribution can help farmers overcome challenges and continue their essential work. Every donation makes a difference.
          </p>

          {/* Raise Support Button */}
          <div className="mb-8">
            <SignedOut>
              <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-green-200 mb-2">Need Support?</h3>
                <p className="text-green-300 mb-4">Sign in to request support for farming challenges</p>
                <SignInButton mode="modal">
                  <button className="px-6 py-3 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors">
                    Sign In to Request Support
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Request Support</span>
              </button>
            </SignedIn>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/40 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
              <button
                onClick={loadFarmers}
                className="ml-auto px-3 py-1 bg-red-700 text-red-100 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
            <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-green-200 mb-2">Verified Cases</h3>
            <p className="text-green-300">All farmer cases are thoroughly verified by local agricultural offices and farmer associations.</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
            <Heart className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-green-200 mb-2">Direct Support</h3>
            <p className="text-green-300">100% of your donation goes directly to the farmer, ensuring maximum impact where it's needed most.</p>
          </div>

          <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
            <ArrowRight className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-green-200 mb-2">Track Impact</h3>
            <p className="text-green-300">Follow the progress of farmers you've supported and see the real difference you're making.</p>
          </div>
        </div>

        {/* Farmer Cases */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {farmers.length > 0 ? (
            farmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} onDonate={loadFarmers} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <HandHeart className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-green-400">No farmer cases available at the moment.</p>
            </div>
          )}
        </div>

        {/* Create Case Modal */}
        {showCreateModal && (
          <CreateCaseModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={loadFarmers}
          />
        )}
      </div>
    </div>
  );
};

export default FarmerSupport;