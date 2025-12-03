import { User } from '../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../types/UserTypes';

export class UserRepository {
  async findById(id: string) {
    return User.findByPk(id);
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async create(userData: CreateUserDTO) {
    return User.create(userData);
  }

  async update(id: string, updates: UpdateUserDTO) {
    await User.update(updates, { where: { id } });
    return this.findById(id);
  }

  async delete(id: string) {
    return User.destroy({ where: { id } });
  }

  async findAll() {
    return User.findAll({
      order: [['created_at', 'DESC']],
    });
  }
}

export const userRepository = new UserRepository();
