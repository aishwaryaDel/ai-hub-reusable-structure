import { UseCase } from '../models/UseCase';
import { CreateUseCaseDTO, UpdateUseCaseDTO, UseCaseCreationAttributes } from '../types/UseCaseTypes';

export class UseCaseRepository {
  async findById(id: string) {
    return UseCase.findByPk(id);
  }
  async create(useCaseData: CreateUseCaseDTO) {
    const safeData = {
      ...useCaseData,
      related_use_case_ids: useCaseData.related_use_case_ids ? useCaseData.related_use_case_ids : [],
    } as UseCaseCreationAttributes;
    return UseCase.create(safeData);
  }
  async update(id: string, updates: UpdateUseCaseDTO) {
    return UseCase.update(updates, { where: { id } });
  }
  async delete(id: string) {
    return UseCase.destroy({ where: { id } });
  }
  async findAll() {
    return UseCase.findAll();
  }
}

export const useCaseRepository = new UseCaseRepository();
