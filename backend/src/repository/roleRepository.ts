import { Role } from '../models/Role';
import { logTrace, logException } from '../utils/appInsights';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    try {
      logTrace('RoleRepository: Finding all roles');
      return await Role.findAll();
    } catch (error) {
      logException(error as Error, { context: 'roleRepository.findAll' });
      throw error;
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      logTrace('RoleRepository: Finding role by name', { name });
      return await Role.findOne({ where: { name } });
    } catch (error) {
      logException(error as Error, { context: 'roleRepository.findByName' });
      throw error;
    }
  }
}

export const roleRepository = new RoleRepository();
