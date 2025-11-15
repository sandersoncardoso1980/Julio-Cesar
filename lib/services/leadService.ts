import { supabase } from '../supabase';
import { NewLeadData, Lead } from '@/types';

export const leadService = {
  async createLead(leadData: NewLeadData): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar lead: ${error.message}`);
    }

    return data;
  },

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar leads: ${error.message}`);
    }

    return data || [];
  }
};
