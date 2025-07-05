import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Search, MapPin, Phone, Mail, User, Wrench,
  Clock, CheckCircle2, Plus, Filter, Loader2, Calendar,
  DollarSign, Settings, Truck
} from 'lucide-react';
import { equipmentLeaseOperations } from '../lib/database';

const equipmentTypes = [
  'Tractor', 'Harvester', 'Tillage Equipment', 'Spraying Equipment',
  'Seeding Equipment', 'Irrigation Equipment', 'Thresher', 'Cultivator'
];

const states = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu',
  'Kerala', 'Maharashtra', 'Gujarat', 'Punjab', 'Haryana'
];

const conditions = ['Excellent', 'Good', 'Fair'];

const CreateEquipmentModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    state: '',
    power_spec: '',
    condition: '',
    year: '',
    price_per_day: '',
    features: '',
    description: '',
    availability: '',
    owner_name: '',
    phone: '',
    email: '',
    min_days: '1',
    max_days: '30'
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
        year: parseInt(formData.year),
        price_per_day: parseInt(formData.price_per_day),
        min_days: parseInt(formData.min_days),
        max_days: parseInt(formData.max_days),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        is_available: true
      };

      const result = await equipmentLeaseOperations.createEquipmentListing(listingData);

      if (result.success) {
        onSuccess();
        onClose();
        setFormData({
          name: '', type: '', location: '', state: '', power_spec: '',
          condition: '', year: '', price_per_day: '', features: '',
          description: '', availability: '', owner_name: '', phone: '',
          email: '', min_days: '1', max_days: '30'
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
          <h2 className="text-2xl font-bold text-green-100">List Your Equipment</h2>
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
              <label className="block text-green-200 text-sm mb-2">Equipment Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Deere 5045D Tractor"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Equipment Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Type</option>
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
              <label className="block text-green-200 text-sm mb-2">Power/Capacity *</label>
              <input
                type="text"
                name="power_spec"
                value={formData.power_spec}
                onChange={handleInputChange}
                placeholder="e.g., 45 HP, 500L, 7 feet"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2000"
                max="2024"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Price per Day (₹) *</label>
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleInputChange}
                min="100"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Minimum Days *</label>
              <input
                type="number"
                name="min_days"
                value={formData.min_days}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-green-200 text-sm mb-2">Maximum Days *</label>
              <input
                type="number"
                name="max_days"
                value={formData.max_days}
                onChange={handleInputChange}
                min="1"
                max="365"
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

            <div>
              <label className="block text-green-200 text-sm mb-2">Availability</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Immediately, Next week"
                className="w-full px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
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
              placeholder="Power Steering, 4WD, Diesel Engine, PTO"
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EquipmentCard = ({ equipment, onRentRequest }) => {
  const { user } = useUser();
  const [showContact, setShowContact] = useState(false);
  const [rentDays, setRentDays] = useState(equipment.min_days);
  const [totalPrice, setTotalPrice] = useState(equipment.price_per_day * equipment.min_days);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDaysChange = (e) => {
    const days = Math.min(Math.max(equipment.min_days, parseInt(e.target.value) || equipment.min_days), equipment.max_days);
    setRentDays(days);
    setTotalPrice(days * equipment.price_per_day);
  };

  const handleRentRequest = async () => {
    if (!user) {
      alert('Please sign in to make a rental request');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        equipment_listing_id: equipment.id,
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
        user_email: user.emailAddresses[0]?.emailAddress || '',
        rental_days: rentDays,
        total_price: totalPrice,
        message: `Rental request for ${rentDays} days. Total: ₹${totalPrice.toLocaleString('en-IN')}`,
        status: 'pending'
      };

      const result = await equipmentLeaseOperations.createRentalRequest(requestData);

      if (result.success) {
        onRentRequest();
        alert('Rental request sent successfully!');
      } else {
        alert('Error sending request: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending rental request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-green-300">{equipment.name}</h3>
          <p className="text-green-50">{equipment.location}, {equipment.state}</p>
        </div>
        <div className="text-right">
          <p className="text-green-300 font-semibold">₹{equipment.price_per_day.toLocaleString('en-IN')}/day</p>
          <p className="text-green-200 text-sm">{equipment.type}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center text-green-200">
          <Settings className="w-4 h-4 mr-2 text-green-400" />
          <span>{equipment.power_spec}</span>
        </div>
        <div className="flex items-center text-green-200">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
          <span>{equipment.condition}</span>
        </div>
        <div className="flex items-center text-green-200">
          <Calendar className="w-4 h-4 mr-2 text-green-400" />
          <span>{equipment.year}</span>
        </div>
        <div className="flex items-center text-green-200">
          <Clock className="w-4 h-4 mr-2 text-green-400" />
          <span>{equipment.availability || 'Available'}</span>
        </div>
      </div>

      {equipment.features && equipment.features.length > 0 && (
        <div className="mt-4">
          <h4 className="text-green-300 font-medium mb-2">Features:</h4>
          <div className="grid grid-cols-2 gap-2">
            {equipment.features.map((feature, index) => (
              <div key={index} className="flex items-center text-green-200 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {equipment.description && (
        <div className="mt-4">
          <h4 className="text-green-300 font-medium mb-2">Description:</h4>
          <p className="text-green-200 text-sm">{equipment.description}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-800/30 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-green-200">Daily Rental Rate:</span>
          <span className="text-xl font-semibold text-green-300">
            ₹{equipment.price_per_day.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-green-300 mb-2">Number of Days:</label>
          <input
            type="number"
            min={equipment.min_days}
            max={equipment.max_days}
            value={rentDays}
            onChange={handleDaysChange}
            className="w-full px-3 py-2 rounded bg-green-700/50 text-green-100 border border-green-600"
          />
          <p className="text-xs text-green-400 mt-1">
            Min: {equipment.min_days} days, Max: {equipment.max_days} days
          </p>
        </div>

        <div className="flex justify-between items-center mb-4 p-3 bg-green-700/30 rounded">
          <span className="text-green-200">Total Cost:</span>
          <span className="text-xl font-bold text-green-300">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

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
              <span>{equipment.owner_name}</span>
            </div>
            <div className="flex items-center text-green-200">
              <Phone className="w-4 h-4 mr-2 text-green-400" />
              <span>{equipment.phone}</span>
            </div>
            <div className="flex items-center text-green-200">
              <Mail className="w-4 h-4 mr-2 text-green-400" />
              <span>{equipment.email}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleRentRequest}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Rental Request'}
        </button>
      </div>
    </div>
  );
};

const EquipmentLease = () => {
  const { user, isSignedIn } = useUser();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const result = await equipmentLeaseOperations.getAllEquipmentListings();
      if (result.success) {
        setEquipment(result.data);
        setFilteredEquipment(result.data);
      } else {
        console.error('Error fetching equipment:', result.error);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedState) {
      filtered = filtered.filter(item => item.state === selectedState);
    }

    setFilteredEquipment(filtered);
  }, [searchTerm, selectedType, selectedState, equipment]);

  const handleCreateSuccess = () => {
    fetchEquipment();
  };

  const handleRentRequest = () => {
    console.log('Rental request sent successfully');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-100 mb-4">Equipment Lease Marketplace</h1>
          <p className="text-green-200 text-lg">Rent agricultural equipment or list your machinery</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          {isSignedIn ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>List Your Equipment</span>
            </button>
          ) : (
            <div className="bg-green-900/40 rounded-lg p-4 ring-1 ring-green-800/50">
              <p className="text-green-200">Please sign in to list your equipment or make rental requests</p>
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
                placeholder="Search equipment or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Equipment Types</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

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

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedState('');
              }}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Equipment Listings */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <span className="ml-2 text-green-200">Loading equipment listings...</span>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-green-200 text-lg">No equipment listings found</p>
            <p className="text-green-300 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map(item => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onRentRequest={handleRentRequest}
              />
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        <CreateEquipmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default EquipmentLease;