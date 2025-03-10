import React, { useEffect, useState } from 'react';

interface Tab {
  id: string;
  title: string;
  url: string;
  favIconUrl?: string;
}

const Tabs: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder for actual tab fetching logic
    const loadTabs = async () => {
      try {
        // This would be replaced with actual API call
        const mockTabs = [
          { id: '1', title: 'Example Tab', url: 'https://example.com' }
        ];
        setTabs(mockTabs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tabs');
      } finally {
        setIsLoading(false);
      }
    };

    loadTabs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Open Tabs</h1>
      <div className="grid grid-cols-1 gap-4">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {tab.favIconUrl && (
              <img 
                src={tab.favIconUrl} 
                alt=""
                className="w-6 h-6 mr-4"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{tab.title}</h3>
              <p className="text-sm text-gray-500">{tab.url}</p>
            </div>
          </div>
        ))}
        {tabs.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No open tabs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
