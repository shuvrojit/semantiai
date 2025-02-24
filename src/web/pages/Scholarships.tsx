import React, { useEffect, useState } from 'react';
import ScholarshipCard from '@/components/ScholarshipCard';
import { fetchScholarships, IScholarship } from '@/api/jobs';

const Scholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<IScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Scholarships</h1>
      {scholarships.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No scholarships available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship, index) => (
            <ScholarshipCard key={index} scholarship={scholarship} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
