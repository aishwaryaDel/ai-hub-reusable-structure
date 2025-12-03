export interface UseCaseAttributes {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  department: string;
  status: string;
  owner_name: string;
  owner_email: string;
  image_url?: string;
  business_impact?: string;
  technology_stack: string[];
  internal_links: object;
  tags: string[];
  related_use_case_ids: string[];
  created_at?: Date;
  updated_at?: Date;
  application_url?: string;
}

import { Optional } from 'sequelize';
export interface UseCaseCreationAttributes extends Optional<UseCaseAttributes, 'id' | 'created_at' | 'updated_at'> {}
export interface CreateUseCaseDTO {
  title: string;
  short_description: string;
  full_description: string;
  department: string;
  status: string;
  owner_name: string;
  owner_email: string;
  image_url?: string;
  business_impact?: string;
  technology_stack: string[];
  internal_links: object;
  tags: string[];
  related_use_case_ids?: string[];
  application_url?: string;
}

export interface UpdateUseCaseDTO {
  title?: string;
  short_description?: string;
  full_description?: string;
  department?: string;
  status?: string;
  owner_name?: string;
  owner_email?: string;
  image_url?: string;
  business_impact?: string;
  technology_stack?: string[];
  internal_links?: object;
  tags?: string[];
  related_use_case_ids?: string[];
  application_url?: string;
}
