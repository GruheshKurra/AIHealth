import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, Mail, User, Ruler,
  Clock, CheckCircle2, Plus, Filter, Loader2
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { landLeaseOperations } from '../lib/database';

const DUMMY_LANDS = [
  {
    id: 1,
    title: "Fertile Paddy Field",
    location: "Guntur, Andhra Pradesh",
    area: 5.5,
    pricePerAcre: 45000,
    soilType: "Black Soil",
    leaseDuration: 3,
    features: ["Irrigation Well", "Power Supply", "Road Access", "Storage Facility"],
    ownerName: "Ramesh Kumar",
    phone: "+91 9876543210",
    email: "ramesh.k@email.com"
  },
  {
    id: 2,
    title: "Organic Farm Land",
    location: "Warangal, Telangana",
    area: 3.8,
    pricePerAcre: 38000,
    soilType: "Red Soil",
    leaseDuration: 5,
    features: ["Borewell", "Fencing", "Farm House", "Natural Springs"],
    ownerName: "Suresh Reddy",
    phone: "+91 9876543211",
    email: "suresh.r@email.com"
  },
  {
    id: 3,
    title: "Multi-Crop Agricultural Land",
    location: "Krishna District, Andhra Pradesh",
    area: 7.2,
    pricePerAcre: 52000,
    soilType: "Alluvial Soil",
    leaseDuration: 4,
    features: ["Canal Irrigation", "Equipment Shed", "Labor Quarters", "Market Proximity"],
    ownerName: "Venkat Rao",
    phone: "+91 9876543212",
    email: "venkat.r@email.com"
  },
  {
    id: 4,
    title: "Vegetable Farm Plot",
    location: "Rangareddy, Telangana",
    area: 2.5,
    pricePerAcre: 42000,
    soilType: "Loamy Soil",
    leaseDuration: 2,
    features: ["Drip Irrigation", "Greenhouse", "Solar Power", "Security"],
    ownerName: "Krishna Murthy",
    phone: "+91 9876543213",
    email: "krishna.m@email.com"
  },
  {
    id: 5,
    title: "Commercial Farming Land",
    location: "East Godavari, Andhra Pradesh",
    area: 10.0,
    pricePerAcre: 58000,
    soilType: "Black Soil",
    leaseDuration: 5,
    features: ["Multiple Borewells", "Large Storage", "Processing Unit", "Transport Facility"],
    ownerName: "Prasad Reddy",
    phone: "+91 9876543214",
    email: "prasad.r@email.com"
  },
  {
    id: 6,
    title: "Fruit Orchard Land",
    location: "Medak, Telangana",
    area: 4.5,
    pricePerAcre: 48000,
    soilType: "Red Soil",
    leaseDuration: 6,
    features: ["Existing Fruit Trees", "Water Tank", "Watchman Room", "Tool Storage"],
    ownerName: "Lakshmi Devi",
    phone: "+91 9876543215",
    email: "lakshmi.d@email.com"
  }
];

const states = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Maharashtra',
  'Gujarat',
  'Punjab',
  'Haryana'
];

const soilTypes = [
  'Black Soil', 'Red Soil', 'Alluvial Soil', 'Loamy Soil',
  'Sandy Soil', 'Clay Soil', 'Laterite Soil'
];

const CreateListingModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    state: '',
    area: '',
    price_per_acre: '',
    soil_type: '',
    lease_duration: '',
    features: '',
    description: '',
    owner_name: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const listingData = {
        ...formData,
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
        area: parseFloat(formData.area),
        price_per_acre: parseInt(formData.price_per_acre),
        lease_duration: parseInt(formData.lease_duration),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        is_available: true
      };

      const result = await landLeaseOperations.createLandListing(listingData);

      if (result.success) {
        onSuccess();
        onClose();
        setFormData({
          title: '', location: '', state: '', area: '', price_per_acre: '',
          soil_type: '', lease_duration: '', features: '', description: '',
          owner_name: '', phone: '', email: ''
        });
      } else {
        alert('Error creating listing: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-green-900/90 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-100">List Your Land</h2>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-200 text-sm mb-2">Land Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, District"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Area (acres) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Price per Acre (₹/year) *</label>
              <input
                type="number"
                name="price_per_acre"
                value={formData.price_per_acre}
                onChange={handleInputChange}
                min="1000"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Soil Type *</label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Soil Type</option>
                {soilTypes.map(soil => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Lease Duration (years) *</label>
              <input
                type="number"
                name="lease_duration"
                value={formData.lease_duration}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Owner Name *</label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-green-200 text-sm mb-2">Features (comma-separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              placeholder="Irrigation Well, Power Supply, Road Access, Storage Facility"
              className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-green-200 text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Land'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LandCard = ({ land, onProposal }) => {
  const { user } = useUser();
  const [showContact, setShowContact] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState(land.price_per_acre);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minPrice = Math.floor(land.price_per_acre * 0.85);
  const maxPrice = Math.ceil(land.price_per_acre * 1.15);

  const getPriceColor = () => {
    if (negotiatedPrice < land.price_per_acre) return 'text-yellow-400';
    if (negotiatedPrice > land.price_per_acre) return 'text-red-400';
    return 'text-green-300';
  };

  const handleProposal = async () => {
    if (!user) {
      alert('Please sign in to make a proposal');
      return;
    }

    setIsSubmitting(true);
    try {
      const proposalData = {
        land_listing_id: land.id,
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
        user_email: user.emailAddresses[0]?.emailAddress || '',
        proposed_price: negotiatedPrice,
        message: negotiatedPrice === land.price_per_acre
          ? 'Accepting the listed price'
          : `Proposing ₹${negotiatedPrice.toLocaleString('en-IN')}/acre/year`,
        status: 'pending'
      };

      const result = await landLeaseOperations.createLeaseProposal(proposalData);

      if (result.success) {
        onProposal();
        alert('Proposal sent successfully!');
      } else {
        alert('Error sending proposal: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      alert('Error sending proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-green-300">{land.title}</h3>
          <p className="text-green-50">{land.location}, {land.state}</p>
        </div>
        <div className="text-right">
          <p className="text-green-300 font-semibold">₹{land.price_per_acre.toLocaleString('en-IN')}/acre/year</p>
          <p className="text-green-200 text-sm">{land.area} acres</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-800/30 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-200">Negotiate Price:</span>
          <span className={`font-semibold ${getPriceColor()}`}>
            ₹{negotiatedPrice.toLocaleString('en-IN')}/acre/year
          </span>
        </div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={negotiatedPrice}
          onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
          className="w-full h-2 bg-green-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-sm mt-1">
          <span className="text-yellow-400">₹{minPrice.toLocaleString('en-IN')}</span>
          <span className="text-green-300">Base: ₹{land.price_per_acre.toLocaleString('en-IN')}</span>
          <span className="text-red-400">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>

        {negotiatedPrice !== land.price_per_acre && (
          <p className="text-sm mt-2 text-green-400">
            {negotiatedPrice < land.price_per_acre
              ? `${((land.price_per_acre - negotiatedPrice) / land.price_per_acre * 100).toFixed(1)}% below asking price`
              : `${((negotiatedPrice - land.price_per_acre) / land.price_per_acre * 100).toFixed(1)}% above asking price`
            }
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center text-green-200">
          <Ruler className="w-4 h-4 mr-2 text-green-400" />
          <span>{land.area} acres</span>
        </div>
        <div className="flex items-center text-green-200">
          <MapPin className="w-4 h-4 mr-2 text-green-400" />
          <span>{land.soil_type}</span>
        </div>
        <div className="flex items-center text-green-200">
          <Clock className="w-4 h-4 mr-2 text-green-400" />
          <span>{land.lease_duration} years lease</span>
        </div>
      </div>

      {land.features && land.features.length > 0 && (
        <div className="mt-4">
          <h4 className="text-green-300 font-medium mb-2">Features:</h4>
          <div className="grid grid-cols-2 gap-2">
            {land.features.map((feature, index) => (
              <div key={index} className="flex items-center text-green-200 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {land.description && (
        <div className="mt-4">
          <h4 className="text-green-300 font-medium mb-2">Description:</h4>
          <p className="text-green-200 text-sm">{land.description}</p>
        </div>
      )}

      <div className="mt-6 grid gap-2">
        <button
          onClick={() => setShowContact(!showContact)}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-colors"
        >
          {showContact ? 'Hide Contact' : 'Show Contact Details'}
        </button>

        {showContact && (
          <div className="bg-green-800/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-green-200">
              <User className="w-4 h-4 mr-2 text-green-400" />
              <span>{land.owner_name}</span>
            </div>
            <div className="flex items-center text-green-200">
              <Phone className="w-4 h-4 mr-2 text-green-400" />
              <span>{land.phone}</span>
            </div>
            <div className="flex items-center text-green-200">
              <Mail className="w-4 h-4 mr-2 text-green-400" />
              <span>{land.email}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleProposal}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Proposal'}
        </button>
      </div>
    </div>
  );
};

const LandLease = () => {
  const { user, isSignedIn } = useUser();
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');

  const fetchLands = async () => {
    setIsLoading(true);
    try {
      const result = await landLeaseOperations.getAllLandListings();
      if (result.success) {
        setLands(result.data);
        setFilteredLands(result.data);
      } else {
        console.error('Error fetching lands:', result.error);
      }
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    let filtered = lands;

    if (searchTerm) {
      filtered = filtered.filter(land =>
        land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        land.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(land => land.state === selectedState);
    }

    if (selectedSoilType) {
      filtered = filtered.filter(land => land.soil_type === selectedSoilType);
    }

    setFilteredLands(filtered);
  }, [searchTerm, selectedState, selectedSoilType, lands]);

  const handleCreateSuccess = () => {
    fetchLands();
  };

  const handleProposal = () => {
    // Refresh data or show success message
    console.log('Proposal sent successfully');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-100 mb-4">Land Lease Marketplace</h1>
          <p className="text-green-200 text-lg">Find agricultural land for lease or list your land</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          {isSignedIn ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>List Your Land</span>
            </button>
          ) : (
            <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50">
              <p className="text-green-200">Please sign in to list your land or make proposals</p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-green-900/40 rounded-lg p-6 mb-8 ring-1 ring-green-800/50">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-green-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={selectedSoilType}
              onChange={(e) => setSelectedSoilType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Soil Types</option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('');
                setSelectedSoilType('');
              }}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Land Listings */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <span className="ml-2 text-green-200">Loading land listings...</span>
          </div>
        ) : filteredLands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-green-200 text-lg">No land listings found</p>
            <p className="text-green-300 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLands.map(land => (
              <LandCard
                key={land.id}
                land={land}
                onProposal={handleProposal}
              />
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default LandLease;