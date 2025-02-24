import React from 'react';

interface IScholarship {
  title: string;
  organization: string;
  amount: string;
  deadline: Date;
  eligibility: string[];
  requirements: string[];
  field_of_study: string[];
  degree_level: string[];
  country: string;
  link: string;
  status: 'active' | 'expired' | 'upcoming';
  additional_info?: Map<string, any>;
}

interface ScholarshipCardProps {
  scholarship: IScholarship;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const {
    title,
    organization,
    amount,
    deadline,
    status,
    country,
    field_of_study,
    degree_level,
  } = scholarship;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{organization}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-medium text-gray-900">{amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deadline</p>
          <p className="font-medium text-gray-900">
            {new Date(deadline).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Country</p>
          <p className="font-medium text-gray-900">{country}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Fields of Study</p>
        <div className="flex flex-wrap gap-2">
          {field_of_study.map((field, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Degree Levels</p>
        <div className="flex flex-wrap gap-2">
          {degree_level.map((level, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
            >
              {level}
            </span>
          ))}
        </div>
      </div>

      <a
        href={scholarship.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Apply Now
      </a>
    </div>
  );
};

export default ScholarshipCard;
