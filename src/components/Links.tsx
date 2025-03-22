import React, { useEffect, useState, useCallback } from 'react';
import { getLinks, analyzeContent, summarizeContent, getAllContent } from '@/api/content';
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
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchFields, setSearchFields] = useState<('title' | 'text' | 'url')[]>(['title', 'url']);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getAllContent({
        page,
        limit,
        search: search || undefined,
        sortBy,
        sortOrder,
        searchFields: search ? searchFields : undefined
      });
      
      setLinks(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page, limit, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchContent();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading && links.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-600">Loading content...</div>
      </div>
    );
  }

  if (error && links.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Saved Content</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="flex items-center">
            <label className="mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
              <option value="url">URL</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border rounded"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2">Per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to first page when changing limit
              }}
              className="px-3 py-1 border rounded"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-600">Refreshing content...</div>
        </div>
      )}

      {links.length === 0 ? (
        <div className="text-gray-600 text-center py-8">No content found</div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <LinkCard 
              key={link._id}
              id={link._id}
              title={link.title}
              url={link.url}
              html={link.html}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-8">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    page === pageNum 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500 mb-8">
        Showing {links.length} of {totalItems} items
      </div>
    </div>
  );
};

export default Links;
