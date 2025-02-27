import React, { useState, useRef, useEffect } from 'react';

interface Scholarship {
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
  additional_info?: Record<string, any>;
}

interface ScholarshipModalProps {
  isOpen: boolean;
  scholarship?: Scholarship;
  onClose: () => void;
  onSave: (scholarship: Scholarship) => void;
  mode: 'view' | 'edit' | 'create';
}

const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  isOpen,
  scholarship,
  onClose,
  onSave,
  mode
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Move all hooks to the top before any conditional returns
  const [formData, setFormData] = useState<Scholarship>({
    title: scholarship?.title || '',
    organization: scholarship?.organization || '',
    amount: scholarship?.amount || '',
    deadline: scholarship?.deadline || new Date(),
    eligibility: scholarship?.eligibility || [''],
    requirements: scholarship?.requirements || [''],
    field_of_study: scholarship?.field_of_study || [''],
    degree_level: scholarship?.degree_level || [''],
    country: scholarship?.country || '',
    link: scholarship?.link || '',
    status: scholarship?.status || 'active',
    additional_info: scholarship?.additional_info || {}
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Scholarship, string>>>({});

  // Update formData when scholarship changes
  useEffect(() => {
    if (scholarship) {
      setFormData({
        title: scholarship.title,
        organization: scholarship.organization,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
        eligibility: scholarship.eligibility,
        requirements: scholarship.requirements,
        field_of_study: scholarship.field_of_study,
        degree_level: scholarship.degree_level,
        country: scholarship.country,
        link: scholarship.link,
        status: scholarship.status,
        additional_info: scholarship.additional_info || {}
      });
    }
  }, [scholarship]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const handleArrayFieldChange = (
    field: keyof Pick<Scholarship, 'eligibility' | 'requirements' | 'field_of_study' | 'degree_level'>,
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (
    field: keyof Pick<Scholarship, 'eligibility' | 'requirements' | 'field_of_study' | 'degree_level'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (
    field: keyof Pick<Scholarship, 'eligibility' | 'requirements' | 'field_of_study' | 'degree_level'>,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Scholarship, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
    
    const arrayFields = ['eligibility', 'requirements', 'field_of_study', 'degree_level'] as const;
    arrayFields.forEach(field => {
      const values = formData[field];
      if (!Array.isArray(values) || values.length === 0 || values.some(item => !item.trim())) {
        newErrors[field] = `At least one ${field.replace('_', ' ')} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (mode === 'view') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
        >
          <div className="sticky top-0 bg-white p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{scholarship?.title}</h2>
                <p className="text-xl text-gray-600">{scholarship?.organization}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {scholarship?.country}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Deadline: {scholarship?.deadline && formatDate(scholarship.deadline)}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Amount: {scholarship?.amount}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status: {scholarship?.status.charAt(0).toUpperCase() + scholarship?.status.slice(1)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Field of Study</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship?.field_of_study.map((field, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Degree Level</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship?.degree_level.map((level, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {scholarship?.eligibility && scholarship.eligibility.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {scholarship.eligibility.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {scholarship?.requirements && scholarship.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {scholarship.requirements.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {scholarship?.additional_info && Object.keys(scholarship.additional_info).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(scholarship.additional_info).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-700">{key}</dt>
                      <dd className="text-gray-600">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white p-6 border-t mt-6">
            <div className="flex justify-end gap-4">
              <a
                href={scholarship?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                Apply Now
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
      >
        <div className="sticky top-0 bg-white p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Scholarship' : 'Create Scholarship'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                value={formData.organization}
                onChange={e => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
            </div>
          </div>

          {/* Amount and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="text"
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={formData.deadline.toISOString().split('T')[0]}
                onChange={e => setFormData(prev => ({ ...prev, deadline: new Date(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Country and Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                status: e.target.value as 'active' | 'expired' | 'upcoming'
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Array Fields */}
          {(['eligibility', 'requirements', 'field_of_study', 'degree_level'] as const).map(field => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              {formData[field].map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayFieldChange(field, index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(field, index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(field)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add {field.replace('_', ' ')}
              </button>
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
        </form>

        <div className="sticky bottom-0 bg-white p-6 border-t">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {mode === 'edit' ? 'Save Changes' : 'Create Scholarship'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipModal;
