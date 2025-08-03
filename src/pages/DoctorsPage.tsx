import React from 'react';
import { SearchFilters } from '../components/SearchFilters';
import { DoctorCard } from '../components/DoctorCard';
import { useApp } from '../context/AppContext';
import { Users } from 'lucide-react';

export function DoctorsPage() {
  const { getFilteredDoctors } = useApp();
  const filteredDoctors = getFilteredDoctors();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Our Doctors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and book appointments with our qualified healthcare professionals.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria to find more doctors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}