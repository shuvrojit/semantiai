import React, { useState } from 'react';
import { Job } from '../types/jobs';
import JobDescriptionModal from './modals/JobDescriptionModal';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.job_position}</h3>
            <p className="text-gray-600">{job.company_title}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            job.status === 'active' ? 'bg-green-100 text-green-800' :
            job.status === 'filled' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.job_location} • {job.workplace}
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.job_type}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {job.tech_stack.slice(0, 3).map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {tech}
              </span>
            ))}
            {job.tech_stack.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                +{job.tech_stack.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <JobDescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
      />
    </>
  );
};

export default JobCard;