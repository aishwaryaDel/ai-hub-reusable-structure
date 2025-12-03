export interface UseCase {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  benefits: string;
  department: string;
  status: string;
  application_url?: string;
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
  owner_name?: string;
  owner_email?: string;
  business_impact?: string;
  technology_stack?: string[];
  tags?: string[];
  internal_links?: Record<string, string>;
  related_use_case_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUseCaseDTO {
  title: string;
  short_description: string;
  full_description: string;
  benefits?: string;
  department: string;
  status: string;
  owner_name?: string;
  owner_email?: string;
  business_impact?: string;
  technology_stack?: string[];
  tags?: string[];
  application_url?: string;
  internal_links?: Record<string, string>;
  related_use_case_ids?: string[];
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}

export interface UpdateUseCaseDTO {
  title?: string;
  short_description?: string;
  full_description?: string;
  benefits?: string;
  department?: string;
  status?: string;
  owner_name?: string;
  owner_email?: string;
  business_impact?: string;
  technology_stack?: string[];
  tags?: string[];
  application_url?: string;
  internal_links?: Record<string, string>;
  related_use_case_ids?: string[];
  sharepoint_url?: string;
  confluence_url?: string;
  image_url?: string;
}

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type { Department, UseCaseStatus } from '../constants/constants';
