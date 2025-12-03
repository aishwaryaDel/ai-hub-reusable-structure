import { VALIDATION_MESSAGES } from '../constants/messages';
import { CreateUseCaseDTO, UpdateUseCaseDTO } from '../types/UseCaseTypes';
import { CreateUserDTO, UpdateUserDTO } from '../types/UserTypes';

const VALID_STATUSES = ['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived'];
const VALID_DEPARTMENTS = ['Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations'];

export class ValidationService {
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUseCaseData(data: CreateUseCaseDTO): string | null {
    if (!data.title || data.title.trim().length === 0) {
      return VALIDATION_MESSAGES.TITLE_REQUIRED;
    }

    if (!data.short_description || data.short_description.trim().length === 0) {
      return VALIDATION_MESSAGES.SHORT_DESCRIPTION_REQUIRED;
    }

    if (!data.full_description || data.full_description.trim().length === 0) {
      return VALIDATION_MESSAGES.FULL_DESCRIPTION_REQUIRED;
    }

    if (!data.department || !VALID_DEPARTMENTS.includes(data.department)) {
      return `${VALIDATION_MESSAGES.INVALID_DEPARTMENT} ${VALID_DEPARTMENTS.join(', ')}`;
    }

    if (!data.status || !VALID_STATUSES.includes(data.status)) {
      return `${VALIDATION_MESSAGES.INVALID_STATUS} ${VALID_STATUSES.join(', ')}`;
    }

    if (!data.owner_name || data.owner_name.trim().length === 0) {
      return VALIDATION_MESSAGES.OWNER_NAME_REQUIRED;
    }

    if (!data.owner_email || !this.isValidEmail(data.owner_email)) {
      return VALIDATION_MESSAGES.OWNER_EMAIL_REQUIRED;
    }

    if (!Array.isArray(data.technology_stack)) {
      return VALIDATION_MESSAGES.TECHNOLOGY_STACK_ARRAY;
    }

    if (!Array.isArray(data.tags)) {
      return VALIDATION_MESSAGES.TAGS_ARRAY;
    }

    if (!data.internal_links || typeof data.internal_links !== 'object') {
      return VALIDATION_MESSAGES.INTERNAL_LINKS_OBJECT;
    }

    return null;
  }

  validateUseCaseUpdateData(data: UpdateUseCaseDTO): string | null {
    if (data.status && !VALID_STATUSES.includes(data.status)) {
      return `${VALIDATION_MESSAGES.INVALID_STATUS} ${VALID_STATUSES.join(', ')}`;
    }

    if (data.department && !VALID_DEPARTMENTS.includes(data.department)) {
      return `${VALIDATION_MESSAGES.INVALID_DEPARTMENT} ${VALID_DEPARTMENTS.join(', ')}`;
    }

    if (data.owner_email && !this.isValidEmail(data.owner_email)) {
      return VALIDATION_MESSAGES.INVALID_EMAIL;
    }

    if (data.technology_stack && !Array.isArray(data.technology_stack)) {
      return VALIDATION_MESSAGES.TECHNOLOGY_STACK_ARRAY;
    }

    if (data.tags && !Array.isArray(data.tags)) {
      return VALIDATION_MESSAGES.TAGS_ARRAY;
    }

    if (data.internal_links && typeof data.internal_links !== 'object') {
      return VALIDATION_MESSAGES.INTERNAL_LINKS_OBJECT;
    }

    return null;
  }

  validateUserData(data: CreateUserDTO): string | null {
    if (!data.email || !this.isValidEmail(data.email)) {
      return VALIDATION_MESSAGES.EMAIL_REQUIRED;
    }

    if (!data.password || data.password.length < 6) {
      return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }

    if (!data.name || data.name.trim().length === 0) {
      return VALIDATION_MESSAGES.NAME_REQUIRED;
    }

    if (!data.role || data.role.trim().length === 0) {
      return VALIDATION_MESSAGES.ROLE_REQUIRED;
    }

    return null;
  }

  validateUserUpdateData(data: UpdateUserDTO): string | null {
    if (data.email && !this.isValidEmail(data.email)) {
      return VALIDATION_MESSAGES.INVALID_EMAIL;
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      return VALIDATION_MESSAGES.NAME_EMPTY;
    }

    if (data.role !== undefined && data.role.trim().length === 0) {
      return VALIDATION_MESSAGES.ROLE_EMPTY;
    }

    return null;
  }

  validateLoginCredentials(email: string, password: string): string | null {
    if (!email || !password) {
      return 'Email and password are required';
    }
    return null;
  }
}

export const validationService = new ValidationService();
