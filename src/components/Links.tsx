import React, { useEffect, useState } from 'react';
import { getLinks, analyzeContent, summarizeContent } from '@/api/content';
import { TabContent } from '@/types';
import AnalysisModal from './modals/AnalysisModal';
import SummaryModal from './modals/SummaryModal';

interface IframeModalProps {
  content: string;
  onClose: () => void;
}

const IframeModal: React.FC<IframeModalProps> = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 h-5/6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <iframe
          srcDoc={content}
          className="w-full h-full rounded-lg"
          title="Content Preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  html: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ id, title, url, html }) => {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [summary, setSummary] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const result = await analyzeContent(id);
      setAnalysis(result.analysis || result);
      setShowAnalysisModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSummary = async () => {
    try {
      setSummarizing(true);
      setError(null);
      const result = await summarizeContent(id);
      setSummary(result.summary || result);
      setShowSummaryModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize content');
    } finally {
      setSummarizing(false);
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
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
              analyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          <button
            onClick={handleSummary}
            disabled={summarizing}
            className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors ${
              summarizing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {summarizing ? 'Summarizing...' : 'Summary'}
          </button>
          <button
            onClick={() => setShowIframeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Content
          </button>
        </div>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      </div>
      {showAnalysisModal && analysis && (
        <AnalysisModal
          analysis={analysis}
          onClose={() => setShowAnalysisModal(false)}
        />
      )}
      {showSummaryModal && summary && (
        <SummaryModal
          summary={summary}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
      {showIframeModal && (
        <IframeModal
          content={html}
          onClose={() => setShowIframeModal(false)}
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
        setLinks(response.links);
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
              html={link.html}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;
