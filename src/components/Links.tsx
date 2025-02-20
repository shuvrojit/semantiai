import React from 'react';

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
  // Example links - these would typically come from a data source
  const links = [
    {
      title: "Documentation",
      url: "https://docs.example.com"
    },
    {
      title: "GitHub Repository",
      url: "https://github.com/example/repo"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Links</h1>
      <div className="space-y-4">
        {links.map((link, index) => (
          <LinkCard key={index} {...link} />
        ))}
      </div>
    </div>
  );
};

export default Links;
