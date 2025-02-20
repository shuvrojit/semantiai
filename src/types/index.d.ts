export interface TabContent {
  text: string;
  title: string;
  url: string;
}

export interface ContentState {
  isLoading: boolean;
  error: string | null;
  content: TabContent | null;
}

export interface LinksResponse {
  links: TabContent[];
  total: number;
}

export interface Job {
  // Basic Info
  id: string;
  job_title: string;
  job_position: string;

  // Company Details
  company_name: string;
  company_logo: string;
  company_culture: string;

  // Location & Work Style
  job_location: string;
  workplace: "remote" | "on-site" | "hybrid";

  // Employment Details
  job_type: ("contract" | "full-time" | "part-time")[];
  salary: string;

  // Dates
  due_date: string;
  saved_date: string;
  posted_date: string; // Added this

  // Job Details
  job_description: string;
  responsibilities: string[];
  requirements: string[];
  tech_stack: string[];
  additional_skills?: string[];
  professional_experience: number;

  // Categories and URLs
  job_category: string;
  job_category_id: string;
  url: string;

  // Additional Suggested Fields
  benefits?: string[];
  application_process?: string;
  contact_info?: string;
  is_featured?: boolean;
  total_positions?: number;
  status: "active" | "closed" | "draft";
}
