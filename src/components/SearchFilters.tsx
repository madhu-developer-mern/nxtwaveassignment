import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SearchFilters() {
  const { state, dispatch } = useApp();

  const specializations = [
    'Cardiologist',
    'Pediatrician',
    'Dermatologist',
    'Orthopedic Surgeon',
    'Gynecologist',
    'Neurologist'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Specialization Filter */}
        <div className="relative md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={state.selectedSpecialization}
            onChange={(e) => dispatch({ type: 'SET_SPECIALIZATION', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}