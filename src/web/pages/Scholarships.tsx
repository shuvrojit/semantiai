import React, { useEffect, useState } from 'react';
import ScholarshipCard from '@/components/ScholarshipCard';
import { fetchScholarships, IScholarship } from '@/api/jobs';
import ScholarshipModal from '@/components/modals/ScholarshipModal';

const Scholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<IScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<IScholarship | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

  useEffect(() => {
    const loadScholarships = async () => {
      try {
        const data = await fetchScholarships();
        console.log(data)
        setScholarships(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch scholarships');
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
  }, []);

  const handleCardClick = (scholarship: IScholarship) => {
    setModalMode('view');
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleCreateScholarship = () => {
    setModalMode('create');
    setSelectedScholarship(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScholarship(undefined);
  };

  const handleSaveScholarship = (scholarship: IScholarship) => {
    // Here you would typically call an API to save the scholarship
    // For now, we'll just update the local state
    if (modalMode === 'create') {
      setScholarships([...scholarships, scholarship]);
    } else if (modalMode === 'edit' && selectedScholarship) {
      setScholarships(
        scholarships.map(s => (s.id === selectedScholarship.id ? scholarship : s))
      );
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Available Scholarships</h1>
        <button
          onClick={handleCreateScholarship}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Scholarship
        </button>
      </div>
      
      {scholarships.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No scholarships available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship, index) => (
            <ScholarshipCard 
              key={index} 
              scholarship={scholarship} 
              onView={() => handleCardClick(scholarship)}
            />
          ))}
        </div>
      )}

      <ScholarshipModal
        isOpen={isModalOpen}
        scholarship={selectedScholarship}
        onClose={handleCloseModal}
        onSave={handleSaveScholarship}
        mode={modalMode}
      />
    </div>
  );
};

export default Scholarships;
