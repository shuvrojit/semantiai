import React, { useEffect, useState } from 'react';
import { getLinks, analyzeContent } from '@/api/content';
import { TabContent } from '@/types';
import AnalysisModal from './modals/AnalysisModal';

interface LinkCardProps {
  id: string;
  title: string;
  url: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ id, title, url }) => {
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const result = await analyzeContent(id);
      setAnalysis(result.analysis || result);
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 break-all mb-4"
      >
        {url}
      </a>
      <div className="mt-4">
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
            analyzing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {analyzing ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      </div>
      {showModal && analysis && (
        <AnalysisModal
          analysis={analysis}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const Links: React.FC = () => {
  const [links, setLinks] = useState<TabContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await getLinks();
        console.log(response);
        setLinks(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch links');
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-600">Loading links...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Links</h1>
      {(!links || links.length === 0) ? (
        <div className="text-gray-600 text-center py-8">No links found</div>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => (
            <LinkCard 
              key={`${link.url}-${index}`}
              id={link._id}
              title={link.title}
              url={link.url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;
