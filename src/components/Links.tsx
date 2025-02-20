import React, { useEffect, useState } from 'react';
import { getLinks } from '@/api/content';
import { TabContent } from '@/types';

interface LinkCardProps {
  title: string;
  url: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ title, url }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 break-all"
      >
        {url}
      </a>
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
        setLinks(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch links');
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
      {links.length === 0 ? (
        <div className="text-gray-600 text-center py-8">No links found</div>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => (
            <LinkCard key={`${link.url}-${index}`} title={link.title} url={link.url} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;
