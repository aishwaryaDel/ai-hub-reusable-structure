import { supabase } from '../config/supabase';
import { CreateUseCaseDTO, UpdateUseCaseDTO, UseCaseAttributes } from '../types/UseCaseTypes';

export class UseCaseRepository {
  async findById(id: string): Promise<UseCaseAttributes | null> {
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(useCaseData: CreateUseCaseDTO): Promise<UseCaseAttributes> {
    const safeData = {
      ...useCaseData,
      related_use_case_ids: useCaseData.related_use_case_ids || [],
    };

    const { data, error } = await supabase
      .from('use_cases')
      .insert(safeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: UpdateUseCaseDTO): Promise<UseCaseAttributes> {
    const { data, error } = await supabase
      .from('use_cases')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('use_cases')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async findAll(): Promise<UseCaseAttributes[]> {
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const useCaseRepository = new UseCaseRepository();
