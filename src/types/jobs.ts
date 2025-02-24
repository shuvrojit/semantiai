export interface Job {
  _id: string;
  company_title?: string;
  job_position?: string;
  job_location?: string;
  job_type: 'contract' | 'full time' | 'part time';
  workplace?: 'remote' | 'on-site' | 'hybrid';
  due_date?: Date;
  tech_stack: string[];
  responsibilities?: string[];
  professional_experience?: number;
  contact_email?: string;
  requirements?: string[];
  additional_skills?: string[];
  company_culture?: string;
  status: 'active' | 'filled' | 'expired' | 'draft';
  salary?: string;
  additional_info?: Record<string, any>;
  extra_data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
